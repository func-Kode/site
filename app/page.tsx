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
import { useState, useEffect } from "react";

export default function HomePage() {

  // Comprehensive collection of developer tips
  const tips = [
    // Motivation & Growth
    "🚀 Every expert was once a beginner. Your journey matters more than your destination.",
    "💪 The best time to plant a tree was 20 years ago. The second best time is now - start coding!",
    "🌟 Your code doesn't have to be perfect, it just has to be better than yesterday.",
    "🎯 Focus on progress, not perfection. Small daily improvements lead to stunning results.",
    "🔥 Debugging is like being a detective in a crime movie where you're also the murderer.",
    "✨ Code is poetry written in logic. Make yours beautiful and meaningful.",
    
    // Best Practices
    "📝 Use meaningful variable names for better code readability - future you will thank you.",
    "🧩 Break down large functions into smaller, reusable components for maintainability.",
    "💬 Comment your code where necessary, but let clean code speak for itself.",
    "🔄 Refactor mercilessly. Good code is not written, it's rewritten.",
    "🎨 Consistent code style matters more than the specific style you choose.",
    "⚡ Premature optimization is the root of all evil - make it work first, then make it fast.",
    
    // Git & Collaboration
    "📚 Write commit messages like you're telling a story to your future self.",
    "🌿 Create feature branches for every change - keep your main branch clean and deployable.",
    "🔍 Code reviews are not about finding faults, they're about sharing knowledge.",
    "🤝 The best code is written by teams, not individuals. Collaborate fearlessly.",
    "📖 Good documentation is love letter to your future self and your teammates.",
    
    // Problem Solving
    "🧠 When stuck, explain your problem to a rubber duck - or better yet, to a teammate.",
    "🔍 Google is a developer's best friend, but understanding the results is your superpower.",
    "💡 If you can't solve a problem, break it into smaller problems you can solve.",
    "🎪 Stack Overflow is not cheating - it's collaborative learning at its finest.",
    "🚪 Sometimes the best solution is to step away from the keyboard and take a walk.",
    
    // Open Source & Community
    "🌍 Open source is not just about code - it's about building communities and sharing knowledge.",
    "🎁 Your first contribution doesn't have to be code - documentation and bug reports are valuable too.",
    "🏆 Contributing to open source is like going to the gym - it's hard at first, but incredibly rewarding.",
    "🤲 The best way to learn is to teach. Share your knowledge through blogs, talks, or mentoring.",
    "🌱 Every expert was once confused by Git. Don't be afraid to make mistakes and learn.",
    
    // Productivity & Habits
    "⏰ Consistency beats intensity. Code a little every day rather than cramming on weekends.",
    "🎯 Set small, achievable goals. Finishing a feature feels better than starting ten.",
    "🧘 Take breaks. Your best ideas often come when you're not actively trying to solve the problem.",
    "📱 Turn off notifications when coding. Deep work requires uninterrupted focus.",
    "🌙 Sleep is not optional. Well-rested developers write better code and fewer bugs.",
    
    // Learning & Skills
    "📚 Read other people's code. It's like having a conversation with developers across time and space.",
    "🔧 Learn your tools deeply. Mastering your IDE can save hours every week.",
    "🎸 Programming languages are tools, not religions. Choose the right tool for the job.",
    "🧪 Test your code, or your users will test it for you - and they're not as nice about it.",
    "🎨 Design patterns are solutions to common problems. Learn them, but don't overuse them.",
    
    // Career & Growth
    "📈 Your GitHub profile is your portfolio. Make it shine with quality contributions.",
    "🎤 Practice explaining technical concepts in simple terms - it shows true understanding.",
    "🌐 Build things that solve real problems, even if they're small problems.",
    "💼 Side projects are playgrounds for trying new technologies without work constraints.",
    "🎓 Impostor syndrome is real, but so is your growth. You belong in this field.",
    
    // func(Kode) Specific
    "🦝 Welcome to func(Kode)! Every raccoon started as a beginner - let's grow together.",
    "🏅 Check your dashboard regularly to track your open source journey and celebrate wins.",
    "🎯 The leaderboard isn't about competition - it's about motivation and community recognition.",
    "🔥 Your func(Kode) streak shows consistency. Small daily contributions build lasting habits.",
    "🌟 Every issue you solve, every PR you review, makes the open source world a little better."
  ];

  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    // Generate initial random tip
    const initialIndex = Math.floor(Math.random() * tips.length);
    setTipIndex(initialIndex);
  }, [tips.length]);

  return (
    <main className="bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto container-mobile py-8 md:py-12 safe-bottom">
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
              Welcome to func(Kode) — Where Code Meets Creativity&#39;!
            </h2>
            <p className="text-responsive-base text-muted-foreground leading-relaxed">
              A developers&#39; community empowering developers with tips, projects, and insights. 
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
          <Link 
            href="/docs"
            className="text-center p-6 md:p-8 bg-card rounded-2xl shadow-lg card-hover animate-slide-in-left cursor-pointer hover:scale-105 transition-transform duration-200 block"
          >
            <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-brand-blue to-primary rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6">
              <span className="text-2xl md:text-3xl">🚀</span>
            </div>
            <h3 className="text-lg md:text-xl font-semibold mb-3 text-foreground">Build Together</h3>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">Collaborate on open-source projects and showcase your work to the community.</p>
          </Link>
          
          <Link 
            href="/learn"
            className="text-center p-6 md:p-8 bg-card rounded-2xl shadow-lg card-hover animate-scale-in sm:col-span-2 lg:col-span-1 cursor-pointer hover:scale-105 transition-transform duration-200 block"
            style={{animationDelay: '0.2s'}}
          >
            <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-brand-green to-brand-green/80 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6">
              <span className="text-2xl md:text-3xl">📚</span>
            </div>
            <h3 className="text-lg md:text-xl font-semibold mb-3 text-foreground">Learn & Grow</h3>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">Access tutorials, tips, and resources to level up your coding skills.</p>
          </Link>
          
          <Link 
            href="/events"
            className="text-center p-6 md:p-8 bg-card rounded-2xl shadow-lg card-hover animate-slide-in-right sm:col-start-2 lg:col-start-auto cursor-pointer hover:scale-105 transition-transform duration-200 block"
          >
            <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-primary to-brand-blue rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6">
              <span className="text-2xl md:text-3xl">🌟</span>
            </div>
            <h3 className="text-lg md:text-xl font-semibold mb-3 text-foreground">Connect & Share</h3>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">Join events, meetups, and connect with fellow developers worldwide.</p>
          </Link>
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
              onClick={() => {
                // Generate a random index that's different from the current one
                let newIndex;
                do {
                  newIndex = Math.floor(Math.random() * tips.length);
                } while (newIndex === tipIndex && tips.length > 1);
                setTipIndex(newIndex);
              }}
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
