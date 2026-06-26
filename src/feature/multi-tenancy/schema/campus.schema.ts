import z from 'zod';
import {
  CreateCampusRoleBody,
  CreateOrganizationBody,
} from '../services/campus.service';

export const createOrganizationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Organization name is required')
    .max(100, 'Organization name must be less than 100 characters'),
  slug: z
    .string()
    .trim()
    .min(3, 'Slug must be at least 3 characters')
    .max(50, 'Slug must be less than 50 characters'),
  userId: z.string().optional(),
  logo: z.string().nullable().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
  keepCurrentActiveOrganization: z.boolean().optional(),
}) satisfies z.ZodType<CreateOrganizationBody>;

export const createCampusRoleSchema = z.object({
  organizationId: z.string(),
  role: z.string(),
  permission: z.record(z.string(), z.array(z.string())),
  additionalFields: z.object().optional(),
}) satisfies z.ZodType<CreateCampusRoleBody>;
