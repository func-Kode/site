"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import { getOAuthRedirectPath } from "@/lib/supabase/server";

export function LoginForm() {
  const handleGithubLogin = async () => {
    const supabase = createClientComponentClient();
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        scopes: "read:user user:email repo read:discussion",
        redirectTo: getOAuthRedirectPath("/dashboard"),
      },
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <Button
        onClick={handleGithubLogin}
        className="w-full bg-gray-900 hover:bg-gray-800 text-white"
      >
        Sign in with GitHub
      </Button>
    </div>
  );
}
