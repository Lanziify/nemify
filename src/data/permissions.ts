import { createAccessControl } from 'better-auth/plugins';

export const SYSTEM_ROLES = {
  admin: 'system_admin',
  user: 'system_user',
} as const;

export const statement = {
  campus: ['create', 'update', 'delete'],
  system: ['manage'],
} as const;

export const ac = createAccessControl(statement);

export const systemAdmin = ac.newRole({
  campus: ['create', 'update', 'delete'],
});

export const systemUser = ac.newRole({});
