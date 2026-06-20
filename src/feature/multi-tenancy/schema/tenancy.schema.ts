import z from 'zod';
import { CreateOrganizationBody } from '../services/tenancy.service';

export const createOrganizationSchema = z.object({
  name: z.string(),
  slug: z.string(),
  userId: z.string().optional(),
  logo: z.string().nullable().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
  keepCurrentActiveOrganization: z.boolean().optional(),
}) satisfies z.ZodType<CreateOrganizationBody>;