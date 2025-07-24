"use client";
// import { DeployButton } from "@/components/deploy-button";
// import { EnvVarWarning } from "@/components/env-var-warning";
// import { AuthButton } from "@/components/auth-button";
// import { Hero } from "@/components/hero";
// import { ThemeSwitcher } from "@/components/theme-switcher";
// import { ConnectSupabaseSteps } from "@/components/tutorial/connect-supabase-steps";
// import { SignUpUserSteps } from "@/components/tutorial/sign-up-user-steps";
// import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useMemo } from "react";

export default function HomePage() {

  // Example tip of the day
  const tips = [
    "Use meaningful variable names for better code readability.",
    "Break down large functions into smaller, reusable components.",
    "Comment your code where necessary, but let the code speak for itself.",
  ];
  const [tipIndex, setTipIndex] = useState(0);

  // Event announcement & countdown
  const eventName = "Ship in an hour (#1)";
  // Event starts at 1:30 PM and ends at 5:30 PM on August 2, 2025
  const eventStartDate = useMemo(() => new Date(2025, 7, 2, 13, 30, 0), []); // August 2, 2025, 1:30 PM
  const eventEndDate = useMemo(() => new Date(2025, 7, 2, 17, 30, 0), []); // August 2, 2025, 5:30 PM
  // ...existing code...
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      if (now >= eventEndDate) {
        setTimeLeft("Event has ended.");
        return;
      }
      if (now >= eventStartDate && now < eventEndDate) {
        setTimeLeft("Event is live!");
        return;
      }
      const diff = eventStartDate.getTime() - now.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setTimeLeft(
        `${days}d ${hours}h ${minutes}m ${seconds}s`
      );
    };
    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [eventStartDate, eventEndDate]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-between bg-brand-gray px-4 py-6 md:py-12">
      {/* Announcement Banner */}
      <div className="w-full max-w-2xl mx-auto mb-8">
        <div className="bg-gradient-to-r from-blue-600 via-green-400 to-blue-600 text-white rounded-xl shadow-lg p-6 flex flex-col md:flex-row items-center justify-between gap-4 animate-fade-in">
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-xl md:text-2xl font-bold mb-1">🚀 Upcoming Event: {eventName}</h2>
            <p className="text-base md:text-lg">Starts <span className="font-semibold">August 2, 2025, 1:30 PM</span> &ndash; Ends <span className="font-semibold">5:30 PM</span></p>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs font-mono uppercase tracking-wider mb-1">Countdown</span>
            <span className="text-2xl md:text-3xl font-bold font-mono bg-black bg-opacity-20 px-4 py-2 rounded-lg shadow-inner" aria-live="polite">{timeLeft}</span>
            <Link
              href="/events"
              className="mt-3 px-4 py-2 bg-white text-blue-700 font-semibold rounded-md shadow hover:bg-blue-100 transition-colors"
            >
              See Event Details
            </Link>
          </div>
        </div>
      </div>
      {/* Hero Section */}
      <section className="w-full max-w-md mx-auto flex flex-col items-center text-center gap-6 animate-fade-in">
        {/* Logo & Tagline */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            {/* Placeholder raccoon image */}
            <span className="inline-block animate-bounce">
              <Image src="/raccoon.png" alt="Raccoon Mascot" width={56} height={56} />
            </span>
            <span className="text-3xl font-bold text-brand-blue">func(Kode)</span>
          </div>
          <span className="text-brand-green text-sm font-semibold tracking-wide">execute optimize code;</span>
        </div>
        {/* Intro */}
        <h1 className="text-xl md:text-2xl font-semibold text-brand-blue leading-tight">Welcome to func(Kode) — Where Code Meets Creativity!</h1>
        <p className="text-base text-gray-700">A developers&apos; community empowering developers with tips, projects, and insights. Join the journey with our raccoon mascot!</p>
        {/* CTAs */}
        <div className="flex gap-3 justify-center mt-2">
          <a href="/projects" className="px-5 py-2 rounded-full bg-brand-green text-white font-semibold shadow-md hover:scale-105 active:scale-95 transition-transform duration-200">View Projects</a>
          <Link href="/blog" className="px-5 py-2 rounded-full bg-brand-blue text-white font-semibold shadow-md hover:scale-105 active:scale-95 transition-transform duration-200">Read Blog</Link>
        </div>
      </section>
      {/* Micro-interaction: Animated code cursor */}
      <div className="mt-10 flex flex-col items-center">
        <div className="bg-white rounded-lg shadow p-4 w-full max-w-xs flex flex-col items-center gap-2 animate-slide-up">
          <span className="text-xs text-brand-blue font-mono uppercase tracking-wider">Tip of the Day</span>
          <span className="text-sm text-gray-800 font-mono transition-opacity duration-500">{tips[tipIndex]}</span>
          <button
            className="mt-2 text-brand-green text-xs underline hover:text-brand-blue transition-colors"
            onClick={() => setTipIndex((tipIndex + 1) % tips.length)}
            aria-label="Next tip"
          >
            Next Tip
          </button>
        </div>
        {/* Animated code cursor */}
        <div className="mt-4 flex items-center font-mono text-brand-blue text-lg">
          <span>{`>`}</span>
          <span className="ml-1 animate-blink">|</span>
        </div>
      </div>
    </main>
  );
}
