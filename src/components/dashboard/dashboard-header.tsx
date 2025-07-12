"use client";

import { logout } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Download, LogOut, Sparkles } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export function DashboardHeader() {
  const params = useParams();
  const router = useRouter();

  const [companyName, setCompanyName] = useState("Company");

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const navigateToCreditAnalystAI = () => {
    router.push(`/dashboard/${params.projectId}/chat/${params.projectId}`);
  };

  const handleViewAiAnalysis = () => {
    router.push(`/dashboard/${params.projectId}/pdf`);
  };

  return (
    <header className="flex items-center sticky top-0 z-50 justify-between border-gray-200 bg-[#182d7c] p-4 py-8">
      <div className="flex items-center gap-4">
        <Button
          className="bg-white hover:bg-gray-200"
          onClick={() => router.back()}
        >
          <ChevronLeft className="text-black" />
        </Button>
        <h1 className="font-sans text-4xl font-bold text-white">
          Analisis {companyName}
        </h1>
      </div>
      <div className="flex items-center gap-3">
        <Button
          variant="ring"
          className="bg-white text-black"
          onClick={navigateToCreditAnalystAI}
        >
          Credit Analyst AI Agent
        </Button>
        <Button
          size="icon"
          className="bg-white text-black hover:bg-gray-200"
          onClick={handleViewAiAnalysis}
        >
          <Download className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="bg-white text-black hover:bg-gray-200"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
