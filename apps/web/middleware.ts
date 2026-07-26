import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Better Auth validation
  /* 
  // Future implementation for route protection:
  const { pathname } = request.nextUrl;
  
  if (pathname.startsWith("/login")) return NextResponse.next();

  const sessionCookie = request.cookies.get("better-auth.session_token")?.value;
  
  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  */

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|login).*)"],
};
