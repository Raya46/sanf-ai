import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface CashFlowItem {
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

const cashFlowData: CashFlowItem[] = [
  { keterangan: "KETERANGAN", "2024": "2024", "2023": "2023", isSubHeader: true },
  { keterangan: "ARUS KAS DARI AKTIVITAS OPERASI", "2024": "", "2023": "", isHeader: true },
  { keterangan: "Laba Bersih", "2024": 18080000000, "2023": 12940000000 },
  { keterangan: "Penyesuaian:", "2024": "", "2023": "", isSubHeader: true },
  { keterangan: "Penyusutan dan Amortisasi", "2024": 8450000000, "2023": 7230000000 },
  { keterangan: "Beban Pajak Tangguhan", "2024": 1230000000, "2023": 890000000 },
  { keterangan: "Perubahan Aset dan Liabilitas Operasi:", "2024": "", "2023": "", isSubHeader: true },
  { keterangan: "Piutang Usaha", "2024": -3340000000, "2023": -2890000000 },
  { keterangan: "Persediaan", "2024": -1770000000, "2023": -1450000000 },
  { keterangan: "Utang Usaha", "2024": 1490000000, "2023": 1230000000 },
  { keterangan: "Utang Pajak", "2024": 1050000000, "2023": 780000000 },
  { keterangan: "Kas Bersih dari Aktivitas Operasi", "2024": 25190000000, "2023": 18730000000, isTotal: true },
  { keterangan: "ARUS KAS DARI AKTIVITAS INVESTASI", "2024": "", "2023": "", isHeader: true },
  { keterangan: "Pembelian Aset Tetap", "2024": -21670000000, "2023": -15450000000 },
  { keterangan: "Investasi Aset Tambang", "2024": -6310000000, "2023": -4890000000 },
  { keterangan: "Penjualan Aset Tetap", "2024": 890000000, "2023": 650000000 },
  { keterangan: "Kas Bersih untuk Aktivitas Investasi", "2024": -27090000000, "2023": -19690000000, isTotal: true },
  { keterangan: "ARUS KAS DARI AKTIVITAS PENDANAAN", "2024": "", "2023": "", isHeader: true },
  { keterangan: "Penambahan Utang Bank", "2024": 9300000000, "2023": 7500000000 },
  { keterangan: "Pembayaran Utang Bank", "2024": -2500000000, "2023": -1890000000 },
  { keterangan: "Penambahan Utang Leasing", "2024": 2550000000, "2023": 1950000000 },
  { keterangan: "Dividen yang Dibayar", "2024": -3850000000, "2023": -2450000000 },
  { keterangan: "Kas Bersih dari Aktivitas Pendanaan", "2024": 5500000000, "2023": 5110000000, isTotal: true },
  { keterangan: "KENAIKAN (PENURUNAN) BERSIH KAS", "2024": 3600000000, "2023": 4150000000, isTotal: true },
  { keterangan: "Kas dan Setara Kas Awal Tahun", "2024": 8720000000, "2023": 4570000000 },
  { keterangan: "Pengaruh Perubahan Kurs", "2024": 130000000, "2023": 0 },
  { keterangan: "KAS DAN SETARA KAS AKHIR TAHUN", "2024": 12450000000, "2023": 8720000000, isTotal: true },
];

const CashFlowTable: React.FC<{ data: CashFlowItem[] }> = ({ data }) => (
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

export function CashFlowTab() {
  return (
    <div className="space-y-8">
      <div className="rounded-lg border bg-white p-4 shadow-sm">
        <h2 className="mb-4 text-xl font-bold">LAPORAN ARUS KAS</h2>
        <CashFlowTable data={cashFlowData} />
      </div>
    </div>
  );
}