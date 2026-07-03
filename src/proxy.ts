import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '@/utils/auth';
import { isPlatformInitialized, refreshPlatformState } from './utils/platform';

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Define routes before fetching session
  const guestOnlyRoutes = ['/signin'];
  const protectedRoutes = ['/test'];
  const bootstrapRoutes = ['/setup', '/setup/verification-success'];

  const isGuestOnlyRoute = guestOnlyRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isBootstrapRoute = bootstrapRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (!isPlatformInitialized() && !isBootstrapRoute) {
    // In-memory state isn't shared with the route-handler bundle, so re-read
    // the authoritative value from the DB before deciding to redirect.
    const initialized = await refreshPlatformState();

    if (!initialized) {
      return NextResponse.redirect(new URL('/setup', request.url));
    }
  }

  if (isBootstrapRoute) {
    if (isPlatformInitialized()) {
      const url = new URL('/', request.url);
      return NextResponse.redirect(url);
    }
  }

  // Only fetch session if we're on a route that needs auth checking
  if (!isGuestOnlyRoute && !isProtectedRoute) {
    return NextResponse.next();
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const isAuthenticated = !!session?.user;
  const isEmailVerified = !!session?.user?.emailVerified;

  // Redirect authenticated users away from guest-only routes
  if (isGuestOnlyRoute && isAuthenticated) {
    const url = new URL('/test', request.url);
    return NextResponse.redirect(url);
  }

  // Handle protected routes
  if (isProtectedRoute) {
    if (!isAuthenticated) {
      // Redirect to signin with callback URL
      const url = new URL('/signin', request.url);
      url.searchParams.set('callbackURL', pathname);
      return NextResponse.redirect(url);
    }

    if (!isEmailVerified) {
      // Redirect to a verification reminder page or signin
      const url = new URL('/signin', request.url);
      url.searchParams.set('message', 'Please verify your email address');
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - public folder files (images, etc)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)',
  ],
};
