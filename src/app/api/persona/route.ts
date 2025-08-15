import { NextRequest, NextResponse } from "next/server";
import { getProfileFromRequest } from "@/lib/getProfile";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const profile = await getProfileFromRequest(req);
  if (!profile) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(profile.persona ?? null);
}

export async function POST(req: NextRequest) {
  const profile = await getProfileFromRequest(req);
  if (!profile) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const persona = await req.json();
  const updated = await prisma.profile.update({
    where: { profileId: profile.profileId },
    data: { persona },
  });
  return NextResponse.json(updated.persona);
}
