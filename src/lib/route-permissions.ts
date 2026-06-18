export interface RoutePermission {
  path: string;
  description?: string;
}

export const routePermissions: RoutePermission[] = [];

// export function isProtectedRoute(path: string): boolean {}

// export function isPublicRoute(path: string): boolean {}
