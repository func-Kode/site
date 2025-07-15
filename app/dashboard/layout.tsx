import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/auth/login");
  }

  // Fetch user profile
  const { data: userProfile } = await supabase
    .from("users")
    .select("onboarding_complete")
    .eq("id", session.user.id)
    .single();

  if (!userProfile?.onboarding_complete) {
    redirect("/onboard");
  }

  return <>{children}</>;
}
