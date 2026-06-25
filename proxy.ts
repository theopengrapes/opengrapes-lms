import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  if (!session) {
    if (pathname === "/" || pathname === "/login" || pathname === "/signup" || pathname.startsWith("/join")) return NextResponse.next();
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const { role, status } = session.user;

  if (role === "SUPER_ADMIN") {
    if (pathname.startsWith("/platform")) return NextResponse.next();
    return NextResponse.redirect(new URL("/platform", req.url));
  }

  if (role === "ADMIN") {
    if (status !== "APPROVED") {
      if (pathname === "/blocked") return NextResponse.next();
      return NextResponse.redirect(new URL("/blocked", req.url));
    }
    if (pathname.startsWith("/admin")) return NextResponse.next();
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  if (pathname === "/" || pathname.startsWith("/student") || pathname.startsWith("/join")) return NextResponse.next();
  return NextResponse.redirect(new URL("/student", req.url));
});

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
