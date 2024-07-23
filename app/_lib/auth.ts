import NextAuth, { DefaultSession, JWT, Session } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { NextRequest, NextResponse } from "next/server";

declare module "next-auth" {
  interface Session {
    accessToken: string;
    username: string;
    email: string;
  }

  interface User {
    accessToken: string;
    username: string;
  }

  interface JWT {
    accessToken: string;
    username: string;
    email: string;
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
            throw new Error("eome thing went wrong");
          }
        }
      },
    }),
  ],
  callbacks: {
    jwt: async ({ user, token }) => {
      if (user) {
        token.accessToken = user.accessToken;
        token.username = user.username;
      }
      return token;
    },

    session: async ({
      session,
      token,
    }: {
      session: Session;
      token: JWT;
    }): Promise<Session | undefined> => {
      if (token) {
        session.accessToken = token.accessToken;
        session.username = token.username;
        session.email = token.email;

        return session;
      }
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
