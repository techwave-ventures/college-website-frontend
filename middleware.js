// middleware.js
// Place this file in the root of your project or inside the `src` directory

import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose'; // Library for JWT verification

// --- Configuration ---
const protectedPaths = [
    '/user-dashboard',
    '/admin-dashboard',
    '/profile',
    '/pref-list-generator'
];
const publicPaths = [
    '/auth/login',
    '/auth/signup',
    '/about',
    '/ExploreColleges',
    '/blogs',
    '/coming-soon',
    '/'
];
const secret = process.env.JWT_SECRET;
const cookieName = 'authToken';
// --- End Configuration ---

// Helper function to get the encoded secret key for jose
async function getSecretKey() {
  // Log whether the secret is found BEFORE throwing an error
  console.log(`[Middleware] JWT_SECRET environment variable ${secret ? 'found.' : 'NOT FOUND!'}`);
  if (!secret) {
    throw new Error('JWT Secret key (JWT_SECRET) is not set in environment variables.');
  }
  return new TextEncoder().encode(secret);
}

// --- Middleware Logic ---
/**
 * Middleware function to handle authentication and authorization.
 * @param {import('next/server').NextRequest} request - The incoming request object.
 */
export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const requestHeaders = request.headers; // Get request headers for logging
  const allCookies = request.cookies.getAll(); // Get all cookies for logging

  console.log(`\n--- [Middleware] Start Processing Request ---`);
  console.log(`[Middleware] Pathname: ${pathname}`);
  console.log(`[Middleware] Method: ${request.method}`);
  // Log relevant headers (optional, can be verbose)
  // console.log('[Middleware] Headers:', JSON.stringify(Object.fromEntries(requestHeaders.entries()), null, 2));
  console.log('[Middleware] All Cookies Received:', allCookies);

  // --- Step 1: Bypass Middleware for Static Assets, API Routes, and Public Paths ---
  if (pathname.startsWith('/_next')) {
    console.log(`[Middleware] Bypassing asset path: ${pathname}`);
    return NextResponse.next();
  }
  if (pathname.startsWith('/apiv1/')) {
    // Assuming your backend API routes start with /apiv1/ - adjust if needed
    console.log(`[Middleware] Bypassing backend API path: ${pathname}`);
    return NextResponse.next();
  }
  if (pathname.includes('.')) {
    // Basic check for file extensions (e.g., .css, .js, .png)
    console.log(`[Middleware] Bypassing potential file path: ${pathname}`);
    return NextResponse.next();
  }
  // Check against explicitly defined public paths
  const isPublic = publicPaths.some((path) => pathname === path || (path !== '/' && pathname.startsWith(path + '/')));
  if (isPublic) {
    console.log(`[Middleware] Path is explicitly PUBLIC: ${pathname}. Allowing access.`);
    // Special handling for login/signup pages for logged-in users is below
  }

  // --- Step 2: Check Protected Routes ---
  const isProtectedPath = protectedPaths.some((path) => pathname.startsWith(path));

  if (isProtectedPath) {
    console.log(`[Middleware] Path identified as PROTECTED: ${pathname}`);

    // --- Step 2a: Check if the authentication cookie exists ---
    const token = request.cookies.get(cookieName)?.value;
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirectedFrom', pathname); // Prepare login URL early

    console.log(`[Middleware] Checking for cookie named '${cookieName}'. Found: ${token ? `Yes (Length: ${token.length})` : 'No'}`);

    if (!token) {
      console.warn(`[Middleware] No '${cookieName}' token found for protected path ${pathname}.`);
      console.log(`[Middleware] Redirecting to login URL: ${loginUrl.toString()}`);
      return NextResponse.redirect(loginUrl);
    }

    // --- Step 2b: Verify the token if it exists ---
    console.log(`[Middleware] Token found. Attempting verification for path: ${pathname}`);
    try {
      const key = await getSecretKey(); // Checks for secret existence again
      const { payload } = await jwtVerify(token, key); // Verify token
      console.log(`[Middleware] Token VERIFIED successfully for path ${pathname}.`);
      // Be careful logging payload in production due to sensitive data
      console.log(`[Middleware] Token Payload:`, JSON.stringify(payload));

      // --- Step 2c: Optional Role-Based Access Control ---
      if (pathname.startsWith('/admin-dashboard')) {
          console.log(`[Middleware] Performing role check for Admin path: ${pathname}`);
          if (payload.accountType !== 'Admin') {
              console.warn(`[Middleware] Access DENIED to ${pathname}. User role ('${payload.accountType}') is not 'Admin'.`);
              const redirectUrl = new URL('/', request.url); // Redirect non-admins to home
              console.log(`[Middleware] Redirecting user to: ${redirectUrl.toString()}`);
              return NextResponse.redirect(redirectUrl);
          }
          console.log(`[Middleware] Role check passed ('Admin').`);
      }

      // Token is valid, role check passed (or not applicable), allow access
      console.log(`[Middleware] Authentication successful. Allowing access to protected path: ${pathname}`);
      return NextResponse.next();

    } catch (error) { // Token verification failed
      console.error(`[Middleware] Token verification FAILED for path ${pathname}. Error:`, error.message);
      console.warn(`[Middleware] Deleting invalid/expired '${cookieName}' cookie.`);
      loginUrl.searchParams.set('error', 'session_expired'); // Add error flag
      const response = NextResponse.redirect(loginUrl);
      // Clear the invalid cookie
      response.cookies.set(cookieName, '', { path: '/', expires: new Date(0) });
      console.log(`[Middleware] Redirecting to login URL (due to verification error): ${loginUrl.toString()}`);
      return response;
    }
  }

  // --- Step 3: Prevent Logged-in Users from Accessing Login/Signup ---
  // This check runs if the path is public *or* not explicitly protected/public (if any such paths exist)
  if (pathname.startsWith('/auth/login') || pathname.startsWith('/auth/signup')) {
    console.log(`[Middleware] Checking access to auth page: ${pathname}`);
    const token = request.cookies.get(cookieName)?.value;

    if (token) {
      console.log(`[Middleware] Token found while trying to access ${pathname}. Verifying token validity...`);
      try {
        const key = await getSecretKey();
        await jwtVerify(token, key); // Just verify, don't need payload here
        // Token is valid - user is already logged in
        console.log(`[Middleware] User already has a valid session. Redirecting from ${pathname}.`);
        const homeUrl = new URL('/', request.url);
        console.log(`[Middleware] Redirecting logged-in user to: ${homeUrl.toString()}`);
        return NextResponse.redirect(homeUrl); // Redirect to home
      } catch (error) {
        // Token exists but is invalid/expired
        console.warn(`[Middleware] Invalid/expired token found while accessing ${pathname}. Error: ${error.message}`);
        console.log(`[Middleware] Clearing invalid cookie and allowing access to ${pathname} for re-authentication.`);
        const response = NextResponse.next(); // Allow access to login/signup
        response.cookies.set(cookieName, '', { path: '/', expires: new Date(0) }); // Clear invalid cookie
        return response;
      }
    } else {
       console.log(`[Middleware] No token found. Allowing access to auth page: ${pathname}`);
       // Allow access if no token exists
    }
  }

  // --- Step 4: Allow Access to Other Unmatched Paths ---
  // This handles paths that are not explicitly public, protected, or auth pages.
  // Might include paths like /contact, /terms, etc., if not listed in publicPaths.
  // Only runs if the path didn't match any previous conditions.
  console.log(`[Middleware] Path ${pathname} is not protected and not an auth page being accessed by a logged-in user. Allowing access.`);
  return NextResponse.next();
}

// --- Optional: Middleware Matcher Configuration ---
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes) - Adjusted to /apiv1/ based on your bypass logic
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (your static image folder) - Added this assuming you have one
     * - Any path containing a '.' (likely a file extension)
     */
    // '/((?!apiv1|_next/static|_next/image|favicon.ico|images|.*\\..*).*)', // Previous version
       '/((?!apiv1/|_next/static|_next/image|favicon.ico|images/|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|css|js)$).*)' // More specific file extension exclusion
  ],
};