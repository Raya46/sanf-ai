"use client";
import { LogOut, PanelsTopLeft, FilePlus, History } from "lucide-react";
import Link from "next/link";
import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
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

export function AppSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & { user: User | null }) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href={"/"}>
                <span>SANF AI</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {sideBarItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild tooltip={item.title}>
                <Link href={item.url}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarContent>
        <SidebarMenu>
          {user && (
            <SidebarMenuItem>
              <form action={logout} className="w-full">
                <SidebarMenuButton className="w-full justify-start" asChild>
                  <button className="w-full">
                    <LogOut />
                    <span>Logout</span>
                  </button>
                </SidebarMenuButton>
              </form>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
