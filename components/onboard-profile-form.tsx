"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function OnboardProfileForm({
  initialProfile,
}: {
  initialProfile: {
    id: string;
    github_username: string;
    display_name: string;
    bio: string;
    skills: string;
    role_preference: string;
    interests: string;
    avatar_url?: string;
  };
}) {
  // Ensure all fields are always defined to avoid uncontrolled-to-controlled warnings
  const safeProfile = {
    github_username: initialProfile.github_username ?? '',
    display_name: initialProfile.display_name ?? '',
    bio: initialProfile.bio ?? '',
    skills: initialProfile.skills ?? '',
    role_preference: initialProfile.role_preference ?? '',
    interests: initialProfile.interests ?? '',
    avatar_url: initialProfile.avatar_url ?? '',
    id: initialProfile.id,
  };
  const [form, setForm] = useState(safeProfile);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClientComponentClient();
    const { error } = await supabase.from("users").update({
      github_username: form.github_username,
      display_name: form.display_name,
      bio: form.bio,
      skills: form.skills,
      role_preference: form.role_preference,
      interests: form.interests,
      is_onboarded: true,
    }).eq("id", form.id);
    setLoading(false);
    if (error) {
      setError(`Failed to update profile: ${error.message}`);
      return;
    }
    router.push("/dashboard");
  };

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white shadow-xl rounded-2xl p-8 space-y-8 border border-gray-100 animate-fade-in">
        <div className="flex flex-col items-center gap-2 mb-6">
          {form.avatar_url && (
            <Image src={form.avatar_url} alt="Avatar" width={72} height={72} className="rounded-full border-2 border-blue-500 shadow" />
          )}
          <span className="text-lg font-semibold text-gray-800">@{form.github_username}</span>
          <span className="text-sm text-gray-500">GitHub User</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-medium mb-1">Display Name</label>
            <input name="display_name" value={form.display_name} onChange={handleChange} className="input input-bordered w-full" required placeholder="Your name" />
            <p className="text-xs text-gray-400 mt-1">This will be shown on your profile.</p>
          </div>
          <div>
            <label className="block font-medium mb-1">Role Preference</label>
            <select name="role_preference" value={form.role_preference} onChange={handleChange} className="input input-bordered w-full">
              <option value="">Select...</option>
              <option value="frontend">Frontend</option>
              <option value="backend">Backend</option>
              <option value="fullstack">Fullstack</option>
            </select>
            <p className="text-xs text-gray-400 mt-1">What do you want to work on?</p>
          </div>
        </div>
        <div>
          <label className="block font-medium mb-1">Bio</label>
          <textarea name="bio" value={form.bio} onChange={handleChange} className="input input-bordered w-full" rows={3} placeholder="Tell us about yourself..." />
          <p className="text-xs text-gray-400 mt-1">A short intro for your profile.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-medium mb-1">Skills</label>
            <input name="skills" value={form.skills} onChange={handleChange} className="input input-bordered w-full" placeholder="e.g. React, Node.js" />
            <p className="text-xs text-gray-400 mt-1">Comma separated skills.</p>
          </div>
          <div>
            <label className="block font-medium mb-1">Interests</label>
            <input name="interests" value={form.interests} onChange={handleChange} className="input input-bordered w-full" placeholder="e.g. open source, ai, webdev" />
            <p className="text-xs text-gray-400 mt-1">Comma separated interests/tags.</p>
          </div>
        </div>
        {error && <div className="text-red-500 text-sm text-center">{error}</div>}
        <button
          type="submit"
          className="w-full py-3 rounded-lg bg-blue-600 text-white font-bold text-lg shadow hover:bg-blue-700 transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-60"
          disabled={loading}
        >
          {loading && <span className="loader border-white border-t-blue-600 mr-2"></span>}
          {loading ? "Saving..." : "Complete Onboarding"}
        </button>
      </form>
    </div>
  );
}
