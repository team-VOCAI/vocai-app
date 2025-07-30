import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "default_secret";

export function getProfileFromToken(token: string) {
  try {
    return jwt.verify(token, SECRET) as { userId: number; [key: string]: any };
  } catch {
    return null;
  }
}
