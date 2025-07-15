"use client";

import { useCallback } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";

// Set your production URL here or use env variable if available
const PROD_URL = "https://main.d1y6vxwm1j5wrs.amplifyapp.com";

export function LoginForm() {
  const handleGithubLogin = useCallback(async () => {
    try {
      const supabase = createClientComponentClient();
      const redirectTo = `${PROD_URL}/dashboard`;
      const { error, data } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          scopes: "read:user user:email repo read:discussion",
          redirectTo,
        },
      });
      if (error) {
        console.error("Supabase OAuth error:", error.message);
      } else {
        // data.url contains the redirect URL for the OAuth provider
        console.log("Supabase OAuth initiated. Redirecting to:", data?.url || redirectTo);
      }
    } catch (err) {
      console.error("Unexpected error during GitHub OAuth:", err);
    }
  }, []);

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
