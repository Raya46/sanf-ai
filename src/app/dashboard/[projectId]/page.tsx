import { SiteHeader } from "@/components/app/app-header";
import { DashboardClient } from "@/components/app/dashboard-client";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  return (
    <>
      <SiteHeader />
      <DashboardClient />
    </>
  );
}