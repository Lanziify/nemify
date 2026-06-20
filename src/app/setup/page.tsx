import { UserCreationForm } from '@/feature/auth/components/form/system-setup';
import { Suspense } from 'react';

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UserCreationForm />
    </Suspense>
  );
}
