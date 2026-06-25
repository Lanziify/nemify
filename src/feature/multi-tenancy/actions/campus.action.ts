'use server';

import { actionErrorParser } from '@/lib/errors/action-error-parser';
import { safeCatch } from '@/lib/errors/safe-catch';
import { auth } from '@/utils/auth';
import { headers } from 'next/headers';
import { createOrganizationSchema } from '../schema/campus.schema';
import { CampusService } from '../services/campus.service';
import { CampusRepository } from '../repositories/campus.repository';

const campusRepository = new CampusRepository();
const campusService = new CampusService(campusRepository);

export const createCampus = async (values: unknown) => {
  return await safeCatch(
    async () => {
      const validated = createOrganizationSchema.parse(values);
      return await campusService.createCampus(validated);
    },
    { parser: actionErrorParser }
  );
};
