// src/lib/getProfileFromRequest.ts
import { NextRequest } from 'next/server';
import { verifyJwt } from './verifyJwt';
import { prisma } from './prisma';

export async function getProfileFromRequest(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  if (!token) return null;

  const payload = verifyJwt(token);
  if (!payload?.userId) return null;

  const profile = await prisma.profile.findFirst({
    where: { userId: payload.userId },
  });

  return profile;
}
