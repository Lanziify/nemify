import { signUpEmailSchema } from '@/feature/auth/schema/auth.schema';
import { createSystemAdminAccount } from '@/feature/auth/services/auth.service';
import { apiErrorHandler } from '@/lib/api-handler';
import { NextRequest, NextResponse } from 'next/server';

export const POST = apiErrorHandler(async (req: NextRequest) => {
  const body = await req.json();

  const values = signUpEmailSchema.parse(body);

  const admin = await createSystemAdminAccount(values);

  return NextResponse.json(admin, { status: 200 });
});
