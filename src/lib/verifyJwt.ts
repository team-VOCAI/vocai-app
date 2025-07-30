import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-default-secret-key"
); // 꼭 환경변수로 설정하세요!

interface JwtPayload {
  userId: number;
  iat?: number;
  exp?: number;
}

export async function verifyJwt(token: string): Promise<JwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as JwtPayload;
  } catch (error) {
    console.error("JWT 검증 실패:", error);
    return null;
  }
}
