import { Suspense } from 'react';
import { CampusInvitationAcceptance } from '@/feature/campus/components';

export default function CampusInvitationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CampusInvitationAcceptance />
    </Suspense>
  );
}
