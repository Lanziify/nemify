import { createCampusDepartmentSchema } from '@/feature/campus/schema/campus.schema';
import { CampusRepository } from '@/feature/campus/repositories/campus.repository';
import { CampusService } from '@/feature/campus/services/campus.service';
import { apiErrorHandler, requiredSession } from '@/lib/api-handler';
import { NextRequest, NextResponse } from 'next/server';

const campusRepository = new CampusRepository();
const campusService = new CampusService(campusRepository);

export const GET = apiErrorHandler(
  async (req: NextRequest, { params }) => {
    const { id } = await params;
    const departments = await campusService.getCampusDepartments(String(id));
    return NextResponse.json(departments, { status: 200 });
  },
  { guards: [requiredSession] }
);

export const POST = apiErrorHandler(
  async (req: NextRequest, { params }) => {
    const { id } = await params;
    const body = await req.json();
    const { name } = createCampusDepartmentSchema.parse(body);
    const department = await campusService.createCampusDepartment(
      name,
      String(id)
    );
    return NextResponse.json(department, { status: 201 });
  },
  { guards: [requiredSession] }
);
