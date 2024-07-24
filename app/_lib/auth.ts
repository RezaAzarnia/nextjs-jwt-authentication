import NextAuth, { JWT, Session } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { NextRequest, NextResponse } from "next/server";
import { RegisterdUser } from "./types";
import { isTokenExpired } from "./utils";

declare module "next-auth" {
  interface Session extends RegisterdUser {
    refreshToken: string;
  }
  interface JWT extends Session {}

  interface User {
    accessToken: string;
    username: string;
    refreshToken: string;
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
    jwt: async ({ user, token }: { user: Session; token: JWT }) => {
      if (user) {
        return {
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          username: user.username,
          email: user.email,
        };
      }
      if (isTokenExpired(token?.accessToken)) {
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

    session: async ({ session, token }: { session: Session; token: JWT }) => {
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.username = token.username;
      session.email = token.email;

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
