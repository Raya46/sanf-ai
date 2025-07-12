import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface IncomeStatementItem {
  keterangan: string;
  "2024": number | string;
  "2023": number | string;
  isHeader?: boolean;
  isSubHeader?: boolean;
  isTotal?: boolean;
}

const formatRupiah = (amount: number | string): string => {
  if (typeof amount === "string") return amount;
  const formatted = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
  // Handle negative numbers by wrapping in parentheses
  return amount < 0 ? `(${formatted.replace("-", "")})` : formatted;
};

const incomeStatementData: IncomeStatementItem[] = [
  { keterangan: "KETERANGAN", "2024": "2024", "2023": "2023", isSubHeader: true },
  { keterangan: "PENDAPATAN", "2024": "", "2023": "", isHeader: true },
  { keterangan: "Penjualan Batu Bara", "2024": 65780000000, "2023": 52340000000 },
  { keterangan: "Penjualan Alat Berat", "2024": 8920000000, "2023": 6750000000 },
  { keterangan: "Jasa Kontraktor", "2024": 4560000000, "2023": 3890000000 },
  { keterangan: "Jumlah Pendapatan", "2024": 79260000000, "2023": 62980000000, isTotal: true },
  { keterangan: "BEBAN POKOK PENJUALAN", "2024": "", "2023": "", isHeader: true },
  { keterangan: "Biaya Bahan Baku", "2024": 15680000000, "2023": 12590000000 },
  { keterangan: "Biaya Tenaga Kerja Langsung", "2024": 12340000000, "2023": 9870000000 },
  { keterangan: "Biaya Overhead Pabrik", "2024": 8920000000, "2023": 7560000000 },
  { keterangan: "Penyusutan Alat Berat", "2024": 5670000000, "2023": 4890000000 },
  { keterangan: "Jumlah Beban Pokok Penjualan", "2024": 42610000000, "2023": 34910000000, isTotal: true },
  { keterangan: "LABA KOTOR", "2024": 36650000000, "2023": 28070000000, isTotal: true },
  { keterangan: "BEBAN OPERASIONAL", "2024": "", "2023": "", isHeader: true },
  { keterangan: "Beban Penjualan", "2024": 3450000000, "2023": 2890000000 },
  { keterangan: "Beban Administrasi", "2024": 4560000000, "2023": 3780000000 },
  { keterangan: "Beban Umum", "2024": 2230000000, "2023": 1890000000 },
  { keterangan: "Jumlah Beban Operasional", "2024": 10240000000, "2023": 8560000000, isTotal: true },
  { keterangan: "LABA OPERASIONAL", "2024": 26410000000, "2023": 19510000000, isTotal: true },
  { keterangan: "PENDAPATAN (BEBAN) LAIN-LAIN", "2024": "", "2023": "", isHeader: true },
  { keterangan: "Pendapatan Bunga", "2024": 890000000, "2023": 650000000 },
  { keterangan: "Beban Bunga", "2024": -4560000000, "2023": -3890000000 },
  { keterangan: "Laba Selisih Kurs", "2024": 450000000, "2023": 320000000 },
  { keterangan: "Jumlah Pendapatan (Beban) Lain-lain", "2024": -3220000000, "2023": -2920000000, isTotal: true },
  { keterangan: "LABA SEBELUM PAJAK", "2024": 23190000000, "2023": 16590000000, isTotal: true },
  { keterangan: "Beban Pajak Penghasilan", "2024": -5110000000, "2023": -3650000000 },
  { keterangan: "LABA BERSIH", "2024": 18080000000, "2023": 12940000000, isTotal: true },
];

const IncomeStatementTable: React.FC<{ data: IncomeStatementItem[] }> = ({ data }) => (
  <Table className="w-full">
    <TableHeader>
      <TableRow>
        <TableHead className="w-[60%]">Keterangan</TableHead>
        <TableHead className="text-right">2024</TableHead>
        <TableHead className="text-right">2023</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {data.map((item, index) => (
        <TableRow
          key={index}
          className={
            item.isHeader
              ? "bg-gray-100 font-bold text-lg"
              : item.isSubHeader
              ? "bg-gray-50 font-semibold"
              : item.isTotal
              ? "font-bold bg-blue-50/50"
              : ""
          }
        >
          <TableCell
            className={
              item.isHeader || item.isSubHeader || item.isTotal
                ? "font-bold"
                : "pl-8"
            }
          >
            {item.keterangan}
          </TableCell>
          <TableCell className="text-right">
            {formatRupiah(item["2024"])}
          </TableCell>
          <TableCell className="text-right">
            {formatRupiah(item["2023"])}
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

export function IncomeStatementTab() {
  return (
    <div className="space-y-8">
      <div className="rounded-lg border bg-white p-4 shadow-sm">
        <h2 className="mb-4 text-xl font-bold">LAPORAN LABA RUGI</h2>
        <IncomeStatementTable data={incomeStatementData} />
      </div>
    </div>
  );
}