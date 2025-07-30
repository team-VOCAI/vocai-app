import { NextRequest } from "next/server";

export interface ProfileContext {
  profileId: number;
  nickName: string;
  [key: string]: any;
}

export function getProfileFromRequestContext(
  req: NextRequest
): ProfileContext | null {
  const profileString = req.headers.get("x-user-profile");
  if (!profileString) return null;

  try {
    return JSON.parse(profileString);
  } catch (err) {
    console.error("프로필 파싱 실패:", err);
    return null;
  }
}
