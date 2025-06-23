"use client";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";

export function CreditSidebar() {
  return (
    <Sidebar
      collapsible="offcanvas"
      variant="floating"
      className="my-4 mr-4 ml-3 -top-2 h-[calc(100vh-1rem)]"
    >
      <SidebarHeader className="bg-white rounded-lg">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/">
                <span>SANF AI</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="bg-white rounded-lg">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-2 p-2">
              <Checkbox />
              <p>Select all resources</p>
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <div className="flex items-center gap-2 p-2">
              <Checkbox />
              <p>Rekening koran 3 bulan</p>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}