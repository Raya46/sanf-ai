import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function ContentReport() {
  return (
    <Card className="main-content text-gray-800 flex-grow flex flex-col">
      <p>Laporan Keuangan</p>
      <Table className="financial-table w-full border-collapse min-w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="label-col text-left p-3 border-b border-gray-200 bg-gray-100 text-gray-600 font-semibold text-sm sticky top-0 z-10 w-64"></TableHead>
            <TableHead className="text-right p-3 border-b border-gray-200 bg-gray-100 text-gray-600 font-semibold text-sm sticky top-0 z-10">
              Q4 &apos;23
              <br />
              2023
            </TableHead>
            <TableHead className="text-right p-3 border-b border-gray-200 bg-gray-100 text-gray-600 font-semibold text-sm sticky top-0 z-10">
              Q1 &apos;24
              <br />
              Mar 2024
            </TableHead>
            <TableHead className="text-right p-3 border-b border-gray-200 bg-gray-100 text-gray-600 font-semibold text-sm sticky top-0 z-10">
              Q2 &apos;24
              <br />
              Jun 2024
            </TableHead>
            <TableHead className="text-right p-3 border-b border-gray-200 bg-gray-100 text-gray-600 font-semibold text-sm sticky top-0 z-10">
              Q3 &apos;24
              <br />
              Sep 2024
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow className="highlight-row bg-blue-50 font-bold">
            <TableCell className="row-header label-col text-left text-blue-700 p-3 border-b border-gray-200 pl-4">
              Total pendapatan
            </TableCell>
            <TableCell className="text-right p-3 border-b border-gray-200">
              3,49T
            </TableCell>
            <TableCell className="text-right p-3 border-b border-gray-200">
              62,56T
            </TableCell>
            <TableCell className="text-right p-3 border-b border-gray-200">
              61,37T
            </TableCell>
            <TableCell className="text-right p-3 border-b border-gray-200">
              65,47T
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="sub-row-header label-col text-left text-gray-600 p-3 border-b border-gray-200 pl-8">
              Interest income, Revenue
            </TableCell>
            <TableCell className="text-right p-3 border-b border-gray-200">
              1,49T
            </TableCell>
            <TableCell className="text-right p-3 border-b border-gray-200">
              50,08T
            </TableCell>
            <TableCell className="text-right p-3 border-b border-gray-200">
              48,57T
            </TableCell>
            <TableCell className="text-right p-3 border-b border-gray-200">
              50,14T
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="sub-row-header label-col text-left text-gray-600 p-3 border-b border-gray-200 pl-8">
              Total interest expense - Banks
            </TableCell>
            <TableCell className="negative-value text-right p-3 border-b border-gray-200 text-red-600">
              -1,12T
            </TableCell>
            <TableCell className="negative-value text-right p-3 border-b border-gray-200 text-red-600">
              -14,12T
            </TableCell>
            <TableCell className="negative-value text-right p-3 border-b border-gray-200 text-red-600">
              -14,60T
            </TableCell>
            <TableCell className="negative-value text-right p-3 border-b border-gray-200 text-red-600">
              -14,32T
            </TableCell>
          </TableRow>
          <TableRow className="highlight-row bg-blue-50 font-bold">
            <TableCell className="row-header label-col text-left text-blue-700 p-3 border-b border-gray-200 pl-4">
              Net interest income
            </TableCell>
            <TableCell className="text-right p-3 border-b border-gray-200">
              1,99T
            </TableCell>
            <TableCell className="text-right p-3 border-b border-gray-200">
              35,95T
            </TableCell>
            <TableCell className="text-right p-3 border-b border-gray-200">
              33,98T
            </TableCell>
            <TableCell className="text-right p-3 border-b border-gray-200">
              35,83T
            </TableCell>
          </TableRow>
          {/* Second block of data */}
          <TableRow className="highlight-row bg-blue-50 font-bold">
            <TableCell className="row-header label-col text-left text-blue-700 p-3 border-b border-gray-200 pl-4">
              Total pendapatan
            </TableCell>
            <TableCell className="text-right p-3 border-b border-gray-200">
              55,49T
            </TableCell>
            <TableCell className="text-right p-3 border-b border-gray-200">
              62,56T
            </TableCell>
            <TableCell className="text-right p-3 border-b border-gray-200">
              61,37T
            </TableCell>
            <TableCell className="text-right p-3 border-b border-gray-200">
              65,47T
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="sub-row-header label-col text-left text-gray-600 p-3 border-b border-gray-200 pl-8">
              Interest income, Revenue
            </TableCell>
            <TableCell className="text-right p-3 border-b border-gray-200">
              47,10T
            </TableCell>
            <TableCell className="text-right p-3 border-b border-gray-200">
              50,08T
            </TableCell>
            <TableCell className="text-right p-3 border-b border-gray-200">
              48,57T
            </TableCell>
            <TableCell className="text-right p-3 border-b border-gray-200">
              50,14T
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="sub-row-header label-col text-left text-gray-600 p-3 border-b border-gray-200 pl-8">
              Total interest expense - Banks
            </TableCell>
            <TableCell className="negative-value text-right p-3 border-b border-gray-200 text-red-600">
              -13,12T
            </TableCell>
            <TableCell className="negative-value text-right p-3 border-b border-gray-200 text-red-600">
              -14,12T
            </TableCell>
            <TableCell className="negative-value text-right p-3 border-b border-gray-200 text-red-600">
              -14,60T
            </TableCell>
            <TableCell className="negative-value text-right p-3 border-b border-gray-200 text-red-600">
              -14,32T
            </TableCell>
          </TableRow>
          <TableRow className="highlight-row bg-blue-50 font-bold">
            <TableCell className="row-header label-col text-left text-blue-700 p-3 border-b border-gray-200 pl-4">
              Net interest income
            </TableCell>
            <TableCell className="text-right p-3 border-b border-gray-200">
              33,99T
            </TableCell>
            <TableCell className="text-right p-3 border-b border-gray-200">
              35,95T
            </TableCell>
            <TableCell className="text-right p-3 border-b border-gray-200">
              33,98T
            </TableCell>
            <TableCell className="text-right p-3 border-b border-gray-200">
              35,83T
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="row-header label-col text-left font-semibold text-gray-800 p-3 border-b border-gray-200 pl-4">
              Loan loss provision
            </TableCell>
            <TableCell className="negative-value text-right p-3 border-b border-gray-200 text-red-600">
              -6,96T
            </TableCell>
            <TableCell className="negative-value text-right p-3 border-b border-gray-200 text-red-600">
              -12,34T
            </TableCell>
            <TableCell className="negative-value text-right p-3 border-b border-gray-200 text-red-600">
              -10,39T
            </TableCell>
            <TableCell className="negative-value text-right p-3 border-b border-gray-200 text-red-600">
              -10,86T
            </TableCell>
          </TableRow>
          <TableRow className="highlight-row bg-blue-50 font-bold">
            <TableCell className="row-header label-col text-left text-blue-700 p-3 border-b border-gray-200 pl-4">
              Net interest income after loan loss provision
            </TableCell>
            <TableCell className="text-right p-3 border-b border-gray-200">
              27,03T
            </TableCell>
            <TableCell className="text-right p-3 border-b border-gray-200">
              23,62T
            </TableCell>
            <TableCell className="text-right p-3 border-b border-gray-200">
              23,58T
            </TableCell>
            <TableCell className="text-right p-3 border-b border-gray-200">
              24,97T
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="sub-row-header label-col text-left text-gray-600 p-3 border-b border-gray-200 pl-8">
              Non-interest income
            </TableCell>
            <TableCell className="text-right p-3 border-b border-gray-200">
              8,39T
            </TableCell>
            <TableCell className="text-right p-3 border-b border-gray-200">
              12,48T
            </TableCell>
            <TableCell className="text-right p-3 border-b border-gray-200">
              12,80T
            </TableCell>
            <TableCell className="text-right p-3 border-b border-gray-200">
              15,33T
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="sub-row-header label-col text-left text-gray-600 p-3 border-b border-gray-200 pl-8">
              Non-interest expense
            </TableCell>
            <TableCell className="negative-value text-right p-3 border-b border-gray-200 text-red-600">
              -14,83T
            </TableCell>
            <TableCell className="negative-value text-right p-3 border-b border-gray-200 text-red-600">
              -16,07T
            </TableCell>
            <TableCell className="negative-value text-right p-3 border-b border-gray-200 text-red-600">
              -17,94T
            </TableCell>
            <TableCell className="negative-value text-right p-3 border-b border-gray-200 text-red-600">
              -20,80T
            </TableCell>
          </TableRow>
          <TableRow className="highlight-row bg-blue-50 font-bold">
            <TableCell className="row-header label-col text-left text-blue-700 p-3 border-b border-gray-200 pl-4">
              Pemasukan operasional
            </TableCell>
            <TableCell className="text-right p-3 border-b border-gray-200">
              20,59T
            </TableCell>
            <TableCell className="text-right p-3 border-b border-gray-200">
              20,03T
            </TableCell>
            <TableCell className="text-right p-3 border-b border-gray-200">
              18,44T
            </TableCell>
            <TableCell className="text-right p-3 border-b border-gray-200">
              19,50T
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="sub-row-header label-col text-left text-gray-600 p-3 border-b border-gray-200 pl-8">
              Non-operating income, excl. interest expenses
            </TableCell>
            <TableCell className="text-right p-3 border-b border-gray-200">
              83,64B
            </TableCell>
            <TableCell className="negative-value text-right p-3 border-b border-gray-200 text-red-600">
              -108,98B
            </TableCell>
            <TableCell className="text-right p-3 border-b border-gray-200">
              13,46B
            </TableCell>
            <TableCell className="text-right p-3 border-b border-gray-200">
              38,51B
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="sub-row-header label-col text-left text-gray-600 p-3 border-b border-gray-200 pl-8">
              Unusual income/expense / Pemasukan/pengeluaran...
            </TableCell>
            <TableCell className="text-right p-3 border-b border-gray-200">
              35,76B
            </TableCell>
            <TableCell className="text-right p-3 border-b border-gray-200">
              3,21B
            </TableCell>
            <TableCell className="text-right p-3 border-b border-gray-200">
              75,87B
            </TableCell>
            <TableCell className="text-right p-3 border-b border-gray-200">
              3,52B
            </TableCell>
          </TableRow>
          <TableRow className="highlight-row bg-blue-50 font-bold">
            <TableCell className="row-header label-col text-left text-blue-700 p-3 border-b border-gray-200 pl-4">
              Pretax Income
            </TableCell>
            <TableCell className="text-right p-3 border-b border-gray-200">
              20,71T
            </TableCell>
            <TableCell className="text-right p-3 border-b border-gray-200">
              19,92T
            </TableCell>
            <TableCell className="text-right p-3 border-b border-gray-200">
              18,52T
            </TableCell>
            <TableCell className="text-right p-3 border-b border-gray-200">
              19,54T
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="sub-row-header label-col text-left text-gray-600 p-3 border-b border-gray-200 pl-8">
              Equity in earnings
            </TableCell>
            <TableCell className="text-right p-3 border-b border-gray-200"></TableCell>
            <TableCell className="text-right p-3 border-b border-gray-200"></TableCell>
            <TableCell className="text-right p-3 border-b border-gray-200"></TableCell>
            <TableCell className="text-right p-3 border-b border-gray-200"></TableCell>
          </TableRow>
          {/* Third block of data */}
          <TableRow className="highlight-row bg-blue-50 font-bold">
            <TableCell className="row-header label-col text-left text-blue-700 p-3 border-b border-gray-200 pl-4">
              Pretax income
            </TableCell>
            <TableCell className="text-right p-3 border-b border-gray-200">
              20,71T
            </TableCell>
            <TableCell className="text-right p-3 border-b border-gray-200">
              19,92T
            </TableCell>
            <TableCell className="text-right p-3 border-b border-gray-200">
              18,52T
            </TableCell>
            <TableCell className="text-right p-3 border-b border-gray-200">
              19,54T
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="sub-row-header label-col text-left text-gray-600 p-3 border-b border-gray-200 pl-8">
              Equity in earnings
            </TableCell>
            <TableCell className="text-right p-3 border-b border-gray-200"></TableCell>
            <TableCell className="text-right p-3 border-b border-gray-200"></TableCell>
            <TableCell className="text-right p-3 border-b border-gray-200"></TableCell>
            <TableCell className="text-right p-3 border-b border-gray-200"></TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="row-header label-col text-left font-semibold text-gray-800 p-3 border-b border-gray-200 pl-4">
              Taxes
            </TableCell>
            <TableCell className="negative-value text-right p-3 border-b border-gray-200 text-red-600">
              -4,50T
            </TableCell>
            <TableCell className="negative-value text-right p-3 border-b border-gray-200 text-red-600">
              -3,94T
            </TableCell>
            <TableCell className="negative-value text-right p-3 border-b border-gray-200 text-red-600">
              -4,61T
            </TableCell>
            <TableCell className="negative-value text-right p-3 border-b border-gray-200 text-red-600">
              -4,07T
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="sub-row-header label-col text-left text-gray-600 p-3 border-b border-gray-200 pl-8">
              Non-controlling/minority interest
            </TableCell>
            <TableCell className="negative-value text-right p-3 border-b border-gray-200 text-red-600">
              -104,22B
            </TableCell>
            <TableCell className="negative-value text-right p-3 border-b border-gray-200 text-red-600">
              -97,07B
            </TableCell>
            <TableCell className="negative-value text-right p-3 border-b border-gray-200 text-red-600">
              -97,19B
            </TableCell>
            <TableCell className="negative-value text-right p-3 border-b border-gray-200 text-red-600">
              -103,36B
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="sub-row-header label-col text-left text-gray-600 p-3 border-b border-gray-200 pl-8">
              After tax other income/expense
            </TableCell>
            <TableCell className="text-right p-3 border-b border-gray-200">
              0,00
            </TableCell>
            <TableCell className="text-right p-3 border-b border-gray-200">
              0,00
            </TableCell>
            <TableCell className="text-right p-3 border-b border-gray-200">
              0,00
            </TableCell>
            <TableCell className="text-right p-3 border-b border-gray-200">
              0,00
            </TableCell>
          </TableRow>
          <TableRow className="highlight-row bg-blue-50 font-bold">
            <TableCell className="row-header label-col text-left text-blue-700 p-3 border-b border-gray-200 pl-4">
              Net income before discontinued operations
            </TableCell>
            <TableCell className="text-right p-3 border-b border-gray-200">
              16,11T
            </TableCell>
            <TableCell className="text-right p-3 border-b border-gray-200">
              15,89T
            </TableCell>
            <TableCell className="text-right p-3 border-b border-gray-200">
              13,82T
            </TableCell>
            <TableCell className="text-right p-3 border-b border-gray-200">
              15,36T
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="sub-row-header label-col text-left text-gray-600 p-3 border-b border-gray-200 pl-8">
              Discontinued operations
            </TableCell>
            <TableCell className="text-right p-3 border-b border-gray-200">
              0,00
            </TableCell>
            <TableCell className="text-right p-3 border-b border-gray-200">
              0,00
            </TableCell>
            <TableCell className="text-right p-3 border-b border-gray-200">
              0,00
            </TableCell>
            <TableCell className="text-right p-3 border-b border-gray-200">
              0,00
            </TableCell>
          </TableRow>
          <TableRow className="highlight-row bg-blue-50 font-bold">
            <TableCell className="row-header label-col text-left text-blue-700 p-3 border-b border-gray-200 pl-4">
              Pendapatan netto
            </TableCell>
            <TableCell className="text-right p-3 border-b border-gray-200">
              16,11T
            </TableCell>
            <TableCell className="text-right p-3 border-b border-gray-200">
              15,89T
            </TableCell>
            <TableCell className="text-right p-3 border-b border-gray-200">
              13,82T
            </TableCell>
            <TableCell className="text-right p-3 border-b border-gray-200">
              15,36T
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="sub-row-header label-col text-left text-gray-600 p-3 border-b border-gray-200 pl-8">
              Dilution adjustment
            </TableCell>
            <TableCell className="text-right p-3 border-b border-gray-200">
              0,00
            </TableCell>
            <TableCell className="text-right p-3 border-b border-gray-200">
              0,00
            </TableCell>
            <TableCell className="text-right p-3 border-b border-gray-200">
              0,00
            </TableCell>
            <TableCell className="text-right p-3 border-b border-gray-200">
              0,00
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="sub-row-header label-col text-left text-gray-600 p-3 border-b border-gray-200 pl-8">
              Preferred dividends
            </TableCell>
            <TableCell className="text-right p-3 border-b border-gray-200">
              0,00
            </TableCell>
            <TableCell className="text-right p-3 border-b border-gray-200">
              0,00
            </TableCell>
            <TableCell className="text-right p-3 border-b border-gray-200">
              0,00
            </TableCell>
            <TableCell className="text-right p-3 border-b border-gray-200">
              0,00
            </TableCell>
          </TableRow>
          <TableRow className="highlight-row bg-blue-50 font-bold">
            <TableCell className="row-header label-col text-left text-blue-700 p-3 border-b border-gray-200 pl-4">
              Diluted net income available to common stockholders
            </TableCell>
            <TableCell className="text-right p-3 border-b border-gray-200">
              16,11T
            </TableCell>
            <TableCell className="text-right p-3 border-b border-gray-200">
              15,89T
            </TableCell>
            <TableCell className="text-right p-3 border-b border-gray-200">
              13,82T
            </TableCell>
            <TableCell className="text-right p-3 border-b border-gray-200">
              15,36T
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="row-header label-col text-left font-semibold text-gray-800 p-3 border-b border-gray-200 pl-4">
              Basic EPS
            </TableCell>
            <TableCell className="text-right p-3 border-b border-gray-200">
              106,80
            </TableCell>
            <TableCell className="text-right p-3 border-b border-gray-200">
              105,35
            </TableCell>
            <TableCell className="text-right p-3 border-b border-gray-200">
              91,64
            </TableCell>
            <TableCell className="text-right p-3 border-b border-gray-200">
              101,37
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="row-header label-col text-left font-semibold text-gray-800 p-3 border-b border-gray-200 pl-4">
              EPS Terdilusi
            </TableCell>
            <TableCell className="text-right p-3 border-b border-gray-200">
              106,75
            </TableCell>
            <TableCell className="text-right p-3 border-b border-gray-200">
              105,30
            </TableCell>
            <TableCell className="text-right p-3 border-b border-gray-200">
              91,62
            </TableCell>
            <TableCell className="text-right p-3 border-b border-gray-200">
              101,37
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Card>
  );
}
