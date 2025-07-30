import { NextResponse, type NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 인증 필요 없는 경로 패스
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // payload 검증은 하지 않고 토큰만 헤더에 넘겨줌
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-access-token", token);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/api/:path*"],
};
