import { ChevronRight, Trash2 } from "lucide-react";
import { Card, CardDescription, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";

export function SectionCardHistory() {
  return (
    <div className="flex flex-col lg:flex-row gap-4">
      <Card>
        <div className="flex flex-row gap-3 items-center mx-4">
          <Badge variant="secondary">28 Mei 2025</Badge>
          <Badge variant="secondary">Disetujui</Badge>
        </div>
        <div className="flex flex-row justify-between items-center mx-4">
          <div className="flex flex-row items-center gap-4">
            <div className="rounded-full border-4 border-blue-600 p-4">
              <p className="text-blue-600 font-bold">92%</p>
            </div>
            <div className="flex flex-col">
              <CardTitle>PT Maju Bersama</CardTitle>
              <CardDescription>#PENGAJUAN-001</CardDescription>
            </div>
          </div>
          <div className="ml-4">
            <ChevronRight height={30} width={30} />
          </div>
        </div>
        <div className="mx-4">
          <Separator />
        </div>
        <div className="flex flex-row items-center justify-between mx-4">
          <div className="flex flex-col">
            <CardDescription>Indikator Resiko</CardDescription>
            <CardTitle>Sedang</CardTitle>
          </div>
          <Trash2 color="#fb2c36" height={25} width={25} />
        </div>
      </Card>
      <Card>
        <div className="flex flex-row gap-3 items-center mx-4">
          <Badge variant="secondary">28 Mei 2025</Badge>
          <Badge variant="secondary">Disetujui</Badge>
        </div>
        <div className="flex flex-row justify-between items-center mx-4">
          <div className="flex flex-row items-center gap-4">
            <div className="rounded-full border-4 border-blue-600 p-4">
              <p className="text-blue-600 font-bold">92%</p>
            </div>
            <div className="flex flex-col">
              <CardTitle>PT Maju Bersama</CardTitle>
              <CardDescription>#PENGAJUAN-001</CardDescription>
            </div>
          </div>
          <div className="ml-4">
            <ChevronRight height={30} width={30} />
          </div>
        </div>
        <div className="mx-4">
          <Separator />
        </div>
        <div className="flex flex-row items-center justify-between mx-4">
          <div className="flex flex-col">
            <CardDescription>Indikator Resiko</CardDescription>
            <CardTitle>Sedang</CardTitle>
          </div>
          <Trash2 color="#fb2c36" height={25} width={25} />
        </div>
      </Card>
      <Card>
        <div className="flex flex-row gap-3 items-center mx-4">
          <Badge variant="secondary">28 Mei 2025</Badge>
          <Badge variant="secondary">Disetujui</Badge>
        </div>
        <div className="flex flex-row justify-between items-center mx-4">
          <div className="flex flex-row items-center gap-4">
            <div className="rounded-full border-4 border-blue-600 p-4">
              <p className="text-blue-600 font-bold">92%</p>
            </div>
            <div className="flex flex-col">
              <CardTitle>PT Maju Bersama</CardTitle>
              <CardDescription>#PENGAJUAN-001</CardDescription>
            </div>
          </div>
          <div className="ml-4">
            <ChevronRight height={30} width={30} />
          </div>
        </div>
        <div className="mx-4">
          <Separator />
        </div>
        <div className="flex flex-row items-center justify-between mx-4">
          <div className="flex flex-col">
            <CardDescription>Indikator Resiko</CardDescription>
            <CardTitle>Sedang</CardTitle>
          </div>
          <Trash2 color="#fb2c36" height={25} width={25} />
        </div>
      </Card>
    </div>
  );
}
