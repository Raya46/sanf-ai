import { ChatSection } from "@/components/new-application/ui/chat-section";
import { AnalyticsSidebar } from "@/components/new-application/ui/analytics-sidebar";
import { CreditSidebar } from "@/components/new-application/ui/credit-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function CreditChat() {
  return (
    <div className="bg-gray-200 h-screen">
      <SidebarProvider>
        <div className="flex h-full">
          <CreditSidebar />
          <ChatSection />
          <AnalyticsSidebar />
        </div>
      </SidebarProvider>
    </div>
  );
}