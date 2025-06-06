import { Button } from "@/components/ui/button";
import { Bell, Settings, User } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full py-5 items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <h1 className="text-base font-medium">
          Credit Analyst Agent Dashboard
        </h1>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="secondary" size="sm" className="hidden sm:flex">
            <Settings width={20} height={20} />
          </Button>
          <Button variant="secondary" size="sm" className="hidden sm:flex">
            <Bell width={20} height={20} />
          </Button>
          <Button variant="secondary" size="sm" className="hidden sm:flex">
            <User />
          </Button>
        </div>
      </div>
    </header>
  );
}
