'use client'

import { useEffect, useState } from 'react';
import { createClientComponentClient, Session } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import OnboardProfileForm from "@/components/onboard-profile-form";
import Image from 'next/image';

export default function OnboardPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<ProfileShape | null>(null);

  useEffect(() => {
    // Listen for auth state changes to restore session
    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
    });

    const getSessionAndProfile = async () => {
      // Use getUser for secure, authenticated user info
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        setLoading(false);
        setSession(null);
        return;
      }
      setSession({ user } as Session);
      // Fetch user profile from users table
      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      let finalProfile = userProfile;
      // Prepare fallback/default profile
      const github_username = user.user_metadata?.user_name || user.user_metadata?.preferred_username || 'newuser';
      const avatar_url = user.user_metadata?.avatar_url || '';
      const display_name = user.user_metadata?.name || github_username || 'New User';
      const fallbackProfile = {
        id: user.id,
        github_username,
        display_name,
        bio: userProfile?.bio || '',
        skills: userProfile?.skills || '',
        role_preference: userProfile?.role_preference || '',
        interests: userProfile?.interests || '',
        avatar_url,
      };
      // If no profile, create one
      if (!userProfile) {
        const { error: insertError } = await supabase.from('users').insert([fallbackProfile]);
        if (insertError) console.error('Profile creation error:', insertError);
        finalProfile = fallbackProfile;
      } else {
        // Patch profile with defaults for missing fields
        const { error: updateError } = await supabase
          .from('users')
          .update(fallbackProfile)
          .eq('id', user.id);
        if (updateError) console.error('Profile update error:', updateError);
        finalProfile = { ...userProfile, ...fallbackProfile };
      }
      setProfile(finalProfile);
      setLoading(false);
    };
    getSessionAndProfile();
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [supabase, router]);

  useEffect(() => {
    if (!loading && !session) {
      router.push('/auth/login');
    }
  }, [loading, session, router]);

  // Define the expected profile type
  interface ProfileShape {
    id: string;
    github_username: string;
    display_name: string;
    bio: string;
    skills: string;
    role_preference: string;
    interests: string;
    avatar_url?: string;
  }

  function isProfileShape(obj: unknown): obj is ProfileShape {
    if (!obj || typeof obj !== 'object') return false;
    const o = obj as Record<string, unknown>;
    return (
      typeof o.id === 'string' &&
      typeof o.github_username === 'string' &&
      typeof o.display_name === 'string' &&
      typeof o.bio === 'string' &&
      typeof o.skills === 'string' &&
      typeof o.role_preference === 'string' &&
      typeof o.interests === 'string'
    );
  }

  // Only render OnboardProfileForm if profile is not null and isProfileShape(profile)
  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!session) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>You must be logged in to onboard. Redirecting...</p>
      </div>
    );
  }
  if (!profile && !loading) return <p className="text-center mt-10 text-red-500">Profile not found or error loading profile. Check your Supabase users table and triggers.</p>;

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-8 border border-zinc-200 dark:border-zinc-800 transition-colors">
        <h1 className="text-4xl font-extrabold mb-2 text-zinc-900 dark:text-white tracking-tight">Set up your profile</h1>
        <p className="mb-6 text-zinc-600 dark:text-zinc-400 text-lg">Complete your profile to get the best experience and connect with the community.</p>
        <div className="mb-8 flex items-center gap-4">
          <Image
            src={profile?.avatar_url || '/raccoon.png'}
            alt="Avatar"
            width={80}
            height={80}
            className="w-20 h-20 rounded-full border-4 border-primary-500 shadow-md bg-zinc-100 dark:bg-zinc-800 object-cover"
          />
          <div>
            <div className="text-xl font-semibold text-zinc-900 dark:text-white">{profile?.display_name}</div>
            <div className="text-zinc-500 dark:text-zinc-400 text-sm">@{profile?.github_username}</div>
          </div>
        </div>
        <div className="bg-zinc-50 dark:bg-zinc-800 rounded-xl p-6 mb-6 border border-zinc-100 dark:border-zinc-700">
          {profile && isProfileShape(profile) && (
            <OnboardProfileForm initialProfile={profile} />
          )}
        </div>
        <div className="text-center text-zinc-400 text-xs mt-6">
          Your information is private and secure.
        </div>
      </div>
    </div>
  );
}
