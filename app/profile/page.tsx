"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import type React from "react";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setName(data.user?.user_metadata?.name || "");
    });
  }, []);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setSuccess(false);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ data: { name } });
    setSaving(false);
    setSuccess(!error);
  };

  return (
    <main className="max-w-md mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-brand-blue dark:text-brand-blue mb-8 text-center">Profile</h1>
      <form className="bg-white dark:bg-card rounded-lg shadow p-6 flex flex-col gap-4" onSubmit={handleSave}>
        <div>
          <label className="block text-sm font-medium text-brand-blue dark:text-brand-blue mb-1">Email</label>
          <input
            type="email"
            value={user?.email || ""}
            readOnly
            className="w-full rounded border px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-500 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-brand-blue dark:text-brand-blue mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-900 text-brand-blue dark:text-brand-green"
            placeholder="Enter your name"
          />
        </div>
        <button
          type="submit"
          className="mt-2 px-4 py-2 rounded bg-brand-green text-white font-semibold hover:bg-brand-blue transition-colors"
          disabled={saving}
        >
          {saving ? "Saving..." : "Save"}
        </button>
        {success && <div className="text-green-600 text-sm mt-2">Profile updated!</div>}
      </form>
    </main>
  );
} 