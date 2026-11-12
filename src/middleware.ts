import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = req.nextUrl;

  // 1. Admin Routes Protection (Sirf admin ke liye)
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/addcategory") ||
    pathname.startsWith("/subcategories")
  ) {
    if (!token || token.role !== "admin") {
      const signinUrl = new URL("/signin", req.url);
      return NextResponse.redirect(signinUrl);
    }
  }

  // 2. User Protected Routes Protection (Checkout yahan se nikal diya gaya hai taaki guest user bhi ja sake)
  if (
    pathname.startsWith("/my-account") ||
    pathname.startsWith("/orders") ||
    pathname.startsWith("/wishlist")
  ) {
    if (!token) {
      const signinUrl = new URL("/signin", req.url);
      return NextResponse.redirect(signinUrl);
    }
  }

  const response = NextResponse.next();

  // Cache disable headers
  response.headers.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");

  return response;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/addcategory/:path*",
    "/subcategories/:path*",
    "/my-account/:path*",
    "/orders/:path*",
    "/wishlist/:path*",
    // "/checkout/:path*", <-- Yeh yahan se hata diya gaya hai
  ],
};