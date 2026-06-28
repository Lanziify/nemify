import { globalRoles } from './permissions';

export const PLATFORM_ROLES = {
  admin: 'admin',
  user: 'user',
} as const satisfies Record<keyof typeof globalRoles, string>;

export type PlatformRole = (typeof PLATFORM_ROLES)[keyof typeof PLATFORM_ROLES];
