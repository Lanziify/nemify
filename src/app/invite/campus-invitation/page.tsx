import { Suspense } from 'react';
import { CampusInvitationAcceptance } from '@/feature/multi-tenancy/components';

export default function CampusInvitationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CampusInvitationAcceptance />
    </Suspense>
  );
}
