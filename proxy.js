import { NextResponse } from "next/server";

const AUTH_PAGES = ["/login", "/register"];
const PROTECTED_PREFIXES = ["/dashboard"];

const matchesAny = (pathname, list) =>
  list.some((p) => pathname === p || pathname.startsWith(`${p}/`));

export function proxy(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("accessToken")?.value;

  const isAuthPage = matchesAny(pathname, AUTH_PAGES);
  const isProtected = matchesAny(pathname, PROTECTED_PREFIXES);

  // Protected route + no token → login
  if (isProtected && !token) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Already logged in + auth page → dashboard
  if (isAuthPage && token) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
