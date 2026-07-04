'use client';

import React from 'react';
import {
  Stepper,
  StepperContent,
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperPanel,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from '@/components/ui/stepper';
import { CreateCampusFormValues } from '@/feature/campus/schema/campus.schema';
import { cn } from '@/lib/utils';
import { AdminAccountSetupFormValues } from '@/feature/onboarding/schema/admin-account.schema';
import AdminAccountStep from '@/feature/onboarding/components/wizard-steps/admin-account-setup';
import CreateCampusStep from '@/feature/onboarding/components/wizard-steps/create-campus-setup';
import EmailVerificationStep from '@/feature/onboarding/components/wizard-steps/email-verification';
import { authClient } from '@/utils/auth-client';

const PENDING_CAMPUS_KEY = 'nemify:pending-campus';

const steps = [
  {
    id: 'account-setup',
    title: 'Account Setup',
    description: 'Enter your credentials',
  },
  {
    id: 'campus-setup',
    title: 'Create Campus',
    description: 'Provide your email address and phone number',
  },
  {
    id: 'email-verification',
    title: 'Email Verification',
    description: 'Check your email and verify your account',
  },
];

// Validation schemas
export type WizardFormData = {
  account?: AdminAccountSetupFormValues;
  campus?: CreateCampusFormValues;
};

const SetupWizardForm = () => {
  const [current, setCurrent] = React.useState(steps[0].id);
  const [formData, setFormData] = React.useState<WizardFormData>({});
  const [submitted, setSubmitted] = React.useState(false);
  const [validSteps, setValidSteps] = React.useState<Record<string, boolean>>(
    {}
  );

  const currentIndex = steps.findIndex((s) => s.id === current);
  const goNext = () =>
    setCurrent(steps[Math.min(currentIndex + 1, steps.length - 1)].id);
  const goBack = () => setCurrent(steps[Math.max(currentIndex - 1, 0)].id);

  const _resetAll = () => {
    setFormData({});
    setCurrent(steps[0].id);
    setSubmitted(false);
    setValidSteps({});
  };

  React.useEffect(() => {
    const checkPendingCampus = async () => {
      const pending = sessionStorage.getItem(PENDING_CAMPUS_KEY);
      if (!pending) return;

      try {
        const { data } = await authClient.getSession();
        if (data?.session) {
          const campus = JSON.parse(pending) as CreateCampusFormValues;
          setFormData((prev) => ({ ...prev, campus }));
          setCurrent('email-verification');
          setSubmitted(true);
        }
      } catch {
        sessionStorage.removeItem(PENDING_CAMPUS_KEY);
      }
    };

    checkPendingCampus();
  }, []);

  const isCurrentValid = !!validSteps[current];

  return (
    <div className="bg-muted/40 flex min-h-screen items-center justify-center p-4">
      <Stepper
        steps={steps}
        value={current}
        onValueChange={(v) => {
          if (submitted) return;
          if (!isCurrentValid && v !== current) return;
          setCurrent(v);
        }}
        className="flex w-xs flex-col items-center justify-center gap-6 sm:w-xl"
        orientation="horizontal">
        <StepperNav>
          {steps.map((step, index) => (
            <StepperItem
              key={index}
              stepId={step.id}
              className="relative flex-1">
              <StepperTrigger
                className={cn(
                  'flex flex-col gap-2.5',
                  submitted || !isCurrentValid ? 'pointer-events-none' : ''
                )}
                aria-disabled={submitted || !isCurrentValid}>
                <StepperIndicator
                  className={
                    submitted
                      ? 'group-data-[state=active]/step:ring-green-600/40 data-[state=active]:bg-green-600/20 data-[state=active]:text-green-600 data-[state=completed]:bg-green-600/20 data-[state=completed]:text-green-600 dark:group-data-[state=active]/step:ring-green-400/40 dark:data-[state=completed]:bg-green-400/20 dark:data-[state=completed]:text-green-400'
                      : ''
                  }>
                  {index + 1}
                </StepperIndicator>
                <StepperTitle
                  className={`${submitted ? 'text-muted-foreground' : ''}`}>
                  {step.title}
                </StepperTitle>
              </StepperTrigger>
              {steps.length > index + 1 && (
                <StepperSeparator
                  className={cn(
                    'absolute inset-x-0 top-2 right-[calc(-50%+18px)] left-[calc(50%+18px)]',
                    submitted
                      ? 'group-data-[state=completed]/step:bg-green-600/20 dark:group-data-[state=completed]/step:bg-green-400/20'
                      : ''
                  )}
                />
              )}
            </StepperItem>
          ))}
        </StepperNav>
        <StepperPanel className="rounded-2xl border bg-white p-8 text-center text-sm">
          {steps.map((step) => (
            <StepperContent key={step.id} value={step.id}>
              <div className="flex flex-col items-center gap-4">
                <div className="w-full">
                  <div>
                    {step.id === 'account-setup' && (
                      <AdminAccountStep
                        defaultValues={formData.account}
                        onNext={(data) => {
                          setFormData((prev) => ({ ...prev, account: data }));
                          setValidSteps((prev) => ({ ...prev, details: true }));
                          goNext();
                        }}
                      />
                    )}

                    {step.id === 'campus-setup' && (
                      <CreateCampusStep
                        onPrev={() => goBack()}
                        showPrev={!submitted}
                        defaultValues={formData.campus}
                        onNext={(data) => {
                          setFormData((prev) => ({
                            ...prev,
                            campus: data,
                          }));
                          setValidSteps((prev) => ({ ...prev, details: true }));
                          goNext();
                          setSubmitted(true);
                        }}
                      />
                    )}

                    {step.id === 'email-verification' && (
                      <EmailVerificationStep formValues={formData} />
                    )}
                  </div>
                </div>
              </div>
            </StepperContent>
          ))}
        </StepperPanel>
      </Stepper>
    </div>
  );
};

export default SetupWizardForm;
