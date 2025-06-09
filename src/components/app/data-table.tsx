import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ContentOverview } from "./ui/content-overview";
import { ContentReport } from "./ui/content-report";
import { ContentStatistic } from "./ui/content-statistic";

const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Lunas",
    totalAmount: "Rp 2.500.000",
    paymentMethod: "Kartu Kredit",
  },
  {
    invoice: "INV002",
    paymentStatus: "Tertunda",
    totalAmount: "Rp 1.500.000",
    paymentMethod: "GoPay",
  },
  {
    invoice: "INV003",
    paymentStatus: "Belum Dibayar",
    totalAmount: "Rp 3.500.000",
    paymentMethod: "Transfer Bank",
  },
  {
    invoice: "INV004",
    paymentStatus: "Lunas",
    totalAmount: "Rp 4.500.000",
    paymentMethod: "Kartu Kredit",
  },
  {
    invoice: "INV005",
    paymentStatus: "Lunas",
    totalAmount: "Rp 5.500.000",
    paymentMethod: "OVO",
  },
  {
    invoice: "INV006",
    paymentStatus: "Tertunda",
    totalAmount: "Rp 2.000.000",
    paymentMethod: "Transfer Bank",
  },
  {
    invoice: "INV007",
    paymentStatus: "Belum Dibayar",
    totalAmount: "Rp 3.000.000",
    paymentMethod: "Dana",
  },
];

export function DataTable({ selectedSection }: { selectedSection: string }) {
  let content;

  switch (selectedSection) {
    case "credit":
      content = (
        <Table>
          <TableCaption>Daftar faktur terbaru Anda.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Faktur</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Metode</TableHead>
              <TableHead className="text-right">Jumlah</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.invoice}>
                <TableCell className="font-medium">{invoice.invoice}</TableCell>
                <TableCell>{invoice.paymentStatus}</TableCell>
                <TableCell>{invoice.paymentMethod}</TableCell>
                <TableCell className="text-right">
                  {invoice.totalAmount}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell className="text-right">Rp 22.500.000</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      );
      break;
    case "overview":
      content = <ContentOverview />;
      break;
    case "statistic":
      content = <ContentStatistic />;
      break;
    case "report":
      content = <ContentReport />;
      break;
    default:
      content = <p>Select a section to view data.</p>;
  }

  return content;
}
