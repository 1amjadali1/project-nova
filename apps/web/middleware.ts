import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Public routes that don't need protection
  if (pathname.startsWith("/login") || pathname.startsWith("/forgot-password") || pathname.startsWith("/reset-password")) {
    return NextResponse.next();
  }

  // Check for Better Auth session token
  // Note: Better Auth uses `better-auth.session_token` by default
  const sessionCookie = request.cookies.get("better-auth.session_token")?.value;
  
  // Define protected routes
  const isProtectedRoute = 
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/users") ||
    pathname.startsWith("/candidates") ||
    pathname.startsWith("/verifications") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/organizations");
  
  if (isProtectedRoute && !sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
