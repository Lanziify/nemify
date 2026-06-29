import z from 'zod';
import { GetUsersListQuery } from '../service/user.service';

export const getUsersListQuerySchema = z.object({
  searchValue: z.string().optional(),
  searchField: z.enum(['email', 'name']).optional(),
  searchOperator: z.enum(['contains', 'starts_with', 'ends_with']).optional(),
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
}) satisfies z.ZodType<GetUsersListQuery>;

export type GetUsersListQuerySchema = typeof getUsersListQuerySchema;
export type GetUsersListQueryFormValues = z.infer<GetUsersListQuerySchema>;
