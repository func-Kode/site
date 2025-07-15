"use client";
import Link from "next/link";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/logout-button";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

export function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const supabase = createClientComponentClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <nav className="w-full flex items-center justify-between px-4 py-3 bg-brand-gray dark:bg-brand-gray border-b border-border shadow-sm sticky top-0 z-50">
      <Link href="/" className="flex items-center gap-2">
        <span className="text-xl font-bold text-brand-blue dark:text-brand-blue">func(Kode)</span>
      </Link>
      <div className="flex items-center gap-3">
        <ThemeSwitcher />
        {user ? (
          <div className="flex items-center gap-2">
            <span className="text-sm text-brand-blue dark:text-brand-blue">{user.email}</span>
            <LogoutButton />
          </div>
        ) : (
          <div className="flex gap-2">
            <Button asChild size="sm" variant="outline">
              <Link href="/auth/login">Sign in</Link>
            </Button>
            <Button asChild size="sm" variant="default">
              <Link href="/auth/sign-up">Sign up</Link>
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}