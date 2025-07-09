"use client";

import { SidebarInset } from "@/components/ui/sidebar";
import React from "react";

export default function ApplicationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SidebarInset>{children}</SidebarInset>;
}
