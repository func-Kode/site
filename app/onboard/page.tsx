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
  const [profile, setProfile] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    // Listen for auth state changes to restore session
    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
    });

    const getSessionAndProfile = async () => {
      // Use getUser for secure, authenticated user info
      const { data: { user }, error } = await supabase.auth.getUser();
      console.log('Supabase user:', user, 'Error:', error);
      if (error || !user) {
        setLoading(false);
        setSession(null);
        return;
      }
      setSession({ user } as Session); // Only set user, not full session
      // Fetch user profile from users table
      const { data: userProfile, error: profileError } = await supabase.from('users').select('*').eq('id', user.id).maybeSingle();
      let finalProfile = userProfile;
      if (profileError) {
        // Improved error logging for debugging
        console.error('Profile fetch error:', profileError, profileError?.message, JSON.stringify(profileError));
      }
      // If no profile, create one
      if (!finalProfile) {
        // Try to get GitHub username from user metadata
        const github_username = user.user_metadata?.user_name || user.user_metadata?.preferred_username || '';
        const avatar_url = user.user_metadata?.avatar_url || '';
        const newProfile = {
          id: user.id,
          github_username,
          display_name: user.user_metadata?.name || github_username || 'New User',
          bio: '',
          skills: '',
          role_preference: '',
          interests: '',
          avatar_url,
        };
        const { error: insertError } = await supabase.from('users').insert([newProfile]);
        if (insertError) {
          // Improved error logging for debugging
          console.error('Profile creation error:', insertError, insertError?.message, JSON.stringify(insertError));
        } else {
          // Refetch the profile after creation
          const { data: createdProfile, error: refetchError } = await supabase.from('users').select('*').eq('id', user.id).maybeSingle();
          if (refetchError) {
            console.error('Profile refetch error:', refetchError, refetchError?.message, JSON.stringify(refetchError));
          }
          finalProfile = createdProfile;
        }
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

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!session) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>You must be logged in to onboard. Redirecting...</p>
      </div>
    );
  }
  if (!profile && !loading) return <p className="text-center mt-10 text-red-500">Profile not found or error loading profile. Check your Supabase users table and triggers.</p>;

  if (!isProfileShape(profile)) {
    return <p className="text-center mt-10 text-red-500">Profile data is invalid or incomplete. Please contact support.</p>;
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-8 border border-zinc-200 dark:border-zinc-800 transition-colors">
        <h1 className="text-4xl font-extrabold mb-2 text-zinc-900 dark:text-white tracking-tight">Set up your profile</h1>
        <p className="mb-6 text-zinc-600 dark:text-zinc-400 text-lg">Complete your profile to get the best experience and connect with the community.</p>
        <div className="mb-8 flex items-center gap-4">
          <Image
            src={profile?.avatar_url as string || '/raccoon.png'}
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
          <OnboardProfileForm initialProfile={profile} />
        </div>
        <div className="text-center text-zinc-400 text-xs mt-6">
          Your information is private and secure.
        </div>
      </div>
    </div>
  );
}
