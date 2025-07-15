'use client'

import { useEffect, useState } from 'react';
import { createClientComponentClient, Session } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import OnboardProfileForm from "@/components/onboard-profile-form";

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
      const { data, error } = await supabase.auth.getSession();
      console.log('Supabase session:', data.session, 'Error:', error);
      if (error || !data.session) {
        setLoading(false);
        setSession(null);
        return;
      }
      setSession(data.session);
      // Fetch user profile from users table
      const { data: userProfile, error: profileError } = await supabase.from('users').select('*').eq('id', data.session.user.id).single();
      if (profileError) {
        console.error('Profile fetch error:', profileError.message);
      }
      setProfile(userProfile);
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
      <h1 className="text-3xl font-bold mb-4">Set up your profile</h1>
      <OnboardProfileForm initialProfile={profile} />
    </div>
  );
}
