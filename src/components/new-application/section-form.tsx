"use client";
import { Download, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { CardDescription } from "../ui/card";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ListItem } from "./ui/list-item";

export function SectionForm() {
  return (
    <div className="flex flex-row gap-8 mt-4 mx-4 flex-1">
      <div className="flex flex-col gap-2 w-full flex-1">
        <p>Company Name</p>
        <Input />
        <p>Application Type</p>
        <Select>
          <SelectTrigger
            className="flex w-full **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
            size="sm"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
        <p>Contact Person</p>
        <Input />
        <p>Contact Email</p>
        <Input />
      </div>
      <div className="flex flex-col gap-4 mt-4 w-full flex-1">
        <h1>Upload Supporting Document</h1>
        <div className="flex flex-col py-[5rem] items-center justify-center border border-dashed border-blue-400 rounded-lg p-4 bg-[#FBFDFF]">
          <Download color="#007BFF" size={40} className="mb-4" />
          <div className="flex gap-1">
            <p>Drag & drop files here or</p>
            <p className="text-blue-500 font-bold">Browse</p>
          </div>
          <CardDescription className="mt-2">
            Supports PDF, Excel, JPG, PNG
          </CardDescription>
        </div>
        <div className="flex flex-row gap-4 items-center justify-between">
          <div className="flex flex-col">
            <ListItem title="Rekening Koran 3 bulan (Bank statements for 3 months)" />
            <ListItem title="LOI/MOU/PO kerjasama dengan bohir (LOI/MOU/PO of cooperation with partner)" />
            <ListItem title="Rekapan sales 3 bulan (Sales recap for 3 months)" />
          </div>
          <div className="flex flex-col">
            <ListItem title="Laporan keuangan 2 tahun (Financial statements for 2 years)" />
            <ListItem title="Copy invoice penagihan 3 bulan (Copy of collection invoices for 3 months)" />
            <ListItem title="Collateral (Optional)" />
          </div>
        </div>
        <Button className="bg-blue-600 flex flex-row items-center self-end">
          <Plus />
          <Link href="/new-application/1">Submit Application</Link>
        </Button>
      </div>
    </div>
  );
}
