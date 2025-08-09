"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      const supabase = createClientComponentClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // User is already logged in, redirect to dashboard
        router.replace("/dashboard");
        return;
      }
      
      setChecking(false);
    };

    checkAuth();
  }, [router]);

  const handleGitHubLogin = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const supabase = createClientComponentClient();
      const redirectTo = `${window.location.origin}/auth/callback`;
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo,
          scopes: "read:user user:email"
        }
      });

      if (error) {
        setError("Failed to start GitHub authentication. Please try again.");
        setLoading(false);
      }
      // If successful, user will be redirected to GitHub
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted/20">
        <div className="flex flex-col items-center gap-4">
          <Image 
            src="/raccoon.png" 
            alt="func(Kode) Raccoon" 
            width={48} 
            height={48} 
            className="animate-bounce"
          />
          <p className="text-muted-foreground">Checking your session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted/20 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Image 
            src="/raccoon.png" 
            alt="func(Kode) Raccoon" 
            width={80} 
            height={80} 
            className="mx-auto animate-bounce"
          />
          <h1 className="mt-6 text-3xl font-bold text-brand-blue">
            Get Started with func(Kode)
          </h1>
          <p className="mt-2 text-muted-foreground">
            Join our community of developers building amazing projects together
          </p>
        </div>

        <div className="bg-card rounded-2xl shadow-lg p-8 border">
          <Button
            onClick={handleGitHubLogin}
            disabled={loading}
            className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white flex items-center justify-center gap-3 rounded-lg font-semibold transition-all"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Connecting to GitHub...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                Continue with GitHub
              </>
            )}
          </Button>

          {error && (
            <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive text-center">{error}</p>
            </div>
          )}

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>By continuing, you agree to our terms and join our open-source community</p>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            New to func(Kode)? You&apos;ll be automatically onboarded after signing in
          </p>
        </div>
      </div>
    </div>
  );
}
