import { updatePlatformInitState } from '@/feature/auth/repositories/auth.repository';
import { signUpEmailSchema } from '@/feature/auth/schema/auth.schema';
import { createSystemAdminAccount } from '@/feature/auth/services/auth.service';
import {
  apiErrorHandler,
  requiredUninitializedPlatform,
} from '@/lib/api-handler';
import { setPlatformInitialized } from '@/utils/platform';
import { NextRequest, NextResponse } from 'next/server';

export const POST = apiErrorHandler(
  async (req: NextRequest) => {
    const body = await req.json();

    const values = signUpEmailSchema.parse(body);

    const admin = await createSystemAdminAccount(values);

    await updatePlatformInitState(admin.user.id);

    setPlatformInitialized(true);

    return NextResponse.json(admin, { status: 200 });
  },
  { guards: [requiredUninitializedPlatform] }
);
