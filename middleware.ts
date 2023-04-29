// Import NextRequest and NextResponse from the 'next/server' package
import { NextRequest, NextResponse } from 'next/server';

// Import the 'jose' library for handling JWT tokens
import * as jose from "jose";

// Define an asynchronous middleware function that takes a NextRequest and NextResponse as arguments
export async function middleware(req: NextRequest, res: NextResponse) {
  // Retrieve the JWT token from the 'authorization' header of the request
  const token = req.headers.get("authorization") as string;

  // If the token is not present in the header, return an error with status 401 (Unauthorized)
  if (!token) {
    return new NextResponse(
      JSON.stringify({ errorMessage: "Unauthorized request (need to send token to this endpoint)", status: 401 })
    );
  }

  // Encode the JWT_SECRET from the environment variables as a Uint8Array
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);

  // Try to verify the JWT token using the 'jose' library and the secret
  try {
    await jose.jwtVerify(token, secret);
  } catch (err) {
    // If the token verification fails, return an error with status 401 (Unauthorized)
    return new NextResponse(
      JSON.stringify({ errorMessage: "Invalid token (expired or invalid)", status: 401 })
    );
  }
}

// Define a configuration object for the middleware
export const config = {
  // Specify that the middleware should be applied to the '/api/auth/me' endpoint
  matcher: ["/api/auth/me"],
};