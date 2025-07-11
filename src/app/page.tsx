"use client";

import { useEffect, useState } from "react";
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

interface Application {
  id: number;
  title: string;
  segment: string;
  icon: LucideIcon;
  date: string;
  riskScore: number;
  status: string;
  amount: string;
  applicant: string;
}

interface CreditApplicationData {
  id: number;
  user_id: string;
  submitted_at: string;
  status: string;
  ai_analysis_status: string;
  probability_approval: number;
  overall_indicator: string;
  document_validation_percentage: number;
  estimated_analysis_time_minutes: number;
  contact_person: string;
  contact_email: string;
  company_name: string;
  ai_analysis: string;
  company_type: string;
  amount: number;
  analysis_template: string;
  risk_appetite: number;
}

const companyTypeIcons: { [key: string]: LucideIcon } = {
  "heavy-equipment": Building2,
  trucking: Truck,
  productive: DollarSign,
  "new-business": Briefcase,
  unknown: Briefcase, // Default icon for unknown company types
};

const segmentLabels = {
  all: "Semua Segmen",
  "heavy-equipment": "Alat Berat",
  trucking: "Truk",
  productive: "Pembiayaan Produktif",
  "new-business": "Bisnis Baru",
  unknown: "Segmen Tidak Diketahui",
};

const statusColors = {
  approved: "bg-green-100 text-green-700 border-green-200",
  "under-review": "bg-amber-100 text-amber-700 border-amber-200",
  pending: "bg-blue-100 text-blue-700 border-blue-200",
  declined: "bg-red-100 text-red-700 border-red-200",
  unknown: "bg-slate-100 text-slate-700 border-slate-200",
};

const statusIcons = {
  approved: CheckCircle,
  "under-review": Clock,
  pending: AlertTriangle,
  declined: AlertTriangle,
  unknown: AlertTriangle,
};

const statusTranslations: { [key: string]: string } = {
  approved: "Disetujui",
  "under-review": "Dalam Peninjauan",
  pending: "Tertunda",
  declined: "Ditolak",
  unknown: "Tidak Diketahui",
};

export default function Component() {
  const [selectedSegment, setSelectedSegment] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("most-recent");
  const [creditAnalyses, setCreditAnalyses] = useState<Application[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchApplications = async () => {
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
          const companyTypeRaw = app.company_type || "unknown";
          const companyTypeKey = companyTypeRaw
            .toLowerCase()
            .replace(/\s/g, "-"); // Normalize to "heavy-equipment", "trucking", etc.
          const IconComponent =
            companyTypeIcons[companyTypeKey] || companyTypeIcons["unknown"];
          const formattedAmount = app.amount
            ? `Rp ${new Intl.NumberFormat("id-ID").format(app.amount)}`
            : "Rp 0";
          const riskScore = app.probability_approval ?? 0;
          const status = app.ai_analysis_status || "unknown";
          const title = app.analysis_template || "Unknown Analysis";
          const applicant = app.company_name || "Unknown Applicant"; // Map to company_name
          const date = app.submitted_at
            ? new Date(app.submitted_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "Unknown Date";

          return {
            id: app.id,
            title: title,
            segment: companyTypeKey, // Use the normalized key for segment
            icon: IconComponent,
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
      }
    };

    fetchApplications();
  }, [router]);

  const filteredAnalyses = creditAnalyses.filter(
    (analysis) =>
      selectedSegment === "all" || analysis.segment === selectedSegment
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

  const getRiskScoreColor = (score: number) => {
    if (score >= 700) return "text-green-600";
    if (score >= 650) return "text-amber-600";
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
            onClick={() => router.push("/dashboard/new-application")}
            className="bg-slate-900 hover:bg-slate-800 text-white border-slate-300 w-fit"
          >
            <Plus className="w-4 h-4 mr-2" />
            Analisis Baru
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
                <TabsTrigger
                  value="heavy-equipment"
                  className="data-[state=active]:bg-white data-[state=active]:text-slate-900"
                >
                  Alat Berat
                </TabsTrigger>
                <TabsTrigger
                  value="trucking"
                  className="data-[state=active]:bg-white data-[state=active]:text-slate-900"
                >
                  Truk
                </TabsTrigger>
                <TabsTrigger
                  value="productive"
                  className="data-[state=active]:bg-white data-[state=active]:text-slate-900"
                >
                  Produktif
                </TabsTrigger>
                <TabsTrigger
                  value="new-business"
                  className="data-[state=active]:bg-white data-[state=active]:text-slate-900"
                >
                  Bisnis Baru
                </TabsTrigger>
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
                <SelectTrigger className="w-40 bg-blue-50/60 border border-blue-200/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-blue-50/95 backdrop-blur-md border border-blue-200/50">
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
          {sortedAnalyses.map((analysis) => {
            const IconComponent = analysis.icon;
            const StatusIcon =
              statusIcons[analysis.status as keyof typeof statusIcons] ||
              AlertTriangle; // Memberi fallback

            return (
              <Link
                key={analysis.id}
                href={`/dashboard/${analysis.id}`}
                className="block"
                tabIndex={-1}
              >
                <Card
                  className="bg-blue-50/60 backdrop-blur-md border hover:shadow-md hover:shadow-blue-300/30 hover:border-blue-300 border-blue-200/40 hover:bg-blue-50/80 transition-all duration-200 cursor-pointer group"
                  tabIndex={0}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100/60 backdrop-blur-sm rounded-lg border border-blue-200/30">
                          <IconComponent className="w-5 h-5 text-slate-700" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <Badge
                            variant="outline"
                            className="text-xs mb-2 border-blue-300/50 text-slate-700 bg-blue-50/40"
                          >
                            <IconComponent className="w-3 h-3 mr-1" />
                            {
                              segmentLabels[
                                analysis.segment as keyof typeof segmentLabels
                              ]
                            }
                          </Badge>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-slate-600 hover:text-slate-900"
                            tabIndex={-1}
                            onClick={(e) => e.preventDefault()}
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-blue-50/95 backdrop-blur-md border border-blue-200/50">
                          <DropdownMenuItem>Lihat Detail</DropdownMenuItem>
                          <DropdownMenuItem>Edit Analisis</DropdownMenuItem>
                          <DropdownMenuItem>Ekspor Laporan</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2">
                      {analysis.title}
                    </h3>
                    <p className="text-sm text-slate-600 mb-3">
                      {analysis.applicant}
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
                            className={`w-3 h-3 ${getRiskScoreColor(analysis.riskScore)}`}
                          />
                          <span
                            className={`text-sm font-medium ${getRiskScoreColor(analysis.riskScore)}`}
                          >
                            {analysis.riskScore}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-500">
                        {analysis.date}
                      </span>
                      <div className="flex items-center gap-1">
                        <Badge
                          className={`text-xs capitalize ${statusColors[analysis.status as keyof typeof statusColors]}`}
                        >
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusTranslations[analysis.status] ||
                            analysis.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {sortedAnalyses.length === 0 && (
          <div className="text-center py-12">
            <div className="text-slate-600 mb-4">
              <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>
                Tidak ada analisis kredit ditemukan untuk segmen yang dipilih.
              </p>
            </div>
            <Button className="bg-slate-900 hover:bg-slate-800 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Buat Analisis Baru
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
