import { NextResponse } from "next/server";
import swaggerDocument from "@/lib/swagger";

export const dynamic = "force-static";

export async function GET() {
  return NextResponse.json(swaggerDocument);
}
