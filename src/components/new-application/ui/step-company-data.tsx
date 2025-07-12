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
import { StepCompanyDataProps } from "@/type/step-type";

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
  businessField,
  setBusinessField,
  amountSubmissions,
  setamountSubmission,
  contactEmail,
  setContactEmail,
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
            <Label htmlFor="contactEmail">Email Kontak</Label>
            <Input
              id="contactEmail"
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="Masukkan email kontak"
            />
          </div>
          <div>
            <Label htmlFor="amountSubmissions">nominal pengajuan</Label>
            <Input
              id="amountSubmissions"
              type="number"
              value={amountSubmissions}
              onChange={(e) => setamountSubmission(parseInt(e.target.value))}
              placeholder="Masukkan nominal pengajuan"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
