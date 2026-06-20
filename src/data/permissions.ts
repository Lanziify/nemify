import { createAccessControl } from 'better-auth/plugins';

export const statement = {
  system: ['settings', 'audit'],
  campus: ['create', 'update', 'archive'],
} as const;

export const ac = createAccessControl(statement);

export const systemAdmin = ac.newRole({
  campus: ['create', 'update', 'archive'],
});

export const systemUser = ac.newRole({});
