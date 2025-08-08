"use client";
import { LoginForm } from "@/components/login-form";
import Image from "next/image";
import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const run = async () => {
      const supabase = createClientComponentClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const params = new URLSearchParams(window.location.search);
      const next = params.get("redirect") || params.get("next") || "/dashboard";
      if (user) {
        // Already signed in → send to intended page
        router.replace(next.startsWith("/") ? next : "/dashboard");
        return;
      }
      setChecking(false);
    };
    run();
  }, [router]);

  if (checking) {
    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-brand-gray">
        <div className="w-full max-w-sm mx-auto flex flex-col items-center gap-6">
          <span className="inline-block animate-bounce">
            <Image src="/raccoon.png" alt="Raccoon Mascot" width={48} height={48} />
          </span>
          <p className="text-sm text-muted-foreground">Checking your session…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-brand-gray">
      <div className="w-full max-w-sm mx-auto flex flex-col items-center gap-6">
        <span className="inline-block animate-bounce">
          <Image src="/raccoon.png" alt="Raccoon Mascot" width={48} height={48} />
        </span>
        <h1 className="text-2xl font-bold text-brand-blue text-center">Welcome back to func(Kode)!</h1>
        <div className="w-full">
          <LoginForm />
        </div>
        <p className="text-sm text-gray-500 text-center mt-4">Sign in is only available via GitHub.</p>
      </div>
    </div>
  );
}
