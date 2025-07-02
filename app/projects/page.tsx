"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

const dummyProjects = [
  {
    title: "Code Snippet Manager",
    description: "Organize and share your favorite code snippets.",
    image: "/raccoon.png",
  },
  {
    title: "Realtime Chat App",
    description: "A modern chat app built with Supabase and Next.js.",
    image: "/raccoon.png",
  },
  {
    title: "Portfolio Generator",
    description: "Create a beautiful developer portfolio in minutes.",
    image: "/raccoon.png",
  },
];

export default function ProjectsPage() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-brand-blue dark:text-brand-blue mb-8 text-center">Projects</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-card rounded-lg shadow p-6 animate-pulse flex flex-col gap-3">
                <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-2" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              </div>
            ))
          : dummyProjects.map((project, i) => (
              <div key={i} className="bg-white dark:bg-card rounded-lg shadow p-6 flex flex-col gap-3">
                <Image src={project.image} alt={project.title} width={80} height={80} className="rounded mb-2 self-center" />
                <h2 className="text-xl font-semibold text-brand-blue dark:text-brand-blue">{project.title}</h2>
                <p className="text-gray-700 dark:text-gray-200">{project.description}</p>
              </div>
            ))}
      </div>
    </main>
  );
} 