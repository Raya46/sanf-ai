"use client";

import { useState } from "react";
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

const creditAnalyses = [
  {
    id: 1,
    title: "Heavy Equipment Lease Analysis - CAT 320D",
    segment: "heavy-equipment",
    icon: Building2,
    date: "Dec 15, 2024",
    riskScore: 720,
    status: "approved",
    amount: "Rp 6.750.000.000",
    applicant: "Mountain Construction LLC",
  },
  {
    id: 2,
    title: "Fleet Financing Assessment - 15 Truck Portfolio",
    segment: "trucking",
    icon: Truck,
    date: "Dec 12, 2024",
    riskScore: 680,
    status: "under-review",
    amount: "Rp 31.500.000.000",
    applicant: "TransLogistics Corp",
  },
  {
    id: 3,
    title: "Manufacturing Equipment Credit Line",
    segment: "productive-financing",
    icon: DollarSign,
    date: "Dec 10, 2024",
    riskScore: 750,
    status: "approved",
    amount: "Rp 12.750.000.000",
    applicant: "Precision Manufacturing Inc",
  },
  {
    id: 4,
    title: "Startup Equipment Financing - Tech Company",
    segment: "new-business",
    icon: Briefcase,
    date: "Dec 8, 2024",
    riskScore: 620,
    status: "pending",
    amount: "Rp 1.875.000.000",
    applicant: "InnovateTech Solutions",
  },
  {
    id: 5,
    title: "Excavator Purchase Analysis - JCB 220X",
    segment: "heavy-equipment",
    icon: Building2,
    date: "Dec 5, 2024",
    riskScore: 695,
    status: "approved",
    amount: "Rp 4.800.000.000",
    applicant: "Earthworks Contractors",
  },
  {
    id: 6,
    title: "Long-Haul Trucking Fleet Expansion",
    segment: "trucking",
    icon: Truck,
    date: "Dec 3, 2024",
    riskScore: 710,
    status: "under-review",
    amount: "Rp 27.000.000.000",
    applicant: "Highway Express LLC",
  },
  {
    id: 7,
    title: "Production Line Equipment Financing",
    segment: "productive-financing",
    icon: DollarSign,
    date: "Nov 28, 2024",
    riskScore: 665,
    status: "declined",
    amount: "Rp 10.125.000.000",
    applicant: "AutoParts Manufacturing",
  },
  {
    id: 8,
    title: "New Restaurant Equipment Package",
    segment: "new-business",
    icon: Briefcase,
    date: "Nov 25, 2024",
    riskScore: 640,
    status: "approved",
    amount: "Rp 1.425.000.000",
    applicant: "Gourmet Bistro Group",
  },
];

const segmentLabels = {
  all: "All Segments",
  "heavy-equipment": "Heavy Equipment",
  trucking: "Trucking",
  "productive-financing": "Productive Financing",
  "new-business": "New Business",
};

const statusColors = {
  approved: "bg-green-100 text-green-700 border-green-200",
  "under-review": "bg-amber-100 text-amber-700 border-amber-200",
  pending: "bg-blue-100 text-blue-700 border-blue-200",
  declined: "bg-red-100 text-red-700 border-red-200",
};

const statusIcons = {
  approved: CheckCircle,
  "under-review": Clock,
  pending: AlertTriangle,
  declined: AlertTriangle,
};

export default function Component() {
  const [selectedSegment, setSelectedSegment] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("most-recent");
  const router = useRouter();

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
              Credit Analysis Dashboard
            </h1>
            <p className="text-slate-600">
              Manage and review credit applications across all business segments
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
            New Analysis
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
                  All
                </TabsTrigger>
                <TabsTrigger
                  value="heavy-equipment"
                  className="data-[state=active]:bg-white data-[state=active]:text-slate-900"
                >
                  Heavy Equipment
                </TabsTrigger>
                <TabsTrigger
                  value="trucking"
                  className="data-[state=active]:bg-white data-[state=active]:text-slate-900"
                >
                  Trucking
                </TabsTrigger>
                <TabsTrigger
                  value="productive-financing"
                  className="data-[state=active]:bg-white data-[state=active]:text-slate-900"
                >
                  Productive
                </TabsTrigger>
                <TabsTrigger
                  value="new-business"
                  className="data-[state=active]:bg-white data-[state=active]:text-slate-900"
                >
                  New Business
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
                  <SelectItem value="most-recent">Most Recent</SelectItem>
                  <SelectItem value="risk-score">Risk Score</SelectItem>
                  <SelectItem value="amount">Amount</SelectItem>
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
              statusIcons[analysis.status as keyof typeof statusIcons];

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
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit Analysis</DropdownMenuItem>
                          <DropdownMenuItem>Export Report</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            Delete
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
                        <span className="text-xs text-slate-500">Amount</span>
                        <span className="text-sm font-medium text-slate-900">
                          {analysis.amount}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-500">
                          Risk Score
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
                          {analysis.status.replace("-", " ")}
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
              <p>No credit analyses found for the selected segment.</p>
            </div>
            <Button className="bg-slate-900 hover:bg-slate-800 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Create New Analysis
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
