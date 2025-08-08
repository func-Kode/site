import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "About funcKode – GitHub-first Developer Community | VVS Basanth Pedapati",
  description: "Learn about funcKode, a GitHub-first developer community led by VVS Basanth Pedapati. Join developers building portfolios, resumes, and open-source projects.",
  alternates: { canonical: "/about" },
  keywords: [
    "funcKode",
    "about",
    "github",
    "developer community",
    "software engineer",
    "developer resume",
    "portfolio",
  ],
}

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
