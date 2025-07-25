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
import { Menu, X, Code, Users, Home, User as UserIcon } from "lucide-react";

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
                  {user.email}
                </span>
              </div>
              <OnboardButton />
              <DashboardButton />
              <LogoutButton />
            </div>
          ) : (
            <div className="flex gap-2">
              <Button asChild size="sm" variant="ghost">
                <Link href="/auth/login">Sign in</Link>
              </Button>
              <Button asChild size="sm" variant="default">
                <Link href="/auth/sign-up">Sign up</Link>
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
            className="fixed inset-0 bg-black/20 backdrop-blur-sm" 
            onClick={closeMobileMenu} 
          />
          <div className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-background border-l border-border shadow-2xl transform transition-transform duration-300 ease-out">
            <div className="flex flex-col h-full">
              {/* Mobile Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <span className="text-lg font-bold bg-gradient-to-r from-brand-blue to-primary bg-clip-text text-transparent">
                  func(Kode)
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={closeMobileMenu}
                  className="h-8 w-8"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Navigation Links */}
              <div className="flex-1 overflow-y-auto py-4">
                <div className="space-y-1 px-4">
                  {navigationLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={closeMobileMenu}
                      className="flex items-center gap-3 px-4 py-3 text-base font-medium text-foreground hover:bg-muted/50 rounded-xl transition-all duration-200 active:scale-95"
                    >
                      <link.icon className="w-5 h-5 text-muted-foreground" />
                      {link.label}
                    </Link>
                  ))}
                </div>

                {/* User Section */}
                <div className="mt-6 px-4">
                  {user ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 px-4 py-3 bg-muted/30 rounded-xl">
                        <div className="w-8 h-8 bg-gradient-to-br from-brand-blue to-primary rounded-full flex items-center justify-center">
                          <UserIcon className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {user.email}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Signed in
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
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
                    <div className="space-y-3">
                      <Button asChild variant="ghost" className="w-full justify-start" onClick={closeMobileMenu}>
                        <Link href="/auth/login" className="flex items-center gap-2">
                          <UserIcon className="w-4 h-4" />
                          Sign in
                        </Link>
                      </Button>
                      <Button asChild className="w-full" onClick={closeMobileMenu}>
                        <Link href="/auth/sign-up">
                          Get Started
                        </Link>
                      </Button>
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