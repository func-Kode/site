import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "funcKode | A developers' community",
  description: "funcKode is a open source community.",
};

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
            <head>
                <title>funcKode | A developers&apos; community</title>
                <meta name="description" content="funcKode is a modern web development platform for building scalable, fast, and secure web applications." />
                <meta name="keywords" content="funcKode, web development, next.js, supabase, react, tailwind, modern, scalable, secure" />
                <meta name="author" content="funcKode Team" />
                <meta property="og:title" content="funcKode | Modern Web Development Platform" />
                <meta property="og:description" content="Build scalable, fast, and secure web applications with funcKode." />
                <meta property="og:image" content="/opengraph-image.png" />
                <meta property="og:url" content="https://func-kode.netlify.app" />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="funcKode | A developers' community" />
                <meta name="twitter:description" content="Build scalable, fast, and secure web applications with funcKode." />
                <meta name="twitter:image" content="/twitter-image.png" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/raccoon.png" />
            </head>
          <Navbar />
          {children}
        </body>
      </html>
  );
}
