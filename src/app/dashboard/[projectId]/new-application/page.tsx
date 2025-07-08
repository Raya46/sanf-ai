import { SiteHeader } from "@/components/app/app-header";
import { AppSidebar } from "@/components/app/app-sidebar";
import { SectionForm } from "@/components/new-application/section-form";
import { SidebarInset } from "@/components/ui/sidebar";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function NewApplicationPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  return (
    <SidebarInset>
      <AppSidebar variant="inset" user={user} />
      <SiteHeader />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col">
          <h1 className="m-4 font-bold text-lg">New Credit Application</h1>
          <SectionForm projectId={projectId} />
        </div>
      </div>
    </SidebarInset>
  );
}
