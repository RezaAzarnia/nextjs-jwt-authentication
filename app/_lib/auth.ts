"use server";
import prisma from "./db";
import { RegisterdUser } from "./types";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const secret_key: Uint8Array = new TextEncoder().encode(
  process.env.SECRET_KEY || "secrete-key"
);
type Payload = {
  id: string;
  email: string;
};

export async function getSession() {
  const token = cookies().get("token");

  if (token) {
    const { payload } = (await jwtVerify(token?.value, secret_key)) as {
      payload: Payload;
    };
    const user = await prisma.user.findUnique({
      where: {
        id: payload?.id,
      },
    });
    if (!user) {
      throw new Error("user undefind");
    }
    return user as RegisterdUser;
  }
}

export const removeSession = async () => {
  cookies().delete("token");
  cookies().delete("refresh_token");
  redirect("/login");
};
