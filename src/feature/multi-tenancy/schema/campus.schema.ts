import z from 'zod';
import {
  CreateCampusRoleBody,
  CreateCampusBody,
  UpdateCampusRoleBody,
} from '../services/campus.service';

export const createCampusSchema = z.object({
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
}) satisfies z.ZodType<CreateCampusBody>;

export type CreateCampusSchema = typeof createCampusSchema;
export type CreateCampusFormValues = z.infer<CreateCampusSchema>;

export const baseCampusRoleSchema = z.object({
  role: z.string(),
  permission: z.record(z.string(), z.array(z.string())),
});

export type BaseCampusRoleSchema = typeof baseCampusRoleSchema;
export type BaseCampusRoleFormValues = z.infer<BaseCampusRoleSchema>;

export const createCampusRoleSchema = z.object({
  organizationId: z.string(),
  role: z.string(),
  permission: z.record(z.string(), z.array(z.string())),
  additionalFields: z.object().optional(),
}) satisfies z.ZodType<CreateCampusRoleBody>;

export type CreateCampusRoleSchema = typeof createCampusRoleSchema;
export type CreateCampusRoleFormValues = z.infer<CreateCampusRoleSchema>;

export const updateCampusRoleSchema = z.object({
  organizationId: z.string(),
  data: z.object({
    permission: z.record(z.string(), z.array(z.string())).optional(),
    roleName: z.string().optional(),
  }),
  roleName: z.string(),
  roleId: z.string(),
}) satisfies z.ZodType<UpdateCampusRoleBody>;

export type UpdateCampusRoleSchema = typeof updateCampusRoleSchema;
export type UpdateCampusRoleFormValues = z.infer<CreateCampusRoleSchema>;
