import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const isAdmin = (req.auth?.user as any)?.role === "ADMIN";
  const isAdminRoute = nextUrl.pathname.startsWith("/admin");
  const isAuthRoute = nextUrl.pathname.startsWith("/login") || nextUrl.pathname.startsWith("/register");
  const isAccountRoute = nextUrl.pathname.startsWith("/account");
  const isCheckoutRoute = nextUrl.pathname.startsWith("/checkout");
  if (isAdminRoute) {
    if (!isLoggedIn) return NextResponse.redirect(new URL("/login?callbackUrl=/admin", nextUrl));
    if (!isAdmin) return NextResponse.redirect(new URL("/", nextUrl));
  }
  if ((isAccountRoute || isCheckoutRoute) && !isLoggedIn) {
    return NextResponse.redirect(new URL(`/login?callbackUrl=${nextUrl.pathname}`, nextUrl));
  }
  if (isAuthRoute && isLoggedIn) return NextResponse.redirect(new URL("/", nextUrl));
  return NextResponse.next();
});
export const config = { matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"] };