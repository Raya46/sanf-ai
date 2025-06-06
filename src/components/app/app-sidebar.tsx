"use client";
import { FilePlus, History, LogOut, PanelsTopLeft } from "lucide-react";
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

const sideBarItems = [
  {
    title: "Dashboard",
    url: "#",
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
  {
    title: "Logout",
    url: "#",
    icon: LogOut,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="bg-white">
        <SidebarMenu className="bg-white">
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href={"/"}>
                <span>SANF AI</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="bg-white">
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
    </Sidebar>
  );
}
