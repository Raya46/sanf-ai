"use client";

import { Button } from "@/components/ui/button";
import { Sparkles, Download, User, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { logout } from "@/app/auth/actions";

export function DashboardHeader() {
  const router = useRouter();
  const placeholderApplicationId = "a9fcc6e8-64c7-4968-b9ce-f8f26ae14d64";
  const placeholderProjectId = "1"; // Assuming a placeholder project ID

  const handleLogout = async () => {
    await logout();
  };

  const navigateToCreditAnalystAI = () => {
    router.push(`/dashboard/${placeholderProjectId}/new-application/${placeholderApplicationId}`);
  };

  return (
    <header className="flex items-center justify-end p-4 bg-white border-b border-gray-200">
      <div className="flex items-center gap-3">
        <Button className="bg-blue-500 hover:bg-blue-600 text-white">
          <Sparkles className="w-4 h-4 mr-2" />
          View AI Analysis
        </Button>
        <Button
          size="sm"
          className="bg-purple-500 hover:bg-purple-600 text-white"
          onClick={navigateToCreditAnalystAI}
        >
          Credit Analyst AI Agent
        </Button>
        <Button
          size="icon"
          className="bg-green-500 hover:bg-green-600 text-white"
        >
          <Download className="w-4 h-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="text-gray-600 hover:text-gray-900"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
}
