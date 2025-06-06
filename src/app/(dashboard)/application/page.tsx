import { SiteHeader } from "@/components/app/app-header";
import { AppSidebar } from "@/components/app/app-sidebar";
import { SectionCardHistory } from "@/components/application/section-card-history";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function NewApplicationPage() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col mx-4">
            <h1 className="text-2xl font-bold my-4">Riwayat Aplikasi</h1>
            <SectionCardHistory />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
