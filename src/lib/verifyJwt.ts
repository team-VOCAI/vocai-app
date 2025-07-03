import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-default-secret-key"; // 꼭 환경변수로 설정하세요!

interface JwtPayload {
  userId: number;
  iat?: number;
  exp?: number;
}

export function verifyJwt(token: string): JwtPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    return decoded;
  } catch (error) {
    console.error("JWT 검증 실패:", error);
    return null;
  }
}