import { NextRequest, NextResponse } from "next/server";
export { default } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  // get token
  const token = await getToken({ req: request });

  // get url
  const url = request.nextUrl;

  // if token is present
  if (
    token &&
    (url.pathname.startsWith("/sign-up") ||
      url.pathname.startsWith("/sign-in") ||
      url.pathname.startsWith("/verify"))
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // if token is not present
  if (!token && url.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // move to next
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/sign-up", "/verify/:path*", "/sign-in", "/dashboard/:path*"],
};
