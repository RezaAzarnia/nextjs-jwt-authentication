import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const protectPath = ["/", "/dashboard"];
  const authPaths = ["/login", "/register"];
  const url = new URL(request.url);

  if (token) {
    if (authPaths.includes(url.pathname)) {
      url.pathname = "/";
      return NextResponse.redirect(url.toString());
    }
    return NextResponse.next();
  } else if (!token && protectPath.includes(url.pathname)) {
    url.pathname = "/login";
    return NextResponse.redirect(url.toString());
  }
}

export const config = {
  matcher: "/:path*",
};
