"use client";
import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

interface UserProfile {
  id: string;
  github_username: string;
  display_name: string;
  bio: string;
  avatar_url?: string;
  is_onboarded: boolean;
}

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClientComponentClient();
    
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push("/auth/login");
        return;
      }

      // Get user profile
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profile) {
        setProfile(profile);
      }

      setLoading(false);
    };

    getUser();
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Image 
            src="/raccoon.png" 
            alt="func(Kode) Raccoon" 
            width={48} 
            height={48} 
            className="animate-bounce"
          />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      {/* Welcome Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-4 mb-4">
          <Image 
            src={profile?.avatar_url || "/raccoon.png"} 
            alt="Profile" 
            width={80} 
            height={80} 
            className="rounded-full border-4 border-brand-blue shadow-lg"
          />
          <div>
            <h1 className="text-3xl font-bold text-brand-blue">
              Welcome, {profile?.display_name || "Developer"}!
            </h1>
            {profile?.github_username && (
              <p className="text-muted-foreground">@{profile.github_username}</p>
            )}
          </div>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          You&apos;re now part of the func(Kode) community. Let&apos;s build amazing things together!
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Link 
          href="/projects" 
          className="bg-card p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105 border"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-brand-blue rounded-lg flex items-center justify-center">
              <span className="text-2xl text-white">🚀</span>
            </div>
            <div>
              <h3 className="font-semibold text-lg">View Projects</h3>
              <p className="text-sm text-muted-foreground">Explore community projects</p>
            </div>
          </div>
        </Link>

        <Link 
          href="/onboard" 
          className="bg-card p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105 border"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-brand-green rounded-lg flex items-center justify-center">
              <span className="text-2xl text-white">👤</span>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Complete Profile</h3>
              <p className="text-sm text-muted-foreground">Finish your onboarding</p>
            </div>
          </div>
        </Link>

        <Link 
          href="/events" 
          className="bg-card p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105 border"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-2xl text-white">📅</span>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Join Events</h3>
              <p className="text-sm text-muted-foreground">Upcoming sprints & meetups</p>
            </div>
          </div>
        </Link>
      </div>

      {/* GitHub Integration */}
      <div className="bg-card p-6 rounded-2xl shadow-lg border mb-8">
        <h2 className="text-xl font-semibold mb-4">GitHub Integration</h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            <div>
              <p className="font-medium">Connected to GitHub</p>
              <p className="text-sm text-muted-foreground">
                {profile?.github_username ? `@${profile.github_username}` : "GitHub account linked"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-green-600">Connected</span>
          </div>
        </div>
      </div>

      {/* Getting Started */}
      <div className="bg-gradient-to-r from-brand-blue/10 to-brand-purple/10 p-6 rounded-2xl border">
        <h2 className="text-xl font-semibold mb-4">Getting Started</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">✓</span>
            </div>
            <span>Sign in with GitHub</span>
          </div>
          <div className="flex items-center gap-3">
            <div className={`w-6 h-6 ${profile?.is_onboarded ? 'bg-green-500' : 'bg-gray-300'} rounded-full flex items-center justify-center`}>
              <span className="text-white text-sm">{profile?.is_onboarded ? '✓' : '○'}</span>
            </div>
            <span>Complete your profile</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">○</span>
            </div>
            <span>Star our GitHub repository</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">○</span>
            </div>
            <span>Join your first sprint</span>
          </div>
        </div>
      </div>
    </main>
  );
}
