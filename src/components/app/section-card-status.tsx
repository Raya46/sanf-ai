import { Edit, File, Moon, TriangleAlert } from "lucide-react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Progress } from "../ui/progress";
import { Separator } from "../ui/separator";

export function SectionCardStatus() {
  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Status Alur Kerja Saat ini</CardTitle>
          <CardDescription className="text-[#007BFF]">
            Lihat Semua
          </CardDescription>
        </CardHeader>
        <div className="mx-4">
          <Separator />
        </div>
        <CardTitle className="text-center">25</CardTitle>
        <div className="mx-4">
          <Progress />
        </div>
        <CardFooter className="flex flex-row gap-4">
          <div className="flex flex-col items-center p-4 border border-gray-300 rounded-lg">
            <File width={20} height={20} color="#007BFF" />
            <CardTitle className="font-bold text-lg">10</CardTitle>
            <CardDescription className="text-xs text-center">
              Pengajuan Baru
            </CardDescription>
          </div>
          <div className="flex flex-col items-center p-4 border border-gray-300 rounded-lg">
            <Edit width={20} height={20} color="#007BFF" />
            <CardTitle className="font-bold text-lg">10</CardTitle>
            <CardDescription className="text-xs text-center">
              Menunggu Tinjauan Manual
            </CardDescription>
          </div>
          <div className="flex flex-col items-center p-4 border border-gray-300 rounded-lg">
            <Moon width={20} height={20} color="#007BFF" />
            <CardTitle className="font-bold text-lg">10</CardTitle>
            <CardDescription className="text-xs text-center">
              Keputusan Tertunda
            </CardDescription>
          </div>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Tugas & Item Tindakan</CardTitle>
          <CardDescription className="text-[#007BFF]">
            Lihat Semua
          </CardDescription>
        </CardHeader>
        <div className="mx-4">
          <Separator />
        </div>
        <div className="flex flex-row items-center mx-4 gap-3">
          <TriangleAlert height={20} width={20} color="#FF9800" />
          <div className="flex flex-col">
            <CardTitle>Tinjau Akun Overdue - PT XYZ</CardTitle>
            <CardDescription>
              Jatuh tempo: 05 Jun, 2025 Jatuh tempo hari ini
            </CardDescription>
          </div>
        </div>
        <div className="mx-4">
          <Separator />
        </div>
        <div className="flex flex-row items-center mx-4 gap-3">
          <TriangleAlert height={20} width={20} color="#FF9800" />
          <div className="flex flex-col">
            <CardTitle>Tinjau Akun Overdue - PT XYZ</CardTitle>
            <CardDescription>
              Jatuh tempo: 05 Jun, 2025 Jatuh tempo hari ini
            </CardDescription>
          </div>
        </div>
        <div className="mx-4">
          <Separator />
        </div>
        <div className="flex flex-row items-center mx-4 gap-3">
          <TriangleAlert height={20} width={20} color="#FF9800" />
          <div className="flex flex-col">
            <CardTitle>Tinjau Akun Overdue - PT XYZ</CardTitle>
            <CardDescription>
              Jatuh tempo: 05 Jun, 2025 Jatuh tempo hari ini
            </CardDescription>
          </div>
        </div>
      </Card>
    </div>
  );
}
