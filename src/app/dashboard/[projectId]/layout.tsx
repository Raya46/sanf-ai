import { AppSidebar } from "@/components/app/app-sidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  return (
    <>
      <AppSidebar variant="inset" user={user} />
      <SidebarInset>{children}</SidebarInset>
    </>
  );
}