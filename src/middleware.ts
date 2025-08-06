import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_PATHS = [
  "/dashboard",
  "/community/boards",
  "/profile",
  "/settings",
];

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value; // 쿠키에서 로그인 토큰 확인
  const { pathname, search } = req.nextUrl;

  const isProtected = PROTECTED_PATHS.some((path) => pathname.startsWith(path));

  if (isProtected && !token) {
    // 로그인 안 했으면 로그인 페이지로
    const loginUrl = new URL("/signin", req.url);
    console.log("미들웨어를 들어옴");
    // 로그인 후 돌아올 경로를 쿼리에 저장
    loginUrl.searchParams.set("redirect", pathname + search);

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/community/boards/:path*",
    "/profile/:path*",
    "/settings/:path*",
  ],
};
