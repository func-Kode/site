"use client";

import Link from "next/link";
import Image from "next/image";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: "Dashboard", href: "/dashboard" },
      { name: "Projects", href: "/projects" },
      { name: "Leaderboard", href: "/leaderboard" },
      { name: "Events", href: "/events" },
    ],
    resources: [
      { name: "Documentation", href: "/docs" },
      { name: "Learning Hub", href: "/learn" },
      { name: "Blog", href: "/blog" },
      { name: "About Us", href: "/about" },
    ],
    community: [
      { name: "GitHub", href: "https://github.com/func-Kode" },
      { name: "Discord", href: "#" },
      { name: "Twitter", href: "#" },
      { name: "LinkedIn", href: "#" },
    ],
    legal: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Code of Conduct", href: "/CODE_OF_CONDUCT.md" },
      { name: "Security", href: "/SECURITY.md" },
    ],
  };

  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto container-mobile py-8 md:py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Image 
                src="/raccoon.png" 
                alt="func(Kode) Logo" 
                width={32} 
                height={32} 
                className="w-8 h-8"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-brand-blue to-brand-green bg-clip-text text-transparent">
                func(Kode)
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4 max-w-md">
              Empowering developers worldwide through an inclusive community where code meets creativity. 
              Join us in building the future of open source collaboration.
            </p>
            <div className="flex items-center gap-4">
              <Link 
                href="https://github.com/func-Kode" 
                className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                aria-label="GitHub"
              >
                <span className="text-xl">🐙</span>
              </Link>
              <Link 
                href="#" 
                className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                aria-label="Discord"
              >
                <span className="text-xl">💬</span>
              </Link>
              <Link 
                href="#" 
                className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                aria-label="Twitter"
              >
                <span className="text-xl">🐦</span>
              </Link>
              <Link 
                href="#" 
                className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                aria-label="LinkedIn"
              >
                <span className="text-xl">💼</span>
              </Link>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Resources</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="border-t border-border pt-8 mb-8">
          <div className="max-w-md">
            <h3 className="font-semibold text-foreground mb-2">Stay Updated</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Get the latest updates about new features, events, and community highlights.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
              />
              <button className="px-4 py-2 bg-brand-blue text-white text-sm font-medium rounded-md hover:bg-brand-blue/90 transition-colors duration-200">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-muted-foreground">
              <span>© {currentYear} func(Kode). All rights reserved.</span>
              <span className="hidden md:block">•</span>
              <span>Made with ❤️ by VVS Basanth Pedapati</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-brand-green rounded-full animate-pulse"></span>
                All systems operational
              </span>
              <Link 
                href="/about" 
                className="hover:text-foreground transition-colors duration-200"
              >
                About
              </Link>
              <Link 
                href="/auth/login" 
                className="hover:text-foreground transition-colors duration-200"
              >
                Login
              </Link>
            </div>
          </div>
        </div>

        {/* Fun Developer Quote */}
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground italic">
            &quot;Code is like humor. When you have to explain it, it&#39;s bad.&quot; - Cory House
          </p>
        </div>
      </div>
    </footer>
  );
}
