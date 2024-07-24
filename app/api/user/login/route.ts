import prisma from "@/app/app/_lib/db";
import { loginSchema } from "@/app/app/_lib/userSchema";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
    const token = jwt.sign(user, process.env.SECRET_KEY ?? "Secret_key", {
      expiresIn: "1h",
    });
    const refreshToken = jwt.sign(
      user,
      process.env.REFRESH_SECRET_KEY ?? "Refresh_Secret_key",
      { expiresIn: "1d" }
    );

    return NextResponse.json(
      { ...user, accessToken: token, refreshToken: refreshToken },
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
