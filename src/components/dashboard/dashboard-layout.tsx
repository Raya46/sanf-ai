import type { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex font-sans flex-col min-h-screen bg-gray-50">{children}</div>
  );
}
