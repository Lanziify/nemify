import z from 'zod';
import {
  CreateCampusRoleBody,
  CreateCampusBody,
  UpdateCampusRoleBody,
  GetCampusMembersQuery,
} from '../services/campus.service';

export const createCampusSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Campus name is required')
    .max(100, 'Campus name must be less than 100 characters'),
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
export type UpdateCampusRoleFormValues = z.infer<UpdateCampusRoleSchema>;

export const getCampusMembersQuerySchema = z.object({
  organizationId: z.string().optional(),
  limit: z.union([z.string().regex(/^\d+$/), z.number()]).optional(),
  offset: z.union([z.string().regex(/^\d+$/), z.number()]).optional(),
  sortBy: z.string().optional(),
  sortDirection: z.enum(['asc', 'desc']).optional(),
  filterField: z.string().optional(),
  filterValue: z
    .union([
      z.string(),
      z.number(),
      z.boolean(),
      z.array(z.string()),
      z.array(z.number()),
    ])
    .optional(),
  filterOperator: z
    .enum([
      'in',
      'contains',
      'starts_with',
      'ends_with',
      'eq',
      'ne',
      'gt',
      'gte',
      'lt',
      'lte',
      'not_in',
    ])
    .optional(),
}) satisfies z.ZodType<GetCampusMembersQuery>;

export type GetCampusMembersQuerySchema = typeof getCampusMembersQuerySchema;
export type GetCampusMembersQueryFormValues =
  z.infer<GetCampusMembersQuerySchema>;

export const createDepartmentSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Department name is required')
    .max(100, 'Department name must be less than 100 characters'),
});

export type CreateDepartmentSchema = typeof createDepartmentSchema;
export type CreateDepartmentFormValues = z.infer<CreateDepartmentSchema>;
