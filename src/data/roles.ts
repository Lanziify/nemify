export const PLATFORM_ROLES = {
  admin: 'system_admin',
  user: 'system_user',
} as const;

export type PlatformRole = (typeof PLATFORM_ROLES)[keyof typeof PLATFORM_ROLES];
