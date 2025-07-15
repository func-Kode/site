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
  const [profile, setProfile] = useState<any>(null);

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
      <h1 className="text-3xl font-bold mb-4">Set up your profile</h1>
      <OnboardProfileForm initialProfile={profile} />
    </div>
  );
}
