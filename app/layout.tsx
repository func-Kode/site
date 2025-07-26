import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Providers } from "@/components/providers";
import { DebugConsoleProvider } from "@/components/debug-console-provider";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "funcKode | A developers' community",
  description: "funcKode is a modern web development platform for building scalable, fast, and secure web applications.",
  keywords: ["funcKode", "web development", "next.js", "supabase", "react", "tailwind", "modern", "scalable", "secure"],
  authors: [{ name: "funcKode Team" }],
  openGraph: {
    title: "funcKode | Modern Web Development Platform",
    description: "Build scalable, fast, and secure web applications with funcKode.",
    images: ["/opengraph-image.png"],
    url: "https://func-kode.netlify.app",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "funcKode | A developers' community",
    description: "Build scalable, fast, and secure web applications with funcKode.",
    images: ["/twitter-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/raccoon.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/favicon-32x32.png",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "icon",
        type: "image/svg+xml",
        url: "/icon.svg",
      },
    ],
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const isDebugEnabled = process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_ENABLE_DEBUG_CONSOLE === 'true';

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <DebugConsoleProvider enabled={isDebugEnabled}>
            <Navbar />
            {children}
          </DebugConsoleProvider>
        </Providers>
      </body>
    </html>
  );
}
