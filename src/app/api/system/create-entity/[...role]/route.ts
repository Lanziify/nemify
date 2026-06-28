import { PLATFORM_ROLES } from '@/lib/auth/roles';
import { signUpEmailSchema } from '@/feature/auth/schema/auth.schema';
// import { createSystemAccount } from '@/feature/auth/services/auth.service';
import { apiErrorHandler, requiredInternalKey } from '@/lib/api-handler';
import { BadRequestError } from '@/lib/errors/app-error';
import { NextRequest, NextResponse } from 'next/server';

export const POST = apiErrorHandler(
  async (req: NextRequest, { params }) => {
    const body = await req.json();
    const { role: paramRole } = await params;

    const roleKey = String(paramRole) as keyof typeof PLATFORM_ROLES;

    if (!Object.hasOwn(PLATFORM_ROLES, roleKey)) {
      throw new BadRequestError('Cannot create user with unknown system role.');
    }

    const values = signUpEmailSchema.parse(body);

    // const user = await createSystemAccount({
    //   values,
    //   platformRole: PLATFORM_ROLES[roleKey],
    // });

    return NextResponse.json({}, { status: 200 });
  },
  { guards: [requiredInternalKey] }
);
