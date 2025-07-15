"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  const handleGithubLogin = async () => {
    const supabase = createClientComponentClient();
    
    const { data, error } = await
    supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        scopes: "read:user user:email repo read:discussion",
        redirectTo: "https://main.d1y6vxwm1j5wrs.amplifyapp.com/dashboard",
      },
    });

    console.log("Supabase OAuth initiated. Redirecting to:", data?.url);
    if (error) {
      console.error("OAuth error:", error.message);
      return;
    }

    // Manullly redirect to the GitHub OAuth URL
    if (data?.url) {
      window.location.href = data.url;
    } else {
      console.warn("No redirect URL returned from Supabase.");
    }
  };
  return (
    <div className="flex flex-col gap-6">
      <Button
        type="button"
        onClick={handleGithubLogin}
        className="w-full bg-gray-900 hover:bg-gray-800 text-white"
      >
        Sign in with GitHub
      </Button>
    </div>
  );
}
