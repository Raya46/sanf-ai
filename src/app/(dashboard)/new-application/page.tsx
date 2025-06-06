import { SiteHeader } from "@/components/app/app-header";
import { AppSidebar } from "@/components/app/app-sidebar";
import { SectionForm } from "@/components/new-application/section-form";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function NewApplicationPage() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col">
            <h1 className="m-4">New Credit Application</h1>
            <SectionForm />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
