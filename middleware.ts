import { updateSession } from "@/lib/supabase/middleware";
import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // If Supabase returns to the site root or any path with ?code=... (or error),
  // funnel it to our dedicated auth callback so the session can be exchanged.
  const hasOAuthParams =
    searchParams.has("code") ||
    searchParams.has("error") ||
    searchParams.has("error_description") ||
    searchParams.has("state");

  if (hasOAuthParams && !pathname.startsWith("/auth/callback")) {
    const callbackUrl = new URL("/auth/callback", request.url);

    // Preserve all params from the current URL
    searchParams.forEach((value, key) => {
      callbackUrl.searchParams.set(key, value);
    });

    // If we have an intended destination (redirect/next), forward it as next
    const intended = searchParams.get("redirect") || searchParams.get("next");
    if (intended && !callbackUrl.searchParams.get("next")) {
      callbackUrl.searchParams.set("next", intended);
    }

    return NextResponse.redirect(callbackUrl);
  }

  // Otherwise proceed with normal session update
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
