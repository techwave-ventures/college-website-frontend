// middleware.js
// Place this file in the root of your project or inside the `src` directory

import { NextResponse } from 'next/server';
// No 'import type' needed in JavaScript
import { jwtVerify } from 'jose'; // Library for JWT verification

// --- Configuration ---

// 1. Specify protected paths (require authentication)
const protectedPaths = [
    '/user-dashboard',
    '/admin-dashboard',
    '/profile', // Example: User profile page
    '/pref-list-generator' // Added from your previous middleware
];

// 2. Specify public paths (accessible without authentication)
const publicPaths = [
    '/auth/login',
    '/auth/signup',
    '/about',
    '/ExploreColleges',
    '/blogs', // Assuming blogs are public, adjust if needed
    '/coming-soon',
    '/' // Assuming the home page is public
];

// 3. Get JWT Secret from environment variables
const secret = process.env.JWT_SECRET;

// 4. Define the name of the authentication cookie
const cookieName = 'authToken';

// --- End Configuration ---

// Helper function to get the encoded secret key for jose
async function getSecretKey() {
  if (!secret) {
    throw new Error('JWT Secret key (JWT_SECRET or API_SECRET) is not set in environment variables.');
  }
  return new TextEncoder().encode(secret);
}

// --- Middleware Logic ---
/**
 * Middleware function to handle authentication and authorization.
 * @param {import('next/server').NextRequest} request - The incoming request object.
 */
export async function middleware(request) {
  const { pathname } = request.nextUrl; // Get the path from the incoming request

  // --- Step 1: Bypass Middleware for Static Assets and API Routes ---
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/apiv1/') ||
    pathname.includes('.') ||
    publicPaths.some((path) => pathname === path || (path !== '/' && pathname.startsWith(path + '/')))
  ) {
    // console.log(`[Middleware] Allowing public/internal path: ${pathname}`);
    return NextResponse.next();
  }

  // --- Step 2: Check Protected Routes ---
  const isProtectedPath = protectedPaths.some((path) => pathname.startsWith(path));

  if (isProtectedPath) {
    // console.log(`[Middleware] Checking protected path: ${pathname}`);

    // --- Step 2a: Check if the authentication cookie exists ---
    const token = request.cookies.get(cookieName)?.value;
    const loginUrl = new URL('/auth/login', request.url);

    if (!token) {
      console.log(`[Middleware] No token found for protected path ${pathname}. Redirecting to login.`);
      loginUrl.searchParams.set('redirectedFrom', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // --- Step 2b: Verify the token if it exists ---
    try {
      const key = await getSecretKey();
      const { payload } = await jwtVerify(token, key); // Verify token
      // console.log(`[Middleware] Token verified for path ${pathname}. Payload:`, payload);

      // --- Step 2c: Optional Role-Based Access Control ---
      if (pathname.startsWith('/admin-dashboard') && payload.accountType !== 'Admin') {
          console.log(`[Middleware] Access denied to ${pathname}. User role (${payload.accountType}) is not Admin.`);
          const redirectUrl = new URL('/', request.url); // Redirect to home page
          return NextResponse.redirect(redirectUrl);
      }

      // Token is valid, allow access
      return NextResponse.next();

    } catch (error) { // Removed : any type annotation
      // Token verification failed
      console.error(`[Middleware] Token verification failed for path ${pathname}. Error:`, error.message);
      loginUrl.searchParams.set('error', 'session_expired');
      const response = NextResponse.redirect(loginUrl);
      response.cookies.set(cookieName, '', { path: '/', expires: new Date(0) });
      return response;
    }
  }

   // --- Step 3: Prevent Logged-in Users from Accessing Login/Signup ---
   if (pathname.startsWith('/auth/login') || pathname.startsWith('/auth/signup')) {
       const token = request.cookies.get(cookieName)?.value;
       if (token) {
           try {
               const key = await getSecretKey();
               await jwtVerify(token, key); // Verify token
               console.log(`[Middleware] User already logged in. Redirecting from ${pathname}.`);
               return NextResponse.redirect(new URL('/', request.url)); // Redirect to home
           } catch (error) {
               // Token exists but is invalid, allow access to login/signup
               const response = NextResponse.next();
               response.cookies.set(cookieName, '', { path: '/', expires: new Date(0) }); // Clear invalid cookie
               return response;
           }
       }
   }

  // --- Step 4: Allow Access to Other Paths ---
  // console.log(`[Middleware] Allowing non-protected/non-public path: ${pathname}`);
  return NextResponse.next();
}

// --- Optional: Middleware Matcher Configuration ---
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|images|.*\\..*).*)',
  ],
};