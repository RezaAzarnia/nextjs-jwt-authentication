import prisma from "@/app/app/_lib/db";
import { loginSchema } from "@/app/app/_lib/userSchema";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
  const data = await request.json();
  const { email, password } = data;
  const userValidation = loginSchema.safeParse(data);
  if (!userValidation.success) {
    return NextResponse.json(
      {
        status: 400,
        message: userValidation?.error?.flatten().fieldErrors,
      },
      {
        status: 400,
      }
    );
  }
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    const isMatch = user && (await bcrypt.compare(password, user?.password));

    if (!user || !isMatch) {
      return NextResponse.json(
        {
          status: 403,
          message: "email or password is wrong",
        },
        {
          status: 403,
        }
      );
    }

    return NextResponse.json(
      { ...user, accessToken: "my token" },
      {
        status: 201,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "internal server occured",
      },
      {
        status: 500,
      }
    );
  }
}
