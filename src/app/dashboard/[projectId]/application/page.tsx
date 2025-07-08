import { SiteHeader } from "@/components/app/app-header";
import { SectionCardHistory } from "@/components/application/section-card-history";
import { SidebarInset } from "@/components/ui/sidebar";
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
    // <SidebarProvider>
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col mx-4">
            <h1 className="text-2xl font-bold my-4">Riwayat Aplikasi</h1>
            <SectionCardHistory />
          </div>
        </div>
      </SidebarInset>
  );
}
