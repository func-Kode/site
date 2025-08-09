"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createBrowserClient } from "@supabase/ssr";
import type { User } from "@supabase/supabase-js";

export function OnboardButton() {
  const [user, setUser] = useState<User | null>(null);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [loading, setLoading] = useState(true);
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        
        if (!user) {
          setLoading(false);
          return;
        }

        // Check if user has completed onboarding by looking for their profile
        const { data: userProfile } = await supabase
          .from('users')
          .select('is_onboarded')
          .eq('id', user.id)
          .maybeSingle();

        // Consider onboarding complete if user has is_onboarded flag set to true
        if (userProfile?.is_onboarded) {
          setIsOnboarded(true);
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkOnboardingStatus();
  }, [supabase]);

  // Don't render the button if user is not logged in, loading, or already onboarded
  if (!user || loading || isOnboarded) {
    return null;
  }

  return (
    <Button
      asChild
      size="sm"
      variant="default"
      className="bg-brand-blue text-white hover:bg-brand-purple transition flex items-center gap-2 shadow-md border-0 px-4 py-2 rounded-lg font-semibold"
      style={{ boxShadow: '0 2px 8px rgba(80, 36, 180, 0.12)' }}
    >
      <Link href="/onboard" className="flex items-center gap-2">
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="inline-block">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
        </svg>
        Complete Profile
      </Link>
    </Button>
  );
}
