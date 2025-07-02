"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";

const dummyIssues = [
  {
    id: 1,
    title: "[Bug] Login form validation error",
    repo: "funcKode/webapp",
    created: "2024-06-10",
    status: "open",
  },
  {
    id: 2,
    title: "[Feature] Add dark mode toggle",
    repo: "funcKode/webapp",
    created: "2024-06-09",
    status: "closed",
  },
];

const dummyPRs = [
  {
    id: 101,
    title: "Fix: Responsive navbar for mobile",
    repo: "funcKode/webapp",
    created: "2024-06-10",
    status: "open",
  },
  {
    id: 102,
    title: "Feat: Add blog comment persistence",
    repo: "funcKode/blog",
    created: "2024-06-08",
    status: "merged",
  },
];

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  return (
    <main className="max-w-4xl mx-auto px-4 py-8 flex flex-col items-center gap-8">
      <div className="flex flex-col items-center gap-3">
        <span className="inline-block animate-bounce">
          <Image src="/raccoon.png" alt="Raccoon Mascot" width={56} height={56} />
        </span>
        <h1 className="text-3xl font-bold text-brand-blue dark:text-brand-blue text-center">Welcome to your Dashboard!</h1>
        {user && <p className="text-brand-green text-center">Signed in as <span className="font-semibold">{user.email}</span></p>}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
        <Link href="/blog" className="bg-brand-blue text-white dark:bg-brand-green dark:text-brand-blue rounded-lg p-6 flex flex-col items-center shadow hover:scale-105 transition-transform">
          <span className="text-lg font-semibold mb-2">Blog</span>
          <span className="text-xs">Read and write comments</span>
        </Link>
        <Link href="/projects" className="bg-brand-green text-white dark:bg-brand-blue dark:text-brand-green rounded-lg p-6 flex flex-col items-center shadow hover:scale-105 transition-transform">
          <span className="text-lg font-semibold mb-2">Projects</span>
          <span className="text-xs">See coding projects</span>
        </Link>
        <Link href="/profile" className="bg-brand-gray text-brand-blue dark:bg-card dark:text-brand-green rounded-lg p-6 flex flex-col items-center shadow hover:scale-105 transition-transform">
          <span className="text-lg font-semibold mb-2">Profile</span>
          <span className="text-xs">Manage your account</span>
        </Link>
      </div>
      {/* Issue Tracker Section */}
      <section className="w-full mt-8">
        <h2 className="text-2xl font-bold text-brand-blue dark:text-brand-blue mb-4">Issue Tracker</h2>
        <div className="bg-white dark:bg-card rounded-lg shadow p-4 flex flex-col gap-3">
          {dummyIssues.length === 0 ? (
            <div className="text-gray-500">No issues found.</div>
          ) : (
            dummyIssues.map((issue) => (
              <div key={issue.id} className="flex flex-col sm:flex-row sm:items-center justify-between border-b last:border-b-0 border-gray-200 dark:border-gray-700 py-2">
                <div>
                  <span className="font-semibold text-brand-blue dark:text-brand-blue">{issue.title}</span>
                  <span className="ml-2 text-xs text-gray-500">[{issue.repo}]</span>
                </div>
                <div className="flex items-center gap-2 mt-2 sm:mt-0">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${issue.status === "open" ? "bg-brand-green text-white" : "bg-gray-300 text-gray-700 dark:bg-gray-800 dark:text-gray-300"}`}>{issue.status}</span>
                  <span className="text-xs text-gray-400">{issue.created}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
      {/* PRs Section */}
      <section className="w-full mt-8">
        <h2 className="text-2xl font-bold text-brand-blue dark:text-brand-blue mb-4">Pull Requests</h2>
        <div className="bg-white dark:bg-card rounded-lg shadow p-4 flex flex-col gap-3">
          {dummyPRs.length === 0 ? (
            <div className="text-gray-500">No pull requests found.</div>
          ) : (
            dummyPRs.map((pr) => (
              <div key={pr.id} className="flex flex-col sm:flex-row sm:items-center justify-between border-b last:border-b-0 border-gray-200 dark:border-gray-700 py-2">
                <div>
                  <span className="font-semibold text-brand-blue dark:text-brand-blue">{pr.title}</span>
                  <span className="ml-2 text-xs text-gray-500">[{pr.repo}]</span>
                </div>
                <div className="flex items-center gap-2 mt-2 sm:mt-0">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${pr.status === "open" ? "bg-brand-green text-white" : pr.status === "merged" ? "bg-brand-blue text-white" : "bg-gray-300 text-gray-700 dark:bg-gray-800 dark:text-gray-300"}`}>{pr.status}</span>
                  <span className="text-xs text-gray-400">{pr.created}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
} 