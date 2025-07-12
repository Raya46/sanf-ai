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
    <div className="flex flex-col gap-6 w-full flex-1">
      <h1 className="text-2xl font-bold text-[#182d7c]">
        Step 2: Data Perusahaan
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Column 1 */}
        <div className="flex flex-col gap-4 bg-indigo-100/50 p-6 rounded-lg border border-indigo-200">
          <div>
            <Label htmlFor="companyName" className="text-[#182d7c]">
              Nama Perusahaan
            </Label>
            <Input
              id="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Masukkan nama perusahaan"
              className="mt-1 bg-white"
            />
          </div>
          <div>
            <Label htmlFor="companyAddress" className="text-[#182d7c]">
              Alamat
            </Label>
            <Input
              id="companyAddress"
              value={companyAddress}
              onChange={(e) => setCompanyAddress(e.target.value)}
              placeholder="Masukkan alamat perusahaan"
              className="mt-1 bg-white"
            />
          </div>
          <div>
            <Label htmlFor="companyPhone" className="text-[#182d7c]">
              Telepon
            </Label>
            <Input
              id="companyPhone"
              type="tel"
              value={companyPhone}
              onChange={(e) => setCompanyPhone(e.target.value)}
              placeholder="Masukkan nomor telepon"
              className="mt-1 bg-white"
            />
          </div>
          <div>
            <Label htmlFor="yearEstablished" className="text-[#182d7c]">
              Tahun Berdiri
            </Label>
            <Input
              id="yearEstablished"
              type="number"
              value={yearEstablished}
              onChange={(e) =>
                setYearEstablished(parseInt(e.target.value) || "")
              }
              placeholder="Masukkan tahun berdiri"
              className="mt-1 bg-white"
            />
          </div>
        </div>

        {/* Column 2 */}
        <div className="flex flex-col gap-4 bg-blue-100/50 p-6 rounded-lg border border-blue-200">
          <div>
            <Label htmlFor="npwp" className="text-[#182d7c]">
              NPWP
            </Label>
            <Input
              id="npwp"
              value={npwp}
              onChange={(e) => setNpwp(e.target.value)}
              placeholder="Masukkan NPWP"
              className="mt-1 bg-white"
            />
          </div>
          <div>
            <Label htmlFor="businessField" className="text-[#182d7c]">
              Bidang Usaha
            </Label>
            <Select onValueChange={setBusinessField} value={businessField}>
              <SelectTrigger
                className="mt-1 w-full bg-white"
                aria-label="Select business field"
              >
                <SelectValue placeholder="Pilih Bidang Usaha" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {businessFields.map((field) => (
                  <SelectItem
                    key={field.value}
                    value={field.value}
                    className="hover:bg-blue-50"
                  >
                    {field.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="contactEmail" className="text-[#182d7c]">
              Email Kontak
            </Label>
            <Input
              id="contactEmail"
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="Masukkan email kontak"
              className="mt-1 bg-white"
            />
          </div>
          <div>
            <Label htmlFor="amountSubmissions" className="text-[#182d7c]">
              Nominal Pengajuan
            </Label>
            <Input
              id="amountSubmissions"
              type="number"
              value={amountSubmissions}
              onChange={(e) => setamountSubmission(parseInt(e.target.value))}
              placeholder="Masukkan nominal pengajuan"
              className="mt-1 bg-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
