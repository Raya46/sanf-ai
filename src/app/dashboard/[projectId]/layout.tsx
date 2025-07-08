import { AppSidebar } from "@/components/app/app-sidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { projectId: string };
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
      <AppSidebar variant="inset" user={user} currentProjectId={params.projectId} />
      <SidebarInset>{children}</SidebarInset>
    </>
  );
}