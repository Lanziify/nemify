'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import axios from 'axios';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { signUpEmailSchema, SignUpEmailValues } from '../../schema/auth.schema';
import { safeCatch } from '@/lib/errors/safe-catch';
import { AuthService } from '../../services/auth.service';
import { authClient } from '@/utils/auth-client';
import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

type WizardStep =
  | 'account'
  | 'verify-email'
  | 'campus'
  | 'roles'
  | 'departments'
  | 'done';

interface CampusData {
  id: string;
  name: string;
  slug: string;
}

// ─── Step indicator ───────────────────────────────────────────────────────────

const STEPS: { key: WizardStep; label: string }[] = [
  { key: 'account', label: 'Account' },
  { key: 'verify-email', label: 'Verify Email' },
  { key: 'campus', label: 'Campus' },
  { key: 'roles', label: 'Roles' },
  { key: 'departments', label: 'Departments' },
];

function StepIndicator({ current }: { current: WizardStep }) {
  const stepKeys = STEPS.map((s) => s.key);
  const currentIndex = stepKeys.indexOf(current);

  return (
    <div className="mb-6 flex items-center gap-2">
      {STEPS.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isActive = index === currentIndex;
        return (
          <React.Fragment key={step.key}>
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors',
                  isCompleted && 'bg-primary text-primary-foreground',
                  isActive &&
                    'border-primary bg-background text-foreground border-2',
                  !isCompleted && !isActive && 'bg-muted text-muted-foreground'
                )}>
                {isCompleted ? '✓' : index + 1}
              </div>
              <span
                className={cn(
                  'hidden text-xs sm:block',
                  isActive
                    ? 'text-foreground font-medium'
                    : 'text-muted-foreground'
                )}>
                {step.label}
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <div
                className={cn(
                  'mb-4 h-px flex-1 transition-colors',
                  isCompleted ? 'bg-primary' : 'bg-muted'
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ─── Slug helper ──────────────────────────────────────────────────────────────

function toSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

// ─── Step 1 – Account ─────────────────────────────────────────────────────────

interface AccountStepProps {
  onSuccess: () => void;
  credentials: React.MutableRefObject<{ email: string; password: string }>;
}

function AccountStep({ onSuccess, credentials }: AccountStepProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpEmailValues>({
    resolver: zodResolver(signUpEmailSchema),
    defaultValues: { name: '', email: '', password: '' },
  });

  const onSubmit = async (values: SignUpEmailValues) => {
    setIsLoading(true);

    const setupResult = await safeCatch(() =>
      axios.post<ReturnType<AuthService['createFirstAdmin']>>(
        '/api/system/setup',
        values
      )
    );

    if (setupResult.error) {
      toast.error(setupResult.error.message);
      setIsLoading(false);
      return;
    }

    credentials.current = { email: values.email, password: values.password };
    toast.success('Admin account created! Check your email to verify.');
    setIsLoading(false);
    onSuccess();
  };

  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Create Admin Account
        </CardTitle>
        <CardDescription>
          Set up the system administrator account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          autoComplete="off">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-destructive text-sm">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@example.com"
              autoComplete="new-email"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-destructive text-sm">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              {...register('password')}
            />
            {errors.password && (
              <p className="text-destructive text-sm">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading ? 'Creating account…' : 'Create Account & Continue'}
          </Button>
        </form>
      </CardContent>
    </>
  );
}

// ─── Step 2 – Verify Email ───────────────────────────────────────────────────

interface VerifyEmailStepProps {
  credentials: React.MutableRefObject<{ email: string; password: string }>;
  onSuccess: () => void;
}

function VerifyEmailStep({ credentials, onSuccess }: VerifyEmailStepProps) {
  const [isVerifying, setIsVerifying] = React.useState(false);
  const [isResending, setIsResending] = React.useState(false);
  const [verifyError, setVerifyError] = React.useState<string | null>(null);

  const handleContinue = async () => {
    setIsVerifying(true);
    setVerifyError(null);

    const { error } = await authClient.signIn.email({
      email: credentials.current.email,
      password: credentials.current.password,
    });

    setIsVerifying(false);

    if (error) {
      setVerifyError(
        error.message?.toLowerCase().includes('verif')
          ? 'Email not verified yet. Please click the link in your inbox.'
          : (error.message ?? 'Sign-in failed. Please try again.')
      );
      return;
    }

    onSuccess();
  };

  const handleResend = async () => {
    setIsResending(true);

    const { error } = await authClient.sendVerificationEmail({
      email: credentials.current.email,
      callbackURL: '/setup',
    });

    setIsResending(false);

    if (error) {
      toast.error(error.message ?? 'Failed to resend verification email.');
      return;
    }

    toast.success('Verification email resent!');
  };

  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Verify Your Email</CardTitle>
        <CardDescription>
          A verification link was sent to{' '}
          <span className="text-foreground font-medium">
            {credentials.current.email}
          </span>
          . Click the link in the email to continue.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-muted rounded-lg p-4 text-sm">
          <p className="font-medium">What to do next</p>
          <ol className="text-muted-foreground mt-2 list-inside list-decimal space-y-1">
            <li>Open your email inbox</li>
            <li>Find the email from Nemify</li>
            <li>Click the verification link</li>
            <li>Return here and click "Continue"</li>
          </ol>
        </div>

        {verifyError && (
          <p className="text-destructive text-sm">{verifyError}</p>
        )}

        <Button
          className="w-full"
          type="button"
          onClick={handleContinue}
          disabled={isVerifying}>
          {isVerifying
            ? 'Checking verification…'
            : "I've verified my email → Continue"}
        </Button>

        <Button
          variant="ghost"
          className="w-full"
          type="button"
          onClick={handleResend}
          disabled={isResending}>
          {isResending ? 'Resending…' : 'Resend verification email'}
        </Button>
      </CardContent>
    </>
  );
}

// ─── Step 3 – Campus ──────────────────────────────────────────────────────────

const campusWizardSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Campus name is required')
    .max(100, 'Campus name must be less than 100 characters'),
  slug: z
    .string()
    .trim()
    .min(3, 'Slug must be at least 3 characters')
    .max(50, 'Slug must be less than 50 characters'),
});

type CampusWizardValues = z.infer<typeof campusWizardSchema>;

interface CampusStepProps {
  onSuccess: (campus: CampusData) => void;
  onSkip: () => void;
}

function CampusStep({ onSuccess, onSkip }: CampusStepProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CampusWizardValues>({
    resolver: zodResolver(campusWizardSchema),
    defaultValues: { name: '', slug: '' },
  });

  const nameValue = watch('name');

  React.useEffect(() => {
    setValue('slug', toSlug(nameValue), { shouldValidate: false });
  }, [nameValue, setValue]);

  const onSubmit = async (values: CampusWizardValues) => {
    setIsLoading(true);

    const createResult = await safeCatch(() =>
      axios.post('/api/campus/create', {
        name: values.name,
        slug: values.slug,
        keepCurrentActiveOrganization: false,
      })
    );

    if (createResult.error) {
      toast.error(createResult.error.message);
      setIsLoading(false);
      return;
    }

    const campusResult = await safeCatch(() =>
      axios.get<CampusData>(`/api/campus/by-slug/${values.slug}`)
    );

    if (campusResult.error) {
      toast.error('Campus created but could not retrieve details.');
      setIsLoading(false);
      return;
    }

    toast.success('Campus created!');
    setIsLoading(false);
    onSuccess(campusResult.data.data);
  };

  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Create a Campus</CardTitle>
        <CardDescription>
          Set up your first campus. You can add more later from the dashboard.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="campusName">Campus Name</Label>
            <Input
              id="campusName"
              type="text"
              placeholder="Main Campus"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-destructive text-sm">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="campusSlug">Slug</Label>
            <Input
              id="campusSlug"
              type="text"
              placeholder="main-campus"
              {...register('slug')}
            />
            {errors.slug && (
              <p className="text-destructive text-sm">{errors.slug.message}</p>
            )}
            <p className="text-muted-foreground text-xs">
              Used in URLs. Auto-generated from the name.
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              type="button"
              className="flex-1"
              onClick={onSkip}>
              Skip for now
            </Button>
            <Button className="flex-1" type="submit" disabled={isLoading}>
              {isLoading ? 'Creating…' : 'Create Campus'}
            </Button>
          </div>
        </form>
      </CardContent>
    </>
  );
}

