import Link from "next/link";
import { Button } from "@/components/ui/button";

export function DashboardButton() {
  return (
    <Button
      asChild
      size="sm"
      variant="default"
      className="bg-brand-purple text-white hover:bg-brand-blue transition flex items-center gap-2 shadow-md border-0 px-4 py-2 rounded-lg font-semibold"
      style={{ boxShadow: '0 2px 8px rgba(80, 36, 180, 0.12)' }}
    >
      <Link href="/dashboard" className="flex items-center gap-2">
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="inline-block">
          <rect x="3" y="3" width="7" height="7" rx="2" />
          <rect x="14" y="3" width="7" height="7" rx="2" />
          <rect x="14" y="14" width="7" height="7" rx="2" />
          <rect x="3" y="14" width="7" height="7" rx="2" />
        </svg>
        Dashboard
      </Link>
    </Button>
  );
}
