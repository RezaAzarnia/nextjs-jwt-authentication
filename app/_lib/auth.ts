import NextAuth, { Session } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { NextRequest, NextResponse } from "next/server";
import { isTokenExpired } from "./utils";
declare module "next-auth" {
  interface Session {
    email: string;
    username: string;
    refreshToken: string;
    expires: number; // Assuming this property represents token expiration time
    accessToken: string;
    createdAt: number; // Assuming this property represents token creation time
    // Add other missing properties from RegisteredUser if needed
  }
  interface JWT {
    email: string;
    username: string;
    refreshToken: string;
    expires: number; // Assuming this property represents token expiration time
    accessToken: string;
    createdAt: number; // Assuming this property represents token creation time
    // Add other missing pr
  }
  interface User {
    accessToken: string;
    refreshToken: string;
    username: string;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      authorize: async (credentials) => {
        try {
          const res = await fetch("http://localhost:3000/api/user/login", {
            method: "post",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
          });
          if (!res.ok) {
            throw new Error("invalid crediationls");
          }
          const user = await res.json();
          return user;
        } catch (error) {
          if (error instanceof Error) {
            throw new Error("some thing went wrong");
          }
        }
      },
    }),
  ],
  callbacks: {
    jwt: async ({ user, token }) => {
      if (user) {
        return {
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          username: user.username,
          email: user.email,
        };
      }
      if (isTokenExpired(token.accessToken as string)) {
        try {
          const res = await fetch("http://localhost:3000/api/user/token", {
            method: "post",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(token?.refreshToken),
          });
          const response = await res.json();
          return {
            ...token,
            accessToken: response.newToken,
          };
        } catch (error) {
          console.log(error);
        }
      }
      return token;
    },

    session: async ({ session, token }) => {
      session.accessToken = token.accessToken as string;
      session.refreshToken = token.refreshToken as string;
      session.username = token.username as string;
      session.email = token.email as string;

      return session;
    },

    authorized: ({
      request,
      auth,
    }: {
      request: NextRequest;
      auth: Session | null;
    }) => {
      const protectPath = ["/", "/dashboard"];
      const authPaths = ["/login", "/register"];

      const url = new URL(request.url);
      if (auth && authPaths.includes(url.pathname)) {
        const newUrl = new URL("/", request.nextUrl.origin);
        return Response.redirect(newUrl);
      } else if (!auth && protectPath.includes(url.pathname)) {
        const newUrl = new URL("/login", request.nextUrl.origin);
        return Response.redirect(newUrl);
      }
      return NextResponse.next();
    },
  },

  pages: {
    signIn: "/login",
  },
});

