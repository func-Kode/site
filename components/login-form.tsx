"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGithubLogin = async () => {
    setErrorMsg(null);
    setLoading(true);
    const supabase = createClientComponentClient();

    try {
      const origin = window.location.origin;
      const params = new URLSearchParams(window.location.search);
      const nextParam = params.get("redirect") || params.get("next") || "/dashboard";
      const callback = `${origin}/auth/callback${nextParam ? `?next=${encodeURIComponent(nextParam)}` : ""}`;

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          scopes: "read:user user:email",
          redirectTo: callback,
        },
      });

      if (error) {
        console.error("OAuth error:", error.message);
        setErrorMsg("Sign-in failed. Please try again.");
        setLoading(false);
        return;
      }

      // Manually redirect to the GitHub OAuth URL (Supabase can also auto-redirect)
      if (data?.url) {
        window.location.href = data.url;
      } else {
        console.warn("No redirect URL returned from Supabase.");
        setErrorMsg("Could not start GitHub sign-in. Please try again.");
        setLoading(false);
      }
    } catch (e) {
      console.error("Unexpected OAuth error:", e);
      setErrorMsg("Unexpected error. Please retry.");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Button
        type="button"
        onClick={handleGithubLogin}
        disabled={loading}
        className="w-full bg-gray-900 hover:bg-gray-800 text-white"
      >
        {loading ? "Redirecting to GitHub…" : "Sign in with GitHub"}
      </Button>
      {errorMsg && <p className="text-sm text-red-500 text-center">{errorMsg}</p>}
      <p className="text-xs text-muted-foreground text-center">
        You will be redirected to GitHub and then back to your dashboard.
      </p>
    </div>
  );
}
