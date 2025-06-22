"use client";
import { LogOut, PanelsTopLeft, FilePlus, History } from "lucide-react";
import Link from "next/link";
import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarRail,
} from "../ui/sidebar";
import { logout } from "@/app/auth/actions";
import { User } from "@supabase/supabase-js";

const sideBarItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: PanelsTopLeft,
  },
  {
    title: "New Application",
    url: "/new-application",
    icon: FilePlus,
  },
  {
    title: "Applications",
    url: "/application",
    icon: History,
  },
];

const accountItems = [
  {
    title: "Logout",
    url: "#",
    icon: LogOut,
  },
];

export function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar> & { user?: User }) {
  const [pathname, setPathname] = React.useState("");

  React.useEffect(() => {
    setPathname(window.location.pathname);
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="pb-2">
        <SidebarMenu className="pt-6">
          <SidebarMenuItem>
            <SidebarMenuButton
              className="flex justify-center items-center gap-2 pb-8 px-2"
              asChild
            >
              <Link href={"/"}>
                <div className="flex items-center">
                  <span className="text-lg font-bold">SANF AI</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {sideBarItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.url}
                  className="group hover:bg-blue-50 duration-200 focus:text-primary data-[active=true]:text-primary"
                >
                  <Link href={item.url}>
                    <div
                      className={`w-8 h-8 group ${
                        pathname === item.url
                          ? "bg-blue-600"
                          : "bg-blue-500 hover:bg-blue-600"
                      } justify-center items-center flex rounded-lg transition-colors duration-200`}
                    >
                      {item.icon && (
                        <item.icon className="h-5 w-5 text-white" />
                      )}
                    </div>
                    <span
                      className={`text-sm ${
                        pathname === item.url
                          ? "text-blue-600"
                          : "text-gray-700 hover:text-blue-600"
                      } font-medium`}
                    >
                      {item.title}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Account
          </SidebarGroupLabel>
          <SidebarMenu>
            {accountItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild={item.title !== "Logout"}
                  isActive={pathname === item.url}
                  className="hover:bg-red-50 duration-200 focus:text-red-600 data-[active=true]:text-red-600"
                >
                  {item.title === "Logout" ? (
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 p-2"
                    >
                      <div className="w-8 h-8 bg-red-500 hover:bg-red-600 justify-center items-center flex rounded-lg transition-colors duration-200">
                        {item.icon && (
                          <item.icon className="h-5 w-5 text-white" />
                        )}
                      </div>
                      <span className="text-sm text-gray-700 hover:text-red-600 font-medium">
                        {item.title}
                      </span>
                    </button>
                  ) : (
                    <Link href={item.url}>
                      <div
                        className={`w-8 h-8 ${
                          pathname === item.url
                            ? "bg-red-600"
                            : "bg-red-500 hover:bg-red-600"
                        } justify-center items-center flex rounded-lg transition-colors duration-200`}
                      >
                        {item.icon && (
                          <item.icon className="h-5 w-5 text-white" />
                        )}
                      </div>
                      <span
                        className={`text-sm ${
                          pathname === item.url
                            ? "text-red-600"
                            : "text-gray-700 hover:text-red-600"
                        } font-medium`}
                      >
                        {item.title}
                      </span>
                    </Link>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-border/50 pt-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <div className="text-xs text-gray-500 text-center">
                © 2025 SANF AI
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail className="bg-transparent" />
    </Sidebar>
  );
}
