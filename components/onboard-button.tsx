import Link from "next/link";
import { Button } from "@/components/ui/button";

export function OnboardButton() {
  return (
    <Button
      asChild
      size="sm"
      variant="default"
      className="bg-brand-blue text-white hover:bg-brand-purple transition flex items-center gap-2 shadow-md border-0 px-4 py-2 rounded-lg font-semibold"
      style={{ boxShadow: '0 2px 8px rgba(80, 36, 180, 0.12)' }}
    >
      <Link href="/onboard" className="flex items-center gap-2">
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="inline-block">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
        </svg>
        Onboard
      </Link>
    </Button>
  );
}
