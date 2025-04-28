// File: app/apiv1/auth/set-token/route.js
// (or app/api/auth/set-token/route.js depending on your structure)
// Make sure you have installed the 'cookie' library: npm install cookie

import { NextResponse } from 'next/server';
import { serialize } from 'cookie'; // Import the serialization function

// --- Configuration ---
// Name of the cookie where the token will be stored
const TOKEN_NAME = 'auth_token';
// Max age of the cookie (e.g., 1 day in seconds)
const MAX_AGE = 60 * 60 * 24; // 24 hours
// Set secure flag based on environment (HTTPS required in production)
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
// --- End Configuration ---

export async function POST(request) {
  try {
    // 1. Parse the request body to get the token
    const body = await request.json();
    const { token } = body;

    // 2. Validate if the token was provided
    if (!token) {
      console.error("[API /set-token] Error: Token not found in request body.");
      return NextResponse.json(
        { success: false, message: 'Token is required in the request body' },
        { status: 400 } // Bad Request
      );
    }

    // 3. Serialize the cookie with security flags
    const serializedCookie = serialize(TOKEN_NAME, token, {
      httpOnly: true,       // Prevents client-side JavaScript access (XSS protection)
      secure: IS_PRODUCTION, // Send only over HTTPS in production
      maxAge: MAX_AGE,      // Cookie expiry time in seconds from now
      path: '/',            // Cookie available across the entire site
      sameSite: 'lax',      // Protects against CSRF attacks ('strict' or 'lax')
    });

    // 4. Create the success response
    console.log(`[API /set-token] Setting cookie '${TOKEN_NAME}'`);
    const response = NextResponse.json({
        success: true,
        message: 'Authentication token set successfully.'
    });

    // 5. Set the 'Set-Cookie' header on the response
    response.headers.set('Set-Cookie', serializedCookie);

    return response;

  } catch (error) {
    // Handle potential errors during JSON parsing or other issues
    console.error('[API /set-token] Internal Server Error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error while setting token.' },
      { status: 500 } // Internal Server Error
    );
  }
}

// Optional: Handle other methods if needed (e.g., GET is not allowed)
export async function GET(request) {
    return NextResponse.json(
        { success: false, message: 'Method Not Allowed' },
        { status: 405 }
    );
}