import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "validationError";
  }
}

export function isTokenExpired(token: string): boolean {
  const now = Date.now() / 1000;
  try {
    const decode: JwtPayload | null = jwt.decode(token, { complete: true });
    if (!decode || !decode?.payload) {
      return true;
    }
    return now > decode.payload?.exp;
  } catch (error) {
    return true;
  }
}
