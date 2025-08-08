import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Open‑Source Projects – funcKode | Developer Portfolio & Showcases",
  description: "Browse open-source projects from the funcKode developer community. Discover developer portfolios, featured work, and software engineer projects.",
  alternates: { canonical: "/projects" },
  keywords: [
    "funcKode projects",
    "developer projects",
    "software engineer portfolio",
    "open source",
    "github",
  ],
}

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
