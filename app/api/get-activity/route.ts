import { NextRequest, NextResponse } from "next/server";
import { getActivityLogs } from "@/lib/supabase/getActivityLogs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = Number(searchParams.get("limit")) || 50;
  const repo = searchParams.get("repo") || undefined;
  const username = searchParams.get("username") || undefined;
  const event_type = searchParams.get("event_type") || undefined;

  const { data, count, error } = await getActivityLogs({ limit, repo, username, event_type });
  if (error) {
    // Log the error object for debugging
    console.error("Error fetching activity logs:", error, JSON.stringify(error));
    // Return a more descriptive error message
    let message = "Unknown error";
    if (typeof error === "string") message = error;
    else if (error && typeof error.message === "string") message = error.message;
    else message = JSON.stringify(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
  return NextResponse.json({ data, count });
}
