"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Building2,
  Truck,
  DollarSign,
  Briefcase,
  Plus,
  Grid3X3,
  List,
  MoreHorizontal,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  LogOut,
  LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { logout } from "@/app/auth/actions";

// Interface untuk data yang akan ditampilkan di UI
interface Application {
  id: string; // ID seharusnya string untuk konsistensi
  title: string;
  segment: string;
  icon: LucideIcon;
  date: string;
  riskScore: number;
  status: string;
  amount: string;
  applicant: string;
}

// Interface untuk data mentah dari API
interface CreditApplicationData {
  id: string;
  submitted_at: string;
  status: string; // e.g., 'pending_analysis', 'completed'
  probability_approval: number;
  company_name: string;
  company_type: string;
  amount: number;
  analysis_template: string;
}

// PERBAIKAN: Menyesuaikan status dengan data dari backend
const statusColors: { [key: string]: string } = {
  completed: "bg-green-100 text-green-700 border-green-200",
  pending_analysis: "bg-amber-100 text-amber-700 border-amber-200",
  failed: "bg-red-100 text-red-700 border-red-200",
  unknown: "bg-slate-100 text-slate-700 border-slate-200",
};

const statusIcons: { [key: string]: LucideIcon } = {
  completed: CheckCircle,
  pending_analysis: Clock,
  failed: AlertTriangle,
  unknown: AlertTriangle,
};

const statusTranslations: { [key: string]: string } = {
  completed: "Selesai",
  pending_analysis: "Dalam Analisis",
  failed: "Gagal",
  unknown: "Tidak Diketahui",
};

