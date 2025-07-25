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
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto container-mobile py-8 md:py-12 safe-bottom">
        {/* Announcement Banner */}
        <div className="w-full max-w-4xl mx-auto mb-8 md:mb-12">
          <div className="bg-gradient-to-r from-brand-blue via-brand-green to-primary text-white rounded-2xl shadow-2xl p-4 md:p-6 lg:p-8 flex flex-col lg:flex-row items-center justify-between gap-4 md:gap-6 animate-fade-in animate-gradient card-hover">
            <div className="flex-1 text-center lg:text-left">
              <h2 className="text-responsive-xl font-bold mb-2">🚀 Upcoming Event: {eventName}</h2>
              <p className="text-responsive-base opacity-90">
                Starts <span className="font-semibold">August 2, 2025, 1:30 PM</span> – Ends <span className="font-semibold">5:30 PM</span>
              </p>
            </div>
            <div className="flex flex-col items-center bg-black/20 rounded-xl p-4 backdrop-blur-sm">
              <span className="text-xs font-mono uppercase tracking-wider mb-2 opacity-80">Countdown</span>
              <span className="text-2xl md:text-3xl font-bold font-mono px-4 py-2 rounded-lg bg-white/10 shadow-inner" aria-live="polite">
                {timeLeft}
              </span>
              <Link
                href="/events"
                className="mt-4 px-6 py-3 bg-white text-brand-blue font-semibold rounded-full shadow-lg hover:shadow-xl touch-target button-press transition-all duration-200"
              >
                Event Details
              </Link>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <section className="w-full max-w-4xl mx-auto flex flex-col items-center text-center gap-6 md:gap-8 animate-scale-in">
          {/* Logo & Tagline */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-4">
              <span className="inline-block animate-bounce">
                <Image 
                  src="/raccoon.png" 
                  alt="Raccoon Mascot" 
                  width={64} 
                  height={64} 
                  className="w-12 h-12 md:w-16 md:h-16"
                />
              </span>
              <h1 className="text-responsive-4xl font-bold bg-gradient-to-r from-brand-blue via-primary to-brand-green bg-clip-text text-transparent">
                func(Kode)
              </h1>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-full">
              <span className="w-2 h-2 bg-brand-green rounded-full animate-pulse"></span>
              <span className="text-brand-green text-sm font-mono font-semibold tracking-wide">
                execute optimize code;
              </span>
            </div>
          </div>

          {/* Intro */}
          <div className="max-w-3xl space-y-4">
            <h2 className="text-responsive-2xl font-semibold text-foreground leading-tight">
              Welcome to func(Kode) — Where Code Meets Creativity!
            </h2>
            <p className="text-responsive-base text-muted-foreground leading-relaxed">
              A developers' community empowering developers with tips, projects, and insights. 
              Join our vibrant community and embark on a coding journey with our raccoon mascot!
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center mt-6 md:mt-8 w-full max-w-md sm:max-w-none">
            <Link 
              href="/projects" 
              className="px-6 md:px-8 py-3 md:py-4 rounded-full bg-gradient-to-r from-brand-green to-brand-green/80 text-white font-semibold shadow-lg hover:shadow-xl touch-target button-press transition-all duration-200 text-center"
            >
              View Projects
            </Link>
            <Link 
              href="/blog" 
              className="px-6 md:px-8 py-3 md:py-4 rounded-full bg-gradient-to-r from-brand-blue to-primary text-white font-semibold shadow-lg hover:shadow-xl touch-target button-press transition-all duration-200 text-center"
            >
              Read Blog
            </Link>
            <Link 
              href="/about" 
              className="px-6 md:px-8 py-3 md:py-4 rounded-full border-2 border-primary text-primary font-semibold hover:bg-primary hover:text-primary-foreground touch-target button-press transition-all duration-200 text-center"
            >
              About Us
            </Link>
          </div>
        </section>

        {/* Features Grid */}
        <section className="w-full max-w-6xl mx-auto mt-12 md:mt-20 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <div className="text-center p-6 md:p-8 bg-card rounded-2xl shadow-lg card-hover animate-slide-in-left">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-brand-blue to-primary rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6">
              <span className="text-2xl md:text-3xl">🚀</span>
            </div>
            <h3 className="text-lg md:text-xl font-semibold mb-3 text-foreground">Build Together</h3>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">Collaborate on open-source projects and showcase your work to the community.</p>
          </div>
          
          <div className="text-center p-6 md:p-8 bg-card rounded-2xl shadow-lg card-hover animate-scale-in sm:col-span-2 lg:col-span-1" style={{animationDelay: '0.2s'}}>
            <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-brand-green to-brand-green/80 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6">
              <span className="text-2xl md:text-3xl">📚</span>
            </div>
            <h3 className="text-lg md:text-xl font-semibold mb-3 text-foreground">Learn & Grow</h3>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">Access tutorials, tips, and resources to level up your coding skills.</p>
          </div>
          
          <div className="text-center p-6 md:p-8 bg-card rounded-2xl shadow-lg card-hover animate-slide-in-right sm:col-start-2 lg:col-start-auto">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-primary to-brand-blue rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6">
              <span className="text-2xl md:text-3xl">🌟</span>
            </div>
            <h3 className="text-lg md:text-xl font-semibold mb-3 text-foreground">Connect & Share</h3>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">Join events, meetups, and connect with fellow developers worldwide.</p>
          </div>
        </section>

        {/* Tip of the Day */}
        <section className="w-full max-w-2xl mx-auto mt-12 md:mt-16 flex flex-col items-center">
          <div className="bg-card rounded-2xl shadow-xl p-6 md:p-8 w-full flex flex-col items-center gap-4 animate-slide-up border border-border/50 card-hover">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">💡</span>
              <span className="text-sm text-muted-foreground font-mono uppercase tracking-wider">Tip of the Day</span>
            </div>
            <p className="text-center text-foreground font-medium leading-relaxed transition-all duration-500">
              {tips[tipIndex]}
            </p>
            <button
              className="mt-4 px-6 py-3 bg-gradient-to-r from-brand-green to-brand-green/80 text-white rounded-full font-medium hover:shadow-lg touch-target button-press transition-all duration-200"
              onClick={() => setTipIndex((tipIndex + 1) % tips.length)}
              aria-label="Next tip"
            >
              Next Tip
            </button>
          </div>
          
          {/* Animated code cursor */}
          <div className="mt-8 flex items-center font-mono text-foreground text-xl">
            <span className="text-brand-green">{`>`}</span>
            <span className="ml-2 animate-blink text-primary">|</span>
          </div>
        </section>
      </div>
    </main>
  );
}
