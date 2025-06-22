"use client";

import { Check, Clock, File, Plus, TriangleAlert } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardDescription, CardTitle } from "../ui/card";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";

interface DashboardStats {
  totalProcessed: number;
  totalApproved: number;
  averageRiskScore: number;
}

export function SectionCardDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/applications/stats");
        if (!response.ok) {
          throw new Error("Failed to fetch dashboard stats");
        }
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="flex flex-col gap-4 pt-4 mx-4">
      <Button
        onClick={() => router.push("/new-application")}
        className="w-fit bg-blue-600"
      >
        <Plus />
        <span>New Application</span>
      </Button>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="flex flex-row items-center px-4 flex-1">
          <div className="rounded-full p-3 bg-[#E6F7FF]">
            <File width={20} height={20} color="#007BFF" />
          </div>
          <div className="flex flex-col">
            {isLoading ? (
              <Skeleton className="h-6 w-12" />
            ) : (
              <CardTitle>{stats?.totalProcessed ?? 0}</CardTitle>
            )}
            <CardDescription>Total Aplikasi Diproses</CardDescription>
          </div>
        </Card>
        <Card className="flex flex-row items-center px-4 flex-1">
          <div className="rounded-full p-3 bg-[#E8F5E9]">
            <Check width={20} height={20} color="#4CAF50" />
          </div>
          <div className="flex flex-col">
            {isLoading ? (
              <Skeleton className="h-6 w-12" />
            ) : (
              <CardTitle>{stats?.totalApproved ?? 0}</CardTitle>
            )}
            <CardDescription>Aplikasi Disetujui</CardDescription>
          </div>
        </Card>
        <Card className="flex flex-row items-center px-4 flex-1">
          <div className="rounded-full p-3 bg-[#FFF3E0]">
            <Clock width={20} height={20} color="#FF9800" />
          </div>
          <div className="flex flex-col">
            {isLoading ? (
              <Skeleton className="h-6 w-12" />
            ) : (
              <CardTitle>{stats?.averageRiskScore ?? 0}</CardTitle>
            )}
            <CardDescription>Rata-rata Skor Risiko</CardDescription>
          </div>
        </Card>
        <Card className="flex flex-row items-center px-4 flex-1">
          <div className="rounded-full p-3 bg-[#FFEBEE]">
            <TriangleAlert width={20} height={20} color="#F44336" />
          </div>
          <div className="flex flex-col">
            <CardTitle>3</CardTitle>
            <CardDescription>Akun Overdue</CardDescription>
          </div>
        </Card>
      </div>
    </div>
  );
}
