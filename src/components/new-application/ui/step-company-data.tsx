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
  const formatRupiah = (angka: number | string) => {
    // Pastikan input adalah string dan hapus karakter non-digit
    const number_string = String(angka).replace(/[^,\d]/g, "");
    const split = number_string.split(",");
    const sisa = split[0].length % 3;
    let rupiah = split[0].substr(0, sisa);
    const ribuan = split[0].substr(sisa).match(/\d{3}/gi);

    // Tambahkan titik sebagai pemisah ribuan
    if (ribuan) {
      const separator = sisa ? "." : "";
      rupiah += separator + ribuan.join(".");
    }

    rupiah = split[1] !== undefined ? rupiah + "," + split[1] : rupiah;
    return rupiah;
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = parseRupiah(e.target.value);
    setamountSubmission(numericValue);
  };
  // Helper function to parse a Rupiah string back to a number
  const parseRupiah = (rupiah: string): number => {
    // Hapus semua karakter kecuali angka
    return parseInt(rupiah.replace(/[^0-9]/g, ""), 10) || 0;
  };
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
            <div className="relative mt-1">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                Rp
              </span>
              <Input
                id="amountSubmissions"
                type="text" // Ubah ke text untuk menampilkan format
                value={formatRupiah(amountSubmissions)}
                onChange={handleAmountChange}
                placeholder="10.000.000"
                className="pl-10 bg-white" // Tambahkan padding kiri
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
