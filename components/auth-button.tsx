import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./logout-button";
import { cookies } from "next/headers";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import type { User } from "@supabase/supabase-js";

export async function AuthButton() {
  // Always await cookies() as it returns a Promise in Next.js 14+
  const cookieStore: ReadonlyRequestCookies = await cookies();
  const cookieAdapter = {
    getAll: () => cookieStore.getAll(),
    set: () => {}, // no-op for server components
  };
  const supabase = createClient(cookieAdapter);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Helper function to get display name
  const getDisplayName = (user: User) => {
    // Try to get GitHub username from user_metadata
    const githubUsername = user.user_metadata?.user_name || user.user_metadata?.preferred_username;
    if (githubUsername) {
      return `@${githubUsername}`;
    }
    
    // Try to get full name
    const fullName = user.user_metadata?.full_name || user.user_metadata?.name;
    if (fullName) {
      return fullName;
    }
    
    // Fallback to email username (part before @)
    if (user.email) {
      return user.email.split('@')[0];
    }
    
    return 'User';
  };

  return user ? (
    <div className="flex items-center gap-4">
      Hey, {getDisplayName(user)}!
      <LogoutButton />
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/auth/login">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/auth/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}
