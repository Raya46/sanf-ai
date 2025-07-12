import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface BalanceSheetItem {
  keterangan: string;
  "2024": number | string;
  "2023": number | string;
  isHeader?: boolean;
  isSubHeader?: boolean;
  isTotal?: boolean;
}

const formatRupiah = (amount: number | string): string => {
  if (typeof amount === "string") return amount;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

const asetData: BalanceSheetItem[] = [
  { keterangan: "ASET (dalam Rupiah)", "2024": "", "2023": "", isHeader: true },
  { keterangan: "Keterangan", "2024": "2024", "2023": "2023", isSubHeader: true },
  { keterangan: "ASET LANCAR", "2024": "", "2023": "", isSubHeader: true },
  { keterangan: "Kas dan Setara Kas", "2024": 12450000000, "2023": 8720000000 },
  { keterangan: "Piutang Usaha - Bersih", "2024": 15680000000, "2023": 12340000000 },
  { keterangan: "Persediaan", "2024": 8920000000, "2023": 7150000000 },
  { keterangan: "Pajak Dibayar Dimuka", "2024": 2340000000, "2023": 1890000000 },
  { keterangan: "Biaya Dibayar Dimuka", "2024": 1560000000, "2023": 1200000000 },
  { keterangan: "Jumlah Aset Lancar", "2024": 40950000000, "2023": 31300000000, isTotal: true },
  { keterangan: "ASET TIDAK LANCAR", "2024": "", "2023": "", isSubHeader: true },
  { keterangan: "Aset Tetap - Bersih", "2024": 85670000000, "2023": 72450000000 },
  { keterangan: "Aset Tambang - Bersih", "2024": 45230000000, "2023": 38920000000 },
  { keterangan: "Goodwill", "2024": 3450000000, "2023": 3450000000 },
  { keterangan: "Jumlah Aset Tidak Lancar", "2024": 134350000000, "2023": 114820000000, isTotal: true },
  { keterangan: "JUMLAH ASET", "2024": 175300000000, "2023": 146120000000, isTotal: true },
];

const liabilitasEkuitasData: BalanceSheetItem[] = [
  { keterangan: "LIABILITAS & EKUITAS (dalam Rupiah)", "2024": "", "2023": "", isHeader: true },
  { keterangan: "Keterangan", "2024": "2024", "2023": "2023", isSubHeader: true },
  { keterangan: "LIABILITAS JANGKA PENDEK", "2024": "", "2023": "", isSubHeader: true },
  { keterangan: "Utang Usaha", "2024": 8920000000, "2023": 7430000000 },
  { keterangan: "Utang Bank Jangka Pendek", "2024": 12000000000, "2023": 9500000000 },
  { keterangan: "Biaya Yang Masih Harus Dibayar", "2024": 3450000000, "2023": 2890000000 },
  { keterangan: "Utang Pajak", "2024": 4230000000, "2023": 3180000000 },
  { keterangan: "Jumlah Liabilitas Jangka Pendek", "2024": 28600000000, "2023": 23000000000, isTotal: true },
  { keterangan: "LIABILITAS JANGKA PANJANG", "2024": "", "2023": "", isSubHeader: true },
  { keterangan: "Utang Bank Jangka Panjang", "2024": 45500000000, "2023": 38700000000 },
  { keterangan: "Utang Leasing", "2024": 8750000000, "2023": 6200000000 },
  { keterangan: "Jumlah Liabilitas Jangka Panjang", "2024": 54250000000, "2023": 44900000000, isTotal: true },
  { keterangan: "JUMLAH LIABILITAS", "2024": 82850000000, "2023": 67900000000, isTotal: true },
  { keterangan: "EKUITAS", "2024": "", "2023": "", isSubHeader: true },
  { keterangan: "Modal Saham", "2024": 25000000000, "2023": 25000000000 },
  { keterangan: "Tambahan Modal Disetor", "2024": 35000000000, "2023": 35000000000 },
  { keterangan: "Saldo Laba", "2024": 32450000000, "2023": 18220000000 },
  { keterangan: "JUMLAH EKUITAS", "2024": 92450000000, "2023": 78220000000, isTotal: true },
  { keterangan: "JUMLAH LIABILITAS DAN EKUITAS", "2024": 175300000000, "2023": 146120000000, isTotal: true },
];

const BalanceSheetTable: React.FC<{ data: BalanceSheetItem[] }> = ({ data }) => (
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

export function BalanceSheetTab() {
  return (
    <div className="space-y-8">
      <div className="rounded-lg border bg-white p-4 shadow-sm">
        <h2 className="mb-4 text-xl font-bold">ASET</h2>
        <BalanceSheetTable data={asetData} />
      </div>
      <div className="rounded-lg border bg-white p-4 shadow-sm">
        <h2 className="mb-4 text-xl font-bold">LIABILITAS & EKUITAS</h2>
        <BalanceSheetTable data={liabilitasEkuitasData} />
      </div>
    </div>
  );
}