// import { UserCreationForm } from '@/feature/auth/components/form/system-setup';
import { Suspense } from 'react';
import SetupWizardForm from './setup-wizard';

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SetupWizardForm />
      {/* <UserCreationForm /> */}
    </Suspense>
  );
}
