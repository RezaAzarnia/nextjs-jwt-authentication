import { cookies } from "next/headers";
import prisma from "@/app/app/_lib/db";
import { loginSchema } from "@/app/app/_lib/userSchema";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const secret_key: string = process.env.SECRET_KEY || "secrete-key";
const refresh_secret_key: string =
  process.env.REFRESH_SECRET_KEY || "refresh-secrete-key";

export async function POST(request: Request) {
  const data = await request.json();
  const { email, password } = data;
  const userValidation = loginSchema.safeParse(data);

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
          error: "email or password is wrong",
        },
        {
          status: 403,
        }
      );
    }

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
      { token: token },
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
