import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
export function ContentStatistic() {
  return (
    <Card>
      <div className="main-content text-gray-800 flex-grow flex flex-col">
        <p>Statistic</p>
        <Table className="financial-table w-full border-collapse min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="label-col text-left p-3 border-b border-gray-200 bg-gray-100 text-gray-600 font-semibold text-sm sticky top-0 z-10 w-72"></TableHead>
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
            {/* Statistik kunci */}
            <TableRow className="category-header bg-blue-50 text-blue-700 font-bold">
              <TableCell
                colSpan={5}
                className="text-left p-3 border-b border-gray-200 pl-4"
              >
                Statistik kunci
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="row-header label-col text-left font-semibold text-gray-800 p-3 border-b border-gray-200 pl-4">
                Total saham umum beredar / Total common shares
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                1,79B
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                150,79B
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                150,77B
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                150,65B
              </TableCell>
            </TableRow>

            {/* Rasio valuasi */}
            <TableRow className="category-header bg-blue-50 text-blue-700 font-bold">
              <TableCell
                colSpan={5}
                className="text-left p-3 border-b border-gray-200 pl-4"
              >
                Rasio valuasi
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="row-header label-col text-left font-semibold text-gray-800 p-3 border-b border-gray-200 pl-4">
                Price to earnings ratio
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                14,72
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                14,13
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                14,42
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                15,14
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="row-header label-col text-left font-semibold text-gray-800 p-3 border-b border-gray-200 pl-4">
                Price to sales ratio
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                3,99
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                3,69
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                3,92
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                3,98
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="row-header label-col text-left font-semibold text-gray-800 p-3 border-b border-gray-200 pl-4">
                Price to cash flow ratio
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                10,02
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                9,40
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                9,26
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                16,87
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="row-header label-col text-left font-semibold text-gray-800 p-3 border-b border-gray-200 pl-4">
                Price to book ratio
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                2,79
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                2,58
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                2,77
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                3,11
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="row-header label-col text-left font-semibold text-gray-800 p-3 border-b border-gray-200 pl-4">
                Enterprise value
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                867,96T
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                834,04T
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                867,16T
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                987,25T
              </TableCell>
            </TableRow>

            {/* Rasio profitabilitas */}
            <TableRow className="category-header bg-blue-50 text-blue-700 font-bold">
              <TableCell
                colSpan={5}
                className="text-left p-3 border-b border-gray-200 pl-4"
              >
                Rasio profitabilitas
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="row-header label-col text-left font-semibold text-gray-800 p-3 border-b border-gray-200 pl-4">
                Return on assets %
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                3,23
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                3,17
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                3,14
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                3,17
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="row-header label-col text-left font-semibold text-gray-800 p-3 border-b border-gray-200 pl-4">
                Return on equity %
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                19,37
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                18,57
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                19,68
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                21,13
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="row-header label-col text-left font-semibold text-gray-800 p-3 border-b border-gray-200 pl-4">
                Return on Invested capital %
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                16,02
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                15,24
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                16,25
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                17,45
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="row-header label-col text-left font-semibold text-gray-800 p-3 border-b border-gray-200 pl-4">
                Operating margin %
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                32,38
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                33,54
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                37,11
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                32,02
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="row-header label-col text-left font-semibold text-gray-800 p-3 border-b border-gray-200 pl-4">
                Net margin %
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                25,47
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                25,78
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                29,03
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                25,39
              </TableCell>
            </TableRow>
            <TableRow className="row-header label-col text-left font-semibold text-gray-800 p-3 border-b border-gray-200 pl-4">
              <TableCell>Non-interest income to total revenue %</TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                21,09
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                18,07
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                15,11
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                19,95
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="row-header label-col text-left font-semibold text-gray-800 p-3 border-b border-gray-200 pl-4">
                Net interest income to average total deposits %
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                10,54
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                10,64
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                10,14
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                10,36
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="row-header label-col text-left font-semibold text-gray-800 p-3 border-b border-gray-200 pl-4">
                Net Interest Income to earning assets %
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                10,94
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                11,18
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                11,39
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                11,50
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="row-header label-col text-left font-semibold text-gray-800 p-3 border-b border-gray-200 pl-4">
                Total interest expense to interest bearing liabs %
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                7,60
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                7,86
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                2,91
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                3,20
              </TableCell>
            </TableRow>

            {/* Rasio likuiditas */}
            <TableRow className="category-header bg-blue-50 text-blue-700 font-bold">
              <TableCell
                colSpan={5}
                className="text-left p-3 border-b border-gray-200 pl-4"
              >
                Rasio likuiditas
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="row-header label-col text-left font-semibold text-gray-800 p-3 border-b border-gray-200 pl-4">
                Current ratio
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                0,30
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                0,30
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                0,34
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                0,29
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="row-header label-col text-left font-semibold text-gray-800 p-3 border-b border-gray-200 pl-4">
                Asset turnover
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                0,12
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                0,12
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                0,12
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                0,12
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="row-header label-col text-left font-semibold text-gray-800 p-3 border-b border-gray-200 pl-4">
                Cash & due from banks to total deposits
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                0,41
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                0,40
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                0,44
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                0,39
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="row-header label-col text-left font-semibold text-gray-800 p-3 border-b border-gray-200 pl-4">
                Loan losses reserves to total loan
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                0,07
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                0,07
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                0,07
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                0,06
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="row-header label-col text-left font-semibold text-gray-800 p-3 border-b border-gray-200 pl-4">
                Non-performing loans to common equity
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                0,23
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                0,21
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                0,20
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                0,22
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="row-header label-col text-left font-semibold text-gray-800 p-3 border-b border-gray-200 pl-4">
                Non-performing loans to loan loss reserves
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                0,77
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                0,74
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                0,72
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                0,74
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="row-header label-col text-left font-semibold text-gray-800 p-3 border-b border-gray-200 pl-4">
                Non-performing loans to total loans
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                0,05
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                0,05
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                0,05
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                0,05
              </TableCell>
            </TableRow>

            {/* Rasio solvabilitas */}
            <TableRow className="category-header bg-blue-50 text-blue-700 font-bold">
              <TableCell
                colSpan={5}
                className="text-left p-3 border-b border-gray-200 pl-4"
              >
                Rasio solvabilitas
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="row-header label-col text-left font-semibold text-gray-800 p-3 border-b border-gray-200 pl-4">
                Debt to assets ratio
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                0,10
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                0,08
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                0,09
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                0,09
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="row-header label-col text-left font-semibold text-gray-800 p-3 border-b border-gray-200 pl-4">
                Debt to equity ratio
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                0,60
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                0,51
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                0,58
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                0,61
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="row-header label-col text-left font-semibold text-gray-800 p-3 border-b border-gray-200 pl-4">
                Long term debt to total assets ratio
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                0,03
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                0,03
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                0,03
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                0,03
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="row-header label-col text-left font-semibold text-gray-800 p-3 border-b border-gray-200 pl-4">
                Rasio utang jangka panjang terhadap total ekuitas
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                0,18
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                0,19
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                0,17
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                0,18
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="row-header label-col text-left font-semibold text-gray-800 p-3 border-b border-gray-200 pl-4">
                Total deposits to total assets
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                0,69
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                0,70
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                0,69
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                0,71
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="row-header label-col text-left font-semibold text-gray-800 p-3 border-b border-gray-200 pl-4">
                Gross loans to total assets
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                0,69
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                0,69
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                0,66
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                0,69
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="row-header label-col text-left font-semibold text-gray-800 p-3 border-b border-gray-200 pl-4">
                Invested assets to total assets
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                0,21
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                0,21
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                0,21
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                0,22
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="row-header label-col text-left font-semibold text-gray-800 p-3 border-b border-gray-200 pl-4">
                Loan losses to total assets
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                0,05
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                0,05
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                0,04
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                0,04
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="row-header label-col text-left font-semibold text-gray-800 p-3 border-b border-gray-200 pl-4">
                Common equity to total deposits
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                0,24
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                0,24
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                0,23
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                0,21
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="row-header label-col text-left font-semibold text-gray-800 p-3 border-b border-gray-200 pl-4">
                Invested assets to total deposits
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                0,30
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                0,30
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                0,31
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                0,31
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="row-header label-col text-left font-semibold text-gray-800 p-3 border-b border-gray-200 pl-4">
                Invested assets and net loans to total deposits
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                1,23
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                1,23
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                1,21
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                1,22
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="row-header label-col text-left font-semibold text-gray-800 p-3 border-b border-gray-200 pl-4">
                Gross loans to total deposits
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                1,00
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                1,00
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                0,96
              </TableCell>
              <TableCell className="text-right p-3 border-b border-gray-200">
                0,97
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
