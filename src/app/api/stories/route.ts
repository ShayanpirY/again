import { NextResponse } from "next/server";
import { getStories } from "@/lib/stories";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const active = searchParams.get("active") !== "false";
    const data = await getStories({ active });
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch stories:", error);
    return NextResponse.json({ error: "Failed to fetch stories" }, { status: 500 });
  }
}
