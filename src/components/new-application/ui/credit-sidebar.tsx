"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { File } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface ApplicationFile {
  id: string;
  file_name: string;
}

interface CreditSidebarProps {
  applicationId?: string;
}

export function CreditSidebar({ applicationId }: CreditSidebarProps) {
  const [files, setFiles] = useState<ApplicationFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!applicationId) return;

    const fetchFiles = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/applications/${applicationId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch application files");
        }
        const data = (await response.json()) as {
          application_files: ApplicationFile[];
        };
        setFiles(data.application_files || []);
      } catch (error) {
        console.error(error);
        setFiles([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFiles();
  }, [applicationId]);

  return (
    <Sidebar
      collapsible="offcanvas"
      variant="floating"
      className="my-4 mr-4 ml-3 -top-2 h-[calc(100vh-1rem)]"
    >
      <SidebarHeader className="bg-white rounded-lg">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/">
                <span>SANF AI</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="bg-white rounded-lg">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-2 p-2">
              <p className="font-semibold">Dokumen Terunggah</p>
            </div>
          </SidebarMenuItem>
          {isLoading ? (
            <>
              <SidebarMenuItem>
                <Skeleton className="h-6 w-full" />
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Skeleton className="h-6 w-full" />
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Skeleton className="h-6 w-full" />
              </SidebarMenuItem>
            </>
          ) : files.length > 0 ? (
            files.map((file) => (
              <SidebarMenuItem key={file.id}>
                <div className="flex items-center gap-2 p-2 w-full">
                  <File className="h-4 w-4 flex-shrink-0" />
                  <p className="truncate text-sm">{file.file_name}</p>
                </div>
              </SidebarMenuItem>
            ))
          ) : (
            <SidebarMenuItem>
              <div className="flex items-center gap-2 p-2">
                <p className="text-sm text-gray-500">
                  Tidak ada file ditemukan.
                </p>
              </div>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
