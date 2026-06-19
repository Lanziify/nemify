import { Suspense } from 'react';
import { SignInForm } from '@/feature/auth/components/form/signin';

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInForm />
    </Suspense>
  );
}
