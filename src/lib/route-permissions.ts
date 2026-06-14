export interface RoutePermission {
  path: string;
  description?: string;
}

export const routePermissions: RoutePermission[] = [
  {
    path: '/dashboard',
    description: 'User dashboard - accessible to all authenticated users',
  },
  {
    path: '/settings',
    description: 'User settings - accessible to all authenticated users',
  },
  {
    path: '/admin',
    description: 'Admin panel - only for admins',
  },
];


// export function isProtectedRoute(path: string): boolean {
//   return routePermissions.some(
//     (p) => path.startsWith(p.path) && p.requiredRole !== Role.GUEST
//   );
// }

// export function isPublicRoute(path: string): boolean {
//   return ['/login', '/'].includes(path);
// }
