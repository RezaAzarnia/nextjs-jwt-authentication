import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token");
  const refreshToken = request.cookies.get("refresh_token")?.value;
  const secret_key: Uint8Array = new TextEncoder().encode(
    process.env.SECRET_KEY || "secrete-key"
  );
  const protectPath = ["/", "/dashboard"];
  const authPaths = ["/login", "/register"];
  const url = new URL(request.url);

  if (token) {
    try {
      await jwtVerify(token.value, secret_key);
      return NextResponse.next();
    } catch (error) {
      const cookieToken = await fetch("http://localhost:3000/api/auth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(refreshToken),
      });

      const newToken = await cookieToken.json();
      const response = NextResponse.next();
      response.cookies.set("token", newToken.token);
      return response;
    }
  }
  if (token && authPaths.includes(url.pathname)) {
    url.pathname = "/";
    return NextResponse.redirect(url.toString());
  } else if (!token && protectPath.includes(url.pathname)) {
    url.pathname = "/login";
    return NextResponse.redirect(url.toString());
  }
}

export const config = {
  matcher: "/:path*",
};
