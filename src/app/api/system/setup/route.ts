import {
  AuthRepository,
  updatePlatformInitState,
} from '@/feature/auth/repositories/auth.repository';
import { signUpEmailSchema } from '@/feature/auth/schema/auth.schema';
import { AuthService } from '@/feature/auth/services/auth.service';
import {
  apiErrorHandler,
  requiredUninitializedPlatform,
} from '@/lib/api-handler';
import { setPlatformInitialized } from '@/utils/platform';
import { NextRequest, NextResponse } from 'next/server';

const authRepository = new AuthRepository();
const authService = new AuthService(authRepository);

export const POST = apiErrorHandler(
  async (req: NextRequest) => {
    const body = await req.json();

    const parsedValues = signUpEmailSchema.parse(body);

    const response = await authService.createFirstAdmin(parsedValues);

    await updatePlatformInitState(response.user.id);

    setPlatformInitialized(true);

    return NextResponse.json(response, { status: 200 });
  },
  { guards: [requiredUninitializedPlatform] }
);
