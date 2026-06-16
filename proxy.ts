import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export default function proxy(req: NextRequest) {
  //auth check for session and protection for dashboard,sign-up and login pages
  const session = getSessionCookie(req);

  const isDashboard = req.nextUrl.pathname.startsWith("/dashboard");
  const isAuthPage =
    req.nextUrl.pathname.startsWith("/login") ||
    req.nextUrl.pathname.startsWith("/sign-up");

  // if (isDashboard && !session) {
  //   return NextResponse.redirect(new URL("/login", req.url));
  // }

  // if (isAuthPage && session) {
  //   return NextResponse.redirect(new URL("/dashboard", req.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/sign-up"],
};
