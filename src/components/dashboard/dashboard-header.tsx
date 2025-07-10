"use client";

import { Button } from "@/components/ui/button";
import { Sparkles, Download, User, LogOut, ChevronLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { logout } from "@/app/auth/actions";

export function DashboardHeader() {
  const params = useParams();
  const router = useRouter();
  const placeholderApplicationId = "a9fcc6e8-64c7-4968-b9ce-f8f26ae14d64";
  const placeholderProjectId = "1"; // Assuming a placeholder project ID

  const handleLogout = async () => {
    await logout();
  };

  const navigateToCreditAnalystAI = () => {
    router.push(`/dashboard/${placeholderProjectId}/chat/${params.projectId}`);
  };

  return (
    <header className="flex justify-between items-center p-4 py-8 bg-[#182d7c] border-gray-200">
      <div className="flex items-center gap-4">
        <Button
          className="bg-white hover:bg-sanf-secondary"
          onClick={() => router.push("/")}
        >
          <ChevronLeft className="text-black" />
        </Button>
        <h1 className="text-4xl font-sans font-bold text-white">
          Financial Analysis Company
        </h1>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="ring" className="bg-white text-black">
          <Sparkles className="w-4 h-4 mr-2" />
          View AI Analysis
        </Button>
        <Button
          variant="ring"
          className="bg-white text-black"
          onClick={navigateToCreditAnalystAI}
        >
          Credit Analyst AI Agent
        </Button>
        <Button
          size="icon"
          className="bg-white hover:bg-sanf-secondary text-black"
        >
          <Download className="w-4 h-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="bg-white hover:bg-sanf-secondary hover:text-black  "
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
}
