import { SiteHeader } from "@/components/app/app-header";
import { AppSidebar } from "@/components/app/app-sidebar";
import { SectionForm } from "@/components/new-application/section-form";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function NewApplicationPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" user={user} />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col">
            <h1 className="m-4 font-bold text-lg">New Credit Application</h1>
            <SectionForm />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
