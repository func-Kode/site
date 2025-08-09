"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";

export function SignUpForm() {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGithub = async () => {
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
        setErrorMsg("Could not start GitHub sign-in. Please try again.");
        setLoading(false);
        return;
      }
      if (data?.url) {
        window.location.href = data.url;
      } else {
        setErrorMsg("No redirect URL returned. Please retry.");
        setLoading(false);
      }
    } catch (e) {
      console.error("OAuth sign-up error:", e);
      setErrorMsg("Unexpected error. Please retry.");
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Join func(Kode)</CardTitle>
        <CardDescription>
          Sign in or sign up using your GitHub account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <Button
            onClick={handleGithub}
            disabled={loading}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white"
          >
            {loading ? "Redirecting to GitHub…" : "Continue with GitHub"}
          </Button>
          {errorMsg && (
            <p className="text-sm text-red-500 text-center">{errorMsg}</p>
          )}
          <p className="text-xs text-muted-foreground text-center">
            We use GitHub for authentication. You&apos;ll be redirected to GitHub
            and then back here.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
