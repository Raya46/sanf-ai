"use client";

import { ChevronRight, Trash2 } from "lucide-react";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";

type Application = {
  id: string;
  submitted_at: string;
  status: string;
  probability_approval: number;
  overall_indicator: string;
  company_name: string;
};

const statusColors: { [key: string]: string } = {
  submitted: "bg-blue-100 text-blue-600",
  completed: "bg-green-100 text-green-600",
  sedang: "bg-[#FF9800]/20 text-[#FF9800]",
};

const indicatorColors: { [key: string]: string } = {
  rendah: "text-blue-600",
  sedang: "text-[#FF9800]",
  tinggi: "text-green-600",
};

export function SectionCardHistory() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch("/api/applications");
        if (!response.ok) {
          throw new Error("Failed to fetch applications");
        }
        const data = await response.json();
        // Ensure data is an array of Application
        setApplications(Array.isArray(data) ? (data as Application[]) : []);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const handleDelete = async () => {
    if (!selectedAppId) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/applications/${selectedAppId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete application");
      }

      setApplications(
        (prev) => prev?.filter((app) => app.id !== selectedAppId) ?? null
      );
    } catch (error) {
      console.error(error);
      // Optionally show an error message to the user
    } finally {
      setIsDeleting(false);
      setSelectedAppId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <Skeleton className="h-4 w-1/4 m-4" />
          <div className="flex flex-row justify-between items-center m-4">
            <div className="flex flex-row items-center gap-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </div>
          <div className="m-4">
            <Separator />
          </div>
          <div className="flex flex-row items-center justify-between m-4">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <Dialog
      open={!!selectedAppId}
      onOpenChange={(open) => !open && setSelectedAppId(null)}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {applications && applications.length > 0 ? (
          applications.map((app) => (
            <div className="shadow-lg rounded-lg" key={app.id}>
              <div className="flex flex-row gap-3 items-center m-4">
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-600 font-bold"
                >
                  {new Date(app.submitted_at).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </Badge>
                <Badge
                  variant="secondary"
                  className={`${
                    statusColors[app.status?.toLowerCase() ?? ""] ||
                    "bg-gray-100 text-gray-800"
                  } font-bold`}
                >
                  {app.status || "N/A"}
                </Badge>
              </div>
              <div className="flex flex-row justify-between items-center m-4">
                <div className="flex flex-row items-center gap-4">
                  <div className="rounded-full border-4 border-blue-600 p-4 px-5">
                    <p className="text-blue-600 font-bold">
                      {app.probability_approval}%
                    </p>
                  </div>
                  <div className="flex flex-col">
                    <CardTitle>{app.company_name}</CardTitle>
                    <CardDescription>
                      #PENGAJUAN-{app.id.slice(-6)}
                    </CardDescription>
                  </div>
                </div>
                <div className="ml-4">
                  <ChevronRight
                    height={30}
                    width={30}
                    className="cursor-pointer"
                    onClick={() => router.push(`/new-application/${app.id}`)}
                  />
                </div>
              </div>
              <div className="m-4">
                <Separator />
              </div>
              <div className="flex flex-row items-center justify-between m-4">
                <div className="flex flex-col">
                  <CardDescription>Indikator Resiko</CardDescription>
                  <CardTitle
                    className={
                      indicatorColors[
                        app.overall_indicator?.toLowerCase() ?? ""
                      ] || ""
                    }
                  >
                    {app.overall_indicator || "N/A"}
                  </CardTitle>
                </div>
                <DialogTrigger asChild>
                  <Trash2
                    color="#fb2c36"
                    height={25}
                    width={25}
                    className="cursor-pointer"
                    onClick={() => setSelectedAppId(app.id)}
                  />
                </DialogTrigger>
              </div>
            </div>
          ))
        ) : (
          <p>No applications found.</p>
        )}
      </div>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the
            application.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setSelectedAppId(null)}
            disabled={isDeleting}
          >
            No
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Yes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
