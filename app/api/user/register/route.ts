import { registerSchema } from "@/app/app/_lib/userSchema";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/app/app/_lib/db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const secret_key: string = process.env.SECRET_KEY || "secrete-key";
const refresh_secret_key: string =
  process.env.REFRESH_SECRET_KEY || "refresh-secrete-key";

export async function POST(req: Request) {
  const data = await req.json();
  const { username, email, password } = data;
  const userValidation = registerSchema.safeParse(data);

  if (!userValidation.success) {
    return NextResponse.json(
      {
        status: 400,
        error: userValidation?.error?.flatten().fieldErrors,
      },
      {
        status: 400,
      }
    );
  }

  try {
    const isExitUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (isExitUser) {
      return NextResponse.json(
        {
          status: 409,
          error: "This email is already in use. Please try another one!!",
        },
        { status: 409 }
      );
    }
    const hashedPassword = async (password: string): Promise<string> => {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      return hashedPassword;
    };

    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: await hashedPassword(password),
      },
    });
    const token = jwt.sign({ id: user.id, email: user.email }, secret_key, {
      expiresIn: "1h",
    });
    const refsrehToken = jwt.sign(
      { id: user.id, email: user.email },
      refresh_secret_key,
      {
        expiresIn: "2d",
      }
    );
    const cookieOption = {
      httpOnly: true,
      expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    };
    cookies().set("token", token, cookieOption);
    cookies().set("refresh_token", refsrehToken, cookieOption);

    return NextResponse.json(
      {
        message: "user created successfully",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: 500,
        message: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}