// ─── Step 4 – Roles ───────────────────────────────────────────────────────────

interface RolesStepProps {
  campus: CampusData;
  onSuccess: () => void;
  onSkip: () => void;
}

function RolesStep({ campus, onSuccess, onSkip }: RolesStepProps) {
  const [roles, setRoles] = React.useState<string[]>([]);
  const [input, setInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const addRole = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    if (roles.includes(trimmed)) {
      toast.error('This role already exists.');
      return;
    }
    setRoles((prev) => [...prev, trimmed]);
    setInput('');
  };

  const removeRole = (role: string) => {
    setRoles((prev) => prev.filter((r) => r !== role));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addRole();
    }
  };

  const handleContinue = async () => {
    if (roles.length === 0) {
      onSkip();
      return;
    }

    setIsLoading(true);

    for (const role of roles) {
      const result = await safeCatch(() =>
        axios.post(`/api/campus/${campus.id}/roles`, {
          organizationId: campus.id,
          role,
          permission: {},
        })
      );

      if (result.error) {
        toast.error(`Failed to create role "${role}": ${result.error.message}`);
        setIsLoading(false);
        return;
      }
    }

    toast.success(
      `${roles.length} role${roles.length > 1 ? 's' : ''} created!`
    );
    setIsLoading(false);
    onSuccess();
  };

  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Add Campus Roles</CardTitle>
        <CardDescription>
          Define roles for{' '}
          <span className="text-foreground font-medium">{campus.name}</span>.
          Permissions can be configured later in the dashboard.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="e.g. Faculty, Staff, Student"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button type="button" variant="outline" onClick={addRole}>
            Add
          </Button>
        </div>

        {roles.length > 0 ? (
          <div className="space-y-2">
            <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              Roles to create
            </p>
            <div className="flex flex-wrap gap-2">
              {roles.map((role) => (
                <Badge
                  key={role}
                  variant="secondary"
                  className="cursor-pointer gap-1"
                  onClick={() => removeRole(role)}>
                  {role}
                  <span className="opacity-60 hover:opacity-100">×</span>
                </Badge>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">
            No roles added yet. Press Enter or click "Add" to add a role.
          </p>
        )}

        <Separator />

        <div className="flex gap-2">
          <Button
            variant="outline"
            type="button"
            className="flex-1"
            onClick={onSkip}
            disabled={isLoading}>
            Skip
          </Button>
          <Button
            className="flex-1"
            type="button"
            onClick={handleContinue}
            disabled={isLoading}>
            {isLoading
              ? 'Creating roles…'
              : roles.length > 0
                ? `Create ${roles.length} Role${roles.length > 1 ? 's' : ''}`
                : 'Continue'}
          </Button>
        </div>
      </CardContent>
    </>
  );
}

// ─── Step 5 – Departments ─────────────────────────────────────────────────────

interface DepartmentsStepProps {
  campus: CampusData;
  onSuccess: () => void;
  onSkip: () => void;
}

function DepartmentsStep({ campus, onSuccess, onSkip }: DepartmentsStepProps) {
  const [departments, setDepartments] = React.useState<string[]>([]);
  const [input, setInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const addDepartment = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    if (departments.includes(trimmed)) {
      toast.error('This department already exists.');
      return;
    }
    setDepartments((prev) => [...prev, trimmed]);
    setInput('');
  };

  const removeDepartment = (dept: string) => {
    setDepartments((prev) => prev.filter((d) => d !== dept));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addDepartment();
    }
  };

  const handleContinue = async () => {
    if (departments.length === 0) {
      onSkip();
      return;
    }

    setIsLoading(true);

    for (const name of departments) {
      const { error } = await authClient.organization.createTeam({
        name,
        organizationId: campus.id,
      });

      if (error) {
        toast.error(`Failed to create department "${name}": ${error.message}`);
        setIsLoading(false);
        return;
      }
    }

    toast.success(
      `${departments.length} department${departments.length > 1 ? 's' : ''} created!`
    );
    setIsLoading(false);
    onSuccess();
  };

  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Add Departments</CardTitle>
        <CardDescription>
          Create departments under{' '}
          <span className="text-foreground font-medium">{campus.name}</span>.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="e.g. Engineering, Science, Arts"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button type="button" variant="outline" onClick={addDepartment}>
            Add
          </Button>
        </div>

        {departments.length > 0 ? (
          <div className="space-y-2">
            <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              Departments to create
            </p>
            <div className="flex flex-wrap gap-2">
              {departments.map((dept) => (
                <Badge
                  key={dept}
                  variant="secondary"
                  className="cursor-pointer gap-1"
                  onClick={() => removeDepartment(dept)}>
                  {dept}
                  <span className="opacity-60 hover:opacity-100">×</span>
                </Badge>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">
            No departments added yet. Press Enter or click "Add" to add a
            department.
          </p>
        )}

        <Separator />

        <div className="flex gap-2">
          <Button
            variant="outline"
            type="button"
            className="flex-1"
            onClick={onSkip}
            disabled={isLoading}>
            Skip
          </Button>
          <Button
            className="flex-1"
            type="button"
            onClick={handleContinue}
            disabled={isLoading}>
            {isLoading
              ? 'Creating departments…'
              : departments.length > 0
                ? `Create ${departments.length} Department${departments.length > 1 ? 's' : ''}`
                : 'Continue'}
          </Button>
        </div>
      </CardContent>
    </>
  );
}

// ─── Step 6 – Done ────────────────────────────────────────────────────────────

interface DoneStepProps {
  campus: CampusData | null;
}

function DoneStep({ campus }: DoneStepProps) {
  const router = useRouter();

  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Setup Complete!</CardTitle>
        <CardDescription>
          Your platform is ready. Sign in to access the dashboard.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {campus && (
          <div className="bg-muted rounded-lg p-4 text-sm">
            <p className="font-medium">Campus created</p>
            <p className="text-muted-foreground">{campus.name}</p>
          </div>
        )}

        <p className="text-muted-foreground text-sm">
          You can manage campuses, roles, departments, and members from the
          admin dashboard after signing in.
        </p>

        <Button className="w-full" onClick={() => router.push('/signin')}>
          Go to Sign In
        </Button>
      </CardContent>
    </>
  );
}

// ─── Main wizard ──────────────────────────────────────────────────────────────

export function UserCreationForm() {
  const [step, setStep] = React.useState<WizardStep>('account');
  const [campus, setCampus] = React.useState<CampusData | null>(null);
  const credentials = React.useRef<{ email: string; password: string }>({
    email: '',
    password: '',
  });

  // If the user verified their email via the link (autoSignInAfterVerification
  // redirects back to /setup with a live session), detect it on mount and skip
  // straight to the campus step.
  React.useEffect(() => {
    authClient.getSession().then((result) => {
      if (result.data?.user?.emailVerified) {
        setStep('campus');
      }
    });
  }, []);

  return (
    <div className="bg-muted/40 flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="px-6 pt-6">
          {step !== 'done' && <StepIndicator current={step} />}
        </div>

        {step === 'account' && (
          <AccountStep
            credentials={credentials}
            onSuccess={() => setStep('verify-email')}
          />
        )}

        {step === 'verify-email' && (
          <VerifyEmailStep
            credentials={credentials}
            onSuccess={() => setStep('campus')}
          />
        )}

        {step === 'campus' && (
          <CampusStep
            onSuccess={(c) => {
              setCampus(c);
              setStep('roles');
            }}
            onSkip={() => setStep('done')}
          />
        )}

        {step === 'roles' && campus && (
          <RolesStep
            campus={campus}
            onSuccess={() => setStep('departments')}
            onSkip={() => setStep('departments')}
          />
        )}

        {step === 'departments' && campus && (
          <DepartmentsStep
            campus={campus}
            onSuccess={() => setStep('done')}
            onSkip={() => setStep('done')}
          />
        )}

        {step === 'done' && <DoneStep campus={campus} />}
      </Card>
    </div>
  );
}
