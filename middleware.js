// File: middleware.js (or middleware.ts)
// Place this file at the root of your project or inside the `src` directory

import { NextResponse } from 'next/server';

// Name of the cookie where the token is stored (must match the API route)
const TOKEN_NAME = 'auth_token';

export function middleware(request) {
  // Get the pathname of the request (e.g., '/admin-dashboard')
  const { pathname } = request.nextUrl;

  // Get the token cookie from the request
  const tokenCookie = request.cookies.get(TOKEN_NAME);

  // Define paths that require authentication
  const protectedPaths = [
      '/admin-dashboard',
      '/user-dashboard',
      '/pref-list-generator' // <-- ADD THIS LINE
    ]; // Add any other paths that need protection

  // Check if the current path is one of the protected paths
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));

  // If accessing a protected path and the token cookie is missing
  if (isProtectedPath && !tokenCookie) {
    // Redirect to the login page
    const loginUrl = new URL('/auth/login', request.url);
    // Optional: Add a 'redirectedFrom' query parameter to redirect back after login
    loginUrl.searchParams.set('redirectedFrom', pathname);
    console.log(`[Middleware] No token found for protected route ${pathname}. Redirecting to login.`);
    return NextResponse.redirect(loginUrl);
  }

  // If accessing login or signup page and the token *is* present, redirect to a default dashboard
  // This prevents logged-in users from seeing login/signup pages again
  if ((pathname.startsWith('/auth/login') || pathname.startsWith('/auth/signup')) && tokenCookie) {
    console.log(`[Middleware] User already logged in. Redirecting from ${pathname} to dashboard.`);
    // Redirect to a default page, e.g., user-dashboard or based on role if you decode the token
    // For simplicity, redirecting to '/user-dashboard' here
    return NextResponse.redirect(new URL('/user-dashboard', request.url));
  }

  // If none of the above conditions are met, allow the request to proceed
  // console.log(`[Middleware] Allowing request to ${pathname}.`);
  return NextResponse.next();
}

// Configure the middleware to run only on specific paths (matcher)
// This improves performance by not running the middleware on every request (e.g., static assets)
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (public image files if you have an /images folder)
     * - .*\\..* (files with extensions, e.g. .png, .jpg) - This helps exclude asset files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images|.*\\..*).*)',
    // Explicitly include the paths you want to protect or manage
    '/admin-dashboard/:path*',
    '/user-dashboard/:path*',
    '/pref-list-generator/:path*', // <-- ADD THIS LINE (use :path* if it has sub-routes)
    '/auth/login',
    '/auth/signup',
  ],
};