import { NextResponse, type NextRequest } from "next/server";
import { verifyJwt } from "@/lib/verifyJwt";
import { prisma } from "@/lib/prisma";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 인증 필요 없는 경로 패스
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await verifyJwt(token);
  if (!payload?.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await prisma.profile.findFirst({
    where: { userId: payload.userId },
  });

  if (!profile) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-user-profile", JSON.stringify(profile));

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/api/:path*"],
};
