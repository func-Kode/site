"use client";
import { OnboardButton } from "@/components/onboard-button";
import { DashboardButton } from "@/components/dashboard-button";
import Link from "next/link";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/logout-button";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { Menu, X, Code, Users, Home, User as UserIcon, MessageCircle } from "lucide-react";

export function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const supabase = createClientComponentClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  // Helper function to get display name
  const getDisplayName = (user: User) => {
    // Try to get GitHub username from user_metadata
    const githubUsername = user.user_metadata?.user_name || user.user_metadata?.preferred_username;
    if (githubUsername) {
      return `@${githubUsername}`;
    }
    
    // Try to get full name
    const fullName = user.user_metadata?.full_name || user.user_metadata?.name;
    if (fullName) {
      return fullName;
    }
    
    // Fallback to email username (part before @)
    if (user.email) {
      return user.email.split('@')[0];
    }
    
    return 'User';
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navigationLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/about", label: "About Us", icon: Users },
    { href: "/projects", label: "Projects", icon: Code },
    { href: "https://discord.gg/nnkA8xJ3JU", label: "Discord", icon: MessageCircle, external: true },
  ];

  return (
    <>
      <nav className="w-full flex items-center justify-between px-4 lg:px-6 py-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/50 sticky top-0 z-50 transition-all duration-200">
        {/* Logo */}
        <Link href="/" className="z-50">
          <span className="text-xl font-bold bg-gradient-to-r from-brand-blue to-primary bg-clip-text text-transparent">
            func(Kode)
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {navigationLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              {...(link.external && { target: "_blank", rel: "noopener noreferrer" })}
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <link.icon className="w-4 h-4" />
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeSwitcher />
          {user ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1 bg-muted rounded-full">
                <UserIcon className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-foreground max-w-32 truncate">
                  {getDisplayName(user)}
                </span>
              </div>
              <OnboardButton />
              <DashboardButton />
              <LogoutButton />
            </div>
          ) : (
            <div className="flex gap-2">
              <Button asChild size="sm" variant="default">
                <Link href="/auth/login">Get started</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeSwitcher />
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMobileMenu}
            className="relative z-50"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" 
            onClick={closeMobileMenu} 
          />
          <div className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 dark:from-slate-950/95 dark:via-slate-900/95 dark:to-slate-950/95 border-l border-slate-700/50 dark:border-slate-600/30 shadow-2xl backdrop-blur-xl animate-in slide-in-from-right duration-300 ease-out">
            <div className="flex flex-col h-full relative overflow-hidden">
              {/* Animated gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/5 to-green-600/10 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-slate-800/10 pointer-events-none" />
              
              {/* Subtle animated dots pattern */}
              <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0s' }} />
                <div className="absolute top-3/4 left-1/3 w-1 h-1 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
              </div>
              
              {/* Mobile Header */}
              <div className="relative flex items-center justify-between p-4 border-b border-slate-700/30 bg-gradient-to-r from-slate-800/50 to-slate-900/30 backdrop-blur-sm">
                <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                  func(Kode)
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={closeMobileMenu}
                  className="h-8 w-8 hover:bg-slate-700/30 text-slate-300 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Navigation Links */}
              <div className="flex-1 overflow-y-auto py-6 relative">
                <div className="space-y-2 px-4">
                  {navigationLinks.map((link, index) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      {...(link.external && { target: "_blank", rel: "noopener noreferrer" })}
                      onClick={closeMobileMenu}
                      className="group flex items-center gap-4 px-4 py-3 text-base font-medium text-slate-200 hover:text-white hover:bg-gradient-to-r hover:from-blue-600/20 hover:via-purple-600/10 hover:to-transparent rounded-xl transition-all duration-200 active:scale-95 hover:shadow-lg animate-in slide-in-from-right duration-200"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-700/50 to-slate-800/50 flex items-center justify-center group-hover:from-blue-500/30 group-hover:to-green-500/20 transition-all duration-200 shadow-sm">
                        <link.icon className="w-4 h-4 text-slate-400 group-hover:text-blue-300 transition-colors duration-200" />
                      </div>
                      {link.label}
                    </Link>
                  ))}
                </div>

                {/* User Section */}
                <div className="mt-8 px-4">
                  {user ? (
                    <div className="space-y-4 animate-in slide-in-from-right duration-300" style={{ animationDelay: '200ms' }}>
                      <div className="flex items-center gap-3 px-4 py-4 bg-gradient-to-r from-slate-800/60 via-slate-700/40 to-transparent rounded-xl border border-slate-600/30 backdrop-blur-sm shadow-lg">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center shadow-lg ring-2 ring-slate-600/30">
                          <UserIcon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-100 truncate">
                            {getDisplayName(user)}
                          </p>
                          <p className="text-xs text-slate-400">
                            Signed in
                          </p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div onClick={closeMobileMenu} className="w-full">
                          <OnboardButton />
                        </div>
                        <div onClick={closeMobileMenu} className="w-full">
                          <DashboardButton />
                        </div>
                        <div onClick={closeMobileMenu} className="w-full">
                          <LogoutButton />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 animate-in slide-in-from-right duration-300" style={{ animationDelay: '200ms' }}>
                      <div className="p-4 bg-gradient-to-r from-slate-800/40 via-slate-700/20 to-slate-800/40 rounded-xl border border-slate-600/30 shadow-lg">
                        <p className="text-sm font-medium text-slate-200 mb-3">Join func(Kode)</p>
                        <div className="space-y-3">
                          <Button asChild variant="ghost" className="w-full justify-start hover:bg-slate-700/40 text-slate-300 hover:text-white border-slate-600/30" onClick={closeMobileMenu}>
                            <Link href="/auth/login" className="flex items-center gap-3">
                              <div className="w-6 h-6 rounded-md bg-slate-700/50 flex items-center justify-center">
                                <UserIcon className="w-3 h-3" />
                              </div>
                              Sign in
                            </Link>
                          </Button>
                          <Button asChild className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white hover:shadow-lg transition-all duration-200" onClick={closeMobileMenu}>
                            <Link href="/auth/sign-up">
                              Get Started
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}