"use client";
import { SectionForm } from "@/components/new-application/section-form";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NewApplicationPage() {
  const router = useRouter();

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col">
        <div className="flex items-center px-8 pt-8">
          <Button onClick={() => router.back()}>
            <ChevronLeft />
          </Button>
          <h1 className="m-4 font-bold text-lg">New Credit Application</h1>
        </div>
        <SectionForm />
      </div>
    </div>
  );
}
