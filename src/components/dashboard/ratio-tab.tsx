import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowUp,
  ArrowDown,
  Droplet,
  Scale,
  DollarSign,
  Package,
  Repeat,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Text } from "recharts";

// Helper function to format percentages
const formatPercentage = (value: number) => `${value.toFixed(1)}%`;

// Helper function to format numbers with 'x'
const formatMultiplier = (value: number) => `${value.toFixed(2)}x`;

// Profitability Ratios Section
interface ProfitabilityRatio {
  name: string;
  value: number; // in percentage
  change: number; // in percentage
  description: string;
  color: string;
}

const profitabilityData: ProfitabilityRatio[] = [
  {
    name: "Net Profit Margin",
    value: 22.8,
    change: 2.3,
    description:
      "Margin laba bersih yang tinggi (22.8%) menunjukkan efisiensi operasional yang sangat baik dan kemampuan menghasilkan keuntungan dari penjualan.",
    color: "#0088FE",
  },
  {
    name: "Return on Assets",
    value: 10.3, // Adjusted to be > 10% as per description
    change: 1.5,
    description:
      "ROA di atas 10% menunjukkan perusahaan mampu menghasilkan pengembalian yang baik dari aset yang dimiliki, lebih baik dari rata-rata industri (8.5%).",
    color: "#00C49F",
  },
  {
    name: "Return on Equity",
    value: 17.2,
    change: 2.3,
    description:
      "ROE yang tinggi menunjukkan kemampuan perusahaan menghasilkan pengembalian yang sangat baik bagi pemegang saham dari modal yang diinvestasikan.",
    color: "#FFBB28",
  },
];

const HalfDonutChart: React.FC<{ value: number; color: string }> = ({
  value,
  color,
}) => {
  const data = [
    { name: "Value", value: value },
    { name: "Remaining", value: 100 - value },
  ];
  return (
    <ResponsiveContainer width="100%" height={100}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="100%"
          startAngle={180}
          endAngle={0}
          innerRadius={40}
          outerRadius={50}
          fill="#8884d8"
          paddingAngle={0}
          dataKey="value"
          stroke="none"
        >
          <Cell key="value" fill={color} />
          <Cell key="remaining" fill="#e0e0e0" />
        </Pie>
        <Text
          x="50%"
          y="70%"
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-lg font-bold"
          fill="#000"
        >
          {formatPercentage(value)}
        </Text>
      </PieChart>
    </ResponsiveContainer>
  );
};

