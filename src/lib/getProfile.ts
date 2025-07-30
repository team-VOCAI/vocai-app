import { NextRequest } from "next/server";
import { prisma } from "./prisma";
import { verifyJwt } from "./verifyJwt";

export async function getProfileFromRequest(req: NextRequest) {
  const token = req.cookies.get("token")?.value || req.headers.get("x-access-token");
  if (!token) return null;

  const payload = await verifyJwt(token);
  if (!payload?.userId) return null;

  const profile = await prisma.profile.findFirst({
    where: { userId: payload.userId },
  });

  return profile;
}

export async function getProfileFromToken(token: string) {
  return verifyJwt(token);
}

