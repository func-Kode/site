"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { LoginForm } from "@/components/login-form";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

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
          <LoginForm />

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