const ProfitabilityRatiosSection: React.FC = () => (
  <Card>
    <CardHeader>
      <CardTitle>ANALISIS RASIO PROFITABILITAS</CardTitle>
    </CardHeader>
    <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {profitabilityData.map((ratio) => (
        <div key={ratio.name} className="flex flex-col items-center text-center">
          <h3 className="text-md font-semibold">{ratio.name}</h3>
          <HalfDonutChart value={ratio.value} color={ratio.color} />
          <p className="text-2xl font-bold">{formatPercentage(ratio.value)}</p>
          <p
            className={`flex items-center text-sm ${
              ratio.change > 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            {ratio.change > 0 ? (
              <ArrowUp className="mr-1 h-4 w-4" />
            ) : (
              <ArrowDown className="mr-1 h-4 w-4" />
            )}
            {formatPercentage(Math.abs(ratio.change))}
          </p>
          <p className="mt-2 text-sm text-gray-600">{ratio.description}</p>
        </div>
      ))}
    </CardContent>
  </Card>
);

// Liquidity and Solvability Ratios Section
interface RatioItem {
  ratio: string;
  "2024": number | string;
  "2023": number | string;
  perubahan: number | string;
  industri: number | string;
}

const liquidityData: RatioItem[] = [
  { ratio: "Current Ratio", "2024": 1.43, "2023": 1.36, perubahan: "+0.07", industri: 1.30 },
  { ratio: "Quick Ratio", "2024": 1.12, "2023": 1.05, perubahan: "+0.07", industri: 1.00 },
  { ratio: "Cash Ratio", "2024": 0.44, "2023": 0.38, perubahan: "+0.06", industri: 0.30 },
];

const solvabilityData: RatioItem[] = [
  { ratio: "Debt to Equity Ratio", "2024": 0.90, "2023": 0.87, perubahan: "+0.03", industri: 0.95 },
  { ratio: "Debt to Asset Ratio", "2024": "47.3%", "2023": "46.5%", perubahan: "+0.8%", industri: "50.0%" },
  { ratio: "Interest Coverage", "2024": 5.79, "2023": 5.01, perubahan: "+0.78", industri: 4.50 },
];

const LiquiditySolvabilityRatiosSection: React.FC = () => (
  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
    {/* Liquidity Ratios */}
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">
          <Droplet className="inline-block h-5 w-5 mr-2 text-blue-500" /> RASIO LIKUIDITAS
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm">
              <span>Current Ratio</span>
              <span>1.43</span>
            </div>
            <Progress value={1.43 * 100 / 2} className="h-2" /> {/* Assuming max value for progress is around 2 for visualization */}
          </div>
          <div>
            <div className="flex justify-between text-sm">
              <span>Quick Ratio</span>
              <span>1.12</span>
            </div>
            <Progress value={1.12 * 100 / 2} className="h-2" />
          </div>
        </div>
        <Table className="mt-4">
          <TableHeader>
            <TableRow>
              <TableHead>Rasio</TableHead>
              <TableHead>2024</TableHead>
              <TableHead>2023</TableHead>
              <TableHead>Perubahan</TableHead>
              <TableHead>Industri</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {liquidityData.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.ratio}</TableCell>
                <TableCell>{item["2024"]}</TableCell>
                <TableCell>{item["2023"]}</TableCell>
                <TableCell
                  className={
                    item.perubahan.toString().startsWith("+")
                      ? "text-green-500"
                      : "text-red-500"
                  }
                >
                  {item.perubahan}
                </TableCell>
                <TableCell>{item.industri}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <p className="mt-4 text-sm text-gray-600 border-l-4 border-blue-500 pl-3">
          Current Ratio dan Quick Ratio di atas 1.0 menunjukkan kemampuan
          perusahaan memenuhi kewajiban jangka pendek dengan baik. Rasio
          likuiditas lebih baik dari rata-rata industri dan menunjukkan tren
          peningkatan.
        </p>
      </CardContent>
    </Card>

    {/* Solvability Ratios */}
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">
          <Scale className="inline-block h-5 w-5 mr-2 text-blue-500" /> RASIO SOLVABILITAS
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm">
              <span>Debt to Equity</span>
              <span>0.90</span>
            </div>
            <Progress value={0.90 * 100} className="h-2" /> {/* Assuming max value for progress is 1 for visualization */}
          </div>
          <div>
            <div className="flex justify-between text-sm">
              <span>Debt to Asset</span>
              <span>47.3%</span>
            </div>
            <Progress value={47.3} className="h-2" />
          </div>
        </div>
        <Table className="mt-4">
          <TableHeader>
            <TableRow>
              <TableHead>Rasio</TableHead>
              <TableHead>2024</TableHead>
              <TableHead>2023</TableHead>
              <TableHead>Perubahan</TableHead>
              <TableHead>Industri</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {solvabilityData.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.ratio}</TableCell>
                <TableCell>{item["2024"]}</TableCell>
                <TableCell>{item["2023"]}</TableCell>
                <TableCell
                  className={
                    item.perubahan.toString().startsWith("+")
                      ? "text-green-500"
                      : "text-red-500"
                  }
                >
                  {item.perubahan}
                </TableCell>
                <TableCell>{item.industri}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <p className="mt-4 text-sm text-gray-600 border-l-4 border-blue-500 pl-3">
          Rasio utang terhadap ekuitas (DER) dan utang terhadap aset masih
          dalam batas yang sehat dan di bawah rata-rata industri. Interest
          coverage ratio yang tinggi (5.79x) menunjukkan kemampuan
          perusahaan membayar bunga yang sangat baik.
        </p>
      </CardContent>
    </Card>
  </div>
);

// Activity Ratios Section
interface ActivityRatio {
  name: string;
  value: string;
  year2023: string;
  change: string;
  description: string;
  icon: React.ElementType;
}

const activityData: ActivityRatio[] = [
  {
    name: "Receivables Turnover",
    value: "5.05x",
    year2023: "4.86x",
    change: "↑ 0.19x",
    description:
      "Perputaran piutang yang baik dan meningkat, menunjukkan efisiensi penagihan.",
    icon: DollarSign,
  },
  {
    name: "Inventory Turnover",
    value: "4.78x",
    year2023: "4.52x",
    change: "↑ 0.26x",
    description:
      "Manajemen persediaan yang efektif dengan perputaran yang semakin meningkat.",
    icon: Package,
  },
  {
    name: "Asset Turnover",
    value: "0.45x",
    year2023: "0.43x",
    change: "↑ 0.02x",
    description:
      "Peningkatan efisiensi penggunaan aset untuk menghasilkan pendapatan.",
    icon: Repeat,
  },
];

const ActivityRatiosSection: React.FC = () => (
  <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
    {activityData.map((ratio) => (
      <Card key={ratio.name}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-medium">{ratio.name}</CardTitle>
          <ratio.icon className="h-6 w-6 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{ratio.value}</div>
          <p className="text-xs text-gray-500">2023: {ratio.year2023}</p>
          <p
            className={`flex items-center text-sm ${
              ratio.change.startsWith("↑") ? "text-green-500" : "text-red-500"
            }`}
          >
            {ratio.change}
          </p>
          <p className="mt-2 text-sm text-gray-600">{ratio.description}</p>
        </CardContent>
      </Card>
    ))}
  </div>
);

export function RatioTab() {
  return (
    <div className="space-y-8">
      <ProfitabilityRatiosSection />
      <LiquiditySolvabilityRatiosSection />
      <ActivityRatiosSection />
    </div>
  );
}