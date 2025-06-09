import { Check, Clock, File, Plus, TriangleAlert } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardDescription, CardTitle } from "../ui/card";

export function SectionCardDashboard() {
  return (
    <div className="flex flex-col gap-4 pt-4 mx-4">
      <Button className="w-fit bg-blue-600">
        <Plus />
        <span>New Application</span>
      </Button>
      <div className="flex flex-col lg:flex-row gap-4">
        <Card className="flex flex-row items-center px-4">
          <div className="rounded-full p-3 bg-[#E6F7FF]">
            <File width={20} height={20} color="#007BFF" />
          </div>
          <div className="flex flex-col">
            <CardTitle>150</CardTitle>
            <CardDescription>Total Aplikasi Diproses</CardDescription>
          </div>
        </Card>
        <Card className="flex flex-row items-center px-4">
          <div className="rounded-full p-3 bg-[#E8F5E9]">
            <Check width={20} height={20} color="#4CAF50" />
          </div>
          <div className="flex flex-col">
            <CardTitle>100</CardTitle>
            <CardDescription>Aplikasi Disetujui</CardDescription>
          </div>
        </Card>
        <Card className="flex flex-row items-center px-4">
          <div className="rounded-full p-3 bg-[#FFF3E0]">
            <Clock width={20} height={20} color="#FF9800" />
          </div>
          <div className="flex flex-col">
            <CardTitle>5.2</CardTitle>
            <CardDescription>Rata-rata Skor Risiko</CardDescription>
          </div>
        </Card>
        <Card className="flex flex-row items-center px-4">
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