export default function ApplicationDashboard() {
  const [selectedSegment, setSelectedSegment] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("most-recent");
  const [creditAnalyses, setCreditAnalyses] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const router = useRouter();

  useEffect(() => {
    const fetchApplications = async () => {
      setIsLoading(true); // Set loading to true before fetching
      try {
        const response = await fetch("/api/applications");
        if (!response.ok) {
          if (response.status === 401) {
            router.push("/login");
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: CreditApplicationData[] = await response.json();

        const formattedData: Application[] = data.map((app) => {
          const segment = app.company_type || "Segmen Tidak Ada";
          const formattedAmount = app.amount
            ? `Rp ${new Intl.NumberFormat("id-ID").format(app.amount)}`
            : "Rp 0";
          const riskScore = app.probability_approval ?? 0;
          const status = app.status || "unknown";
          const title = app.analysis_template || "Analisis Tidak Diketahui";
          const applicant = app.company_name || "Nama Pemohon Tidak Ada";
          const date = app.submitted_at
            ? new Date(app.submitted_at).toLocaleDateString("id-ID", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : "Tanggal Tidak Ada";

          return {
            id: app.id,
            title: title,
            segment: segment,
            icon: Briefcase, // Menggunakan ikon default yang aman
            date: date,
            riskScore: riskScore,
            status: status,
            amount: formattedAmount,
            applicant: applicant,
          };
        });
        setCreditAnalyses(formattedData);
      } catch (error) {
        console.error("Error fetching applications:", error);
      } finally {
        setIsLoading(false); // Set loading to false after fetching (success or error)
      }
    };

    fetchApplications();
  }, [router]);

  const filteredAnalyses = creditAnalyses.filter(
    (analysis) =>
      selectedSegment === "all" ||
      analysis.segment.toLowerCase().replace(/\s/g, "-") === selectedSegment
  );

  const sortedAnalyses = [...filteredAnalyses].sort((a, b) => {
    switch (sortBy) {
      case "most-recent":
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case "risk-score":
        return b.riskScore - a.riskScore;
      case "amount":
        return (
          Number.parseFloat(b.amount.replace(/Rp|\s|\./g, "")) -
          Number.parseFloat(a.amount.replace(/Rp|\s|\./g, ""))
        );
      default:
        return 0;
    }
  });

  // PERBAIKAN: Membuat daftar segmen dinamis dari data yang ada
  const dynamicSegments = useMemo(() => {
    const segments = new Set(creditAnalyses.map((a) => a.segment));
    return Array.from(segments).map((s) => ({
      value: s.toLowerCase().replace(/\s/g, "-"),
      label: s,
    }));
  }, [creditAnalyses]);

  const getRiskScoreColor = (score: number) => {
    if (score >= 70) return "text-green-600";
    if (score >= 50) return "text-amber-600";
    return "text-red-600";
  };

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 text-slate-900">
              Dasbor Analisis Kredit
            </h1>
            <p className="text-slate-600">
              Kelola dan tinjau aplikasi kredit di semua segmen bisnis
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Logout"
            onClick={handleLogout}
            className="ml-4"
          >
            <LogOut className="w-6 h-6" />
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          <Button
            variant="ring"
            onClick={() => router.push("/dashboard/new-application")}
            className="bg-slate-900 ring-slate-900 ring-offset-white hover:bg-slate-800 text-white w-fit"
          >
            <Plus className="w-4 h-4 mr-2" /> Analisis Baru
          </Button>
          <div className="flex flex-col sm:flex-row gap-4 lg:ml-auto">
            <Tabs
              value={selectedSegment}
              onValueChange={setSelectedSegment}
              className="w-full sm:w-auto"
            >
              <TabsList className="bg-blue-50/80 border border-blue-200/50">
                <TabsTrigger
                  value="all"
                  className="data-[state=active]:bg-white data-[state=active]:text-slate-900"
                >
                  Semua
                </TabsTrigger>
                {/* PERBAIKAN: Render tab segmen secara dinamis */}
                {dynamicSegments.map((seg) => (
                  <TabsTrigger
                    key={seg.value}
                    value={seg.value}
                    className="data-[state=active]:bg-white data-[state=active]:text-slate-900"
                  >
                    {seg.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            <div className="flex gap-2">
              <div className="flex bg-blue-50/80 border border-blue-200/50 rounded-md p-1">
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="h-8 w-8 p-0"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="h-8 w-8 p-0"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48 bg-blue-50/60 border border-blue-200/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="most-recent">Terbaru</SelectItem>
                  <SelectItem value="risk-score">
                    Probabilitas Persetujuan
                  </SelectItem>
                  <SelectItem value="amount">Nominal Pengajuan</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
          }
        >
          {isLoading
            ? // Render 8 skeleton cards when loading
              Array.from({ length: 8 }).map((_, index) => (
                <Card
                  key={index}
                  className="bg-blue-50/60 border border-blue-200/40 h-full"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Skeleton className="w-10 h-10 rounded-lg" />
                        <Skeleton className="w-24 h-6 rounded-md" />
                      </div>
                      <Skeleton className="w-8 h-8 rounded-full" />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-3" />
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between items-center">
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-4 w-1/4" />
                      </div>
                      <div className="flex justify-between items-center">
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-4 w-1/5" />
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-4 w-1/4" />
                      <Skeleton className="h-6 w-1/4" />
                    </div>
                  </CardContent>
                </Card>
              ))
            : // Render actual cards when not loading
              sortedAnalyses.map((analysis) => {
                const IconComponent = analysis.icon;
                const StatusIcon =
                  statusIcons[analysis.status] || AlertTriangle;

                return (
                  <Link
                    key={analysis.id}
                    href={`/dashboard/${analysis.id}`}
                    className="block group"
                  >
                    <Card className="bg-blue-50/60 border hover:shadow-lg hover:border-blue-300 border-blue-200/40 transition-all duration-300 cursor-pointer h-full">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100/60 rounded-lg border border-blue-200/30">
                              <IconComponent className="w-5 h-5 text-slate-700" />
                            </div>
                            {/* PERBAIKAN: Menampilkan label segmen secara langsung */}
                            <Badge
                              variant="outline"
                              className="text-xs border-blue-300/50 text-slate-700 bg-blue-50/40"
                            >
                              {analysis.segment}
                            </Badge>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-slate-600 hover:text-slate-900"
                                onClick={(e) => e.preventDefault()}
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem>Lihat Detail</DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                Hapus
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2">
                          {analysis.applicant}
                        </h3>
                        <p className="text-sm text-slate-600 mb-3">
                          {analysis.title}
                        </p>
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-slate-500">
                              Nominal Pengajuan
                            </span>
                            <span className="text-sm font-medium text-slate-900">
                              {analysis.amount}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-slate-500">
                              Probabilitas Persetujuan
                            </span>
                            <div className="flex items-center gap-1">
                              <TrendingUp
                                className={`w-3 h-3 ${getRiskScoreColor(
                                  analysis.riskScore
                                )}`}
                              />
                              <span
                                className={`text-sm font-medium ${getRiskScoreColor(
                                  analysis.riskScore
                                )}`}
                              >
                                {analysis.riskScore}%
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-slate-500">
                            {analysis.date}
                          </span>
                          <Badge
                            className={`text-xs capitalize ${
                              statusColors[analysis.status] ||
                              statusColors.unknown
                            }`}
                          >
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {statusTranslations[analysis.status] ||
                              analysis.status}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
        </div>

        {!isLoading && sortedAnalyses.length === 0 && (
          <div className="text-center py-12">
            <div className="text-slate-600 mb-4">
              <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>
                Tidak ada analisis kredit ditemukan untuk segmen yang dipilih.
              </p>
            </div>
            <Button
              onClick={() => router.push("/dashboard/new-application")}
              className="bg-slate-900 hover:bg-slate-800 text-white"
            >
              <Plus className="w-4 h-4 mr-2" /> Buat Analisis Baru
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
