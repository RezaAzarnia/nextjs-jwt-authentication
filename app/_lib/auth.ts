"use server";
import bcrypt from "bcrypt";
import prisma from "./db";
import { LoginUser, RegisterdUser, User } from "./types";
import { loginSchema, registerSchema } from "./userSchema";
import { ValidationError } from "./utils";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export const registerUser = async (data: User): Promise<RegisterdUser> => {
  const { email, password, username } = data;
  const isExitUser = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  const schemaValidation = registerSchema.safeParse(data);

  if (!schemaValidation.success) {
    throw new ValidationError(
      JSON.stringify({ error: schemaValidation?.error?.flatten().fieldErrors })
    ) as Error;
  }

  if (isExitUser) {
    throw new Error("This email is already in use. Please try another one.");
  }

  const hashedPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  };

  const response = await prisma.user.create({
    data: {
      email,
      username,
      password: await hashedPassword(password),
    },
  });
  if (response) {
    redirect("/login");
  }
  return response;
};

export const login = async (data: LoginUser): Promise<void> => {
  const { email, password } = data;

  const userValidation = loginSchema.safeParse(data);

  if (!userValidation.success) {
    throw new ValidationError(
      JSON.stringify({ error: userValidation?.error?.flatten().fieldErrors })
    ) as ValidationError;
  }

  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  const isMatch = user && (await bcrypt.compare(password, user?.password));

  if (!user || !isMatch) {
    throw new Error("email or password is incorrect");
  }
  if (user) {
    cookies().set("token", user.id, {
      httpOnly: true,
      expires: Date.now() + 3 * 24 * 60 * 60 * 1000,
    });
    redirect("/");
  }
};

export const getSession = async (): Promise<RegisterdUser | undefined> => {
  const session = cookies().get("token");

  if (!session) {
    return;
  }
  const user = await prisma.user.findUnique({
    where: {
      id: session.value,
    },
  });
  if (!user) {
    throw new Error("user undefind");
  }
  return user as RegisterdUser;
};

export const removeSession = (): never => {
  cookies().delete("token");
  redirect("/login");
};
