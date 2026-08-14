import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const isSecureCookies = process.env.AUTH_URL?.startsWith("https://") === true;

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    const secret = process.env.AUTH_SECRET;

    if (!secret) {
      const url = new URL("/login", request.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }

    const token = await getToken({
      req: request,
      secret,
      secureCookie: isSecureCookies,
    });

    if (!token) {
      const url = new URL("/login", request.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }

    if (token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
