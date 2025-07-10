"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface StepCompanyDataProps {
  companyName: string;
  setCompanyName: (name: string) => void;
  companyAddress: string;
  setCompanyAddress: (address: string) => void;
  companyPhone: string;
  setCompanyPhone: (phone: string) => void;
  yearEstablished: number | "";
  setYearEstablished: (year: number | "") => void;
  npwp: string;
  setNpwp: (npwp: string) => void;
  companyEmail: string;
  setCompanyEmail: (email: string) => void;
  businessField: string;
  setBusinessField: (field: string) => void;
  numEmployees: number | "";
  setNumEmployees: (num: number | "") => void;
  handlePreviousStep: () => void;
  handleNextStep: () => void;
  businessFields: { value: string; label: string }[];
}

export function StepCompanyData({
  companyName,
  setCompanyName,
  companyAddress,
  setCompanyAddress,
  companyPhone,
  setCompanyPhone,
  yearEstablished,
  setYearEstablished,
  npwp,
  setNpwp,
  companyEmail,
  setCompanyEmail,
  businessField,
  setBusinessField,
  numEmployees,
  setNumEmployees,
  handlePreviousStep,
  handleNextStep,
  businessFields,
}: StepCompanyDataProps) {
  return (
    <div className="flex flex-col gap-4 w-full flex-1">
      <h1 className="text-2xl font-bold">Step 2: Data Perusahaan</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Column 1 */}
        <div className="flex flex-col gap-4">
          <div>
            <Label htmlFor="companyName">Nama Perusahaan</Label>
            <Input
              id="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Masukkan nama perusahaan"
            />
          </div>
          <div>
            <Label htmlFor="companyAddress">Alamat</Label>
            <Input
              id="companyAddress"
              value={companyAddress}
              onChange={(e) => setCompanyAddress(e.target.value)}
              placeholder="Masukkan alamat perusahaan"
            />
          </div>
          <div>
            <Label htmlFor="companyPhone">Telepon</Label>
            <Input
              id="companyPhone"
              type="tel"
              value={companyPhone}
              onChange={(e) => setCompanyPhone(e.target.value)}
              placeholder="Masukkan nomor telepon"
            />
          </div>
          <div>
            <Label htmlFor="yearEstablished">Tahun Berdiri</Label>
            <Input
              id="yearEstablished"
              type="number"
              value={yearEstablished}
              onChange={(e) =>
                setYearEstablished(parseInt(e.target.value) || "")
              }
              placeholder="Masukkan tahun berdiri"
            />
          </div>
        </div>

        {/* Column 2 */}
        <div className="flex flex-col gap-4">
          <div>
            <Label htmlFor="npwp">NPWP</Label>
            <Input
              id="npwp"
              value={npwp}
              onChange={(e) => setNpwp(e.target.value)}
              placeholder="Masukkan NPWP"
            />
          </div>
          <div>
            <Label htmlFor="companyEmail">Email</Label>
            <Input
              id="companyEmail"
              type="email"
              value={companyEmail}
              onChange={(e) => setCompanyEmail(e.target.value)}
              placeholder="Masukkan email perusahaan"
            />
          </div>
          <div>
            <Label htmlFor="businessField">Bidang Usaha</Label>
            <Select onValueChange={setBusinessField} value={businessField}>
              <SelectTrigger
                className="w-full"
                aria-label="Select business field"
              >
                <SelectValue placeholder="Pilih Bidang Usaha" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {businessFields.map((field) => (
                  <SelectItem
                    key={field.value}
                    value={field.value}
                    className="rounded-lg"
                  >
                    {field.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="numEmployees">Jumlah Karyawan</Label>
            <Input
              id="numEmployees"
              type="number"
              value={numEmployees}
              onChange={(e) => setNumEmployees(parseInt(e.target.value) || "")}
              placeholder="Masukkan jumlah karyawan"
            />
          </div>
        </div>
      </div>
      <div className="flex justify-between mt-4">
        <Button variant="outline" onClick={handlePreviousStep}>
          Previous
        </Button>
        <Button onClick={handleNextStep}>Next</Button>
      </div>
    </div>
  );
}
