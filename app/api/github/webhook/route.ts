import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const eventType = req.headers.get("x-github-event");
    console.log("Payload:", payload);

    // Fire and forget (async side effect, don't await)
    handleGitHubEvent(eventType, payload);

    return NextResponse.json({ ok: true });

  } catch (err) {
    console.error("Error parsing webhook:", err);
    return NextResponse.json({ error: "Invalid webhook" }, { status: 400 });
  }
}

// Move logic to a background async handler (no await in main handler)
async function handleGitHubEvent(eventType: string | null, payload: any) {
  console.log("Event received:", eventType);
  console.log("Payload:", payload);

  const repo = payload.repository?.full_name;
  const user = payload.sender?.login || payload.pull_request?.user?.login;
  const action = payload.action || 'unknown';

  const { error } = await supabase.from('activities').insert({
    event_type: eventType,
    repo,
    username: user,
    action,
    payload
  });

  if (error) {
    console.error("Supabase insert error:", error);
  } else {
    console.log("Activity saved to Supabase ✅");
  }
}
