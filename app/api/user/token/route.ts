import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const refresh_secret_key: string =
  process.env.REFRESH_SECRET_KEY ?? "Refresh_Secret_key";
const secret_key: string = process.env.SECRET_KEY || "secrete-key";

type UserType = {
  id: string;
  email: string;
};

export async function POST(request: Request) {
  const refreshToken: string = await request.json();

  if (!refreshToken) {
    return NextResponse.json({
      status: 401,
      message: "no refresh token",
    });
  }
  try {
    const userInfo = jwt.verify(refreshToken, refresh_secret_key) as UserType;

    const { id, email } = userInfo;
    const newAccessToken = jwt.sign({ id, email }, secret_key, {
      expiresIn: "1h",
    });

    return NextResponse.json({
      status: 201,
      newToken: newAccessToken,
    });
  } catch (error) {
    return NextResponse.json({
      status: 403,
      message: "invalid refresh token",
    });
  }
}
