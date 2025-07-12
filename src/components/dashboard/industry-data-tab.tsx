import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import {
  Lightbulb,
  ShieldCheck,
  TriangleAlert,
  ArrowUp,
  ArrowDown,
  Users,
  LineChart as LineChartIcon,
  BarChart as BarChartIcon,
  DollarSign,
  Package,
  Repeat,
  MapPin,
  Handshake,
  Building,
  BookOpen,
  TrendingUp,
} from "lucide-react";

// --- Section 1: Coal Mining Business Model ---
interface BusinessModelItem {
  title: string;
  description: string;
  icon: React.ElementType;
}

const businessModelData: BusinessModelItem[] = [
  {
    title: "EKSPLORASI",
    description:
      "Survei geologi dan pengeboran untuk identifikasi cadangan batubara",
    icon: MapPin,
  },
  {
    title: "PERENCANAAN",
    description: "Desain tambang dan perencanaan operasional produksi",
    icon: BookOpen,
  },
  {
    title: "PENAMBANGAN",
    description: "Ekstraksi batubara dengan alat berat dan tenaga kerja terampil",
    icon: Package,
  },
  {
    title: "PEMROSESAN",
    description:
      "Pengolahan, penyaringan, dan peningkatan kualitas batubara",
    icon: Repeat,
  },
  {
    title: "DISTRIBUSI",
    description: "Pengiriman ke pelanggan domestik dan ekspor",
    icon: Handshake,
  },
];

interface RevenueStreamItem {
  description: string;
  percentage: string;
}

const revenueStreamsData: RevenueStreamItem[] = [
  {
    description: "Penjualan batubara kalori tinggi (6,500 - 7,200 kcal/kg)",
    percentage: "47.1%",
  },
  { description: "Penjualan alat berat", percentage: "41.4%" },
  {
    description: "Penjualan batubara kalori sedang (5,500 - 6,500 kcal/kg)",
    percentage: "11.5%",
  },
];

interface KeyPartnerItem {
  name: string;
}

const keyPartnersData: KeyPartnerItem[] = [
  { name: "PT Bohir Jaya (supplier alat berat)" },
  { name: "PT Energi Nusantara (pelanggan utama)" },
  { name: "Pemerintah Daerah Kalimantan Timur" },
  { name: "Kementerian ESDM (regulasi dan perizinan)" },
];

const BusinessModelSection: React.FC = () => (
  <Card>
    <CardHeader>
      <CardTitle>MODEL BISNIS PERTAMBANGAN BATUBARA</CardTitle>
    </CardHeader>
    <CardContent className="space-y-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-5">
        {businessModelData.map((item, index) => (
          <Card key={index} className="flex flex-col items-center text-center p-4">
            <item.icon className="h-8 w-8 text-blue-600 mb-2" />
            <h3 className="font-semibold text-md">{item.title}</h3>
            <p className="text-sm text-gray-600">{item.description}</p>
          </Card>
        ))}
      </div>

      <div className="flex flex-row gap-4 justify-between">
        <div>
          <h3 className="text-lg font-semibold mb-2">REVENUE STREAMS</h3>
          <ul className="list-disc pl-5 space-y-1">
            {revenueStreamsData.map((item, index) => (
              <li key={index} className="text-gray-700">
                {item.description}: <span className="font-medium">{item.percentage}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">KEY PARTNERS</h3>
          <ul className="list-disc pl-5 space-y-1">
            {keyPartnersData.map((item, index) => (
              <li key={index} className="text-gray-700">{item.name}</li>
            ))}
          </ul>
        </div>
      </div>
    </CardContent>
  </Card>
);

// --- Section 2: SWOT Analysis ---
interface SWOTItem {
  type: "STRENGTHS" | "WEAKNESSES" | "OPPORTUNITIES" | "THREATS";
  color: string;
  icon: React.ElementType;
  points: string[];
}

const swotData: SWOTItem[] = [
  {
    type: "STRENGTHS",
    color: "bg-green-100 border-green-500",
    icon: ShieldCheck,
    points: [
      "Lokasi strategis di Kalimantan Timur dengan konsesi tambang 15.000 hektar",
      "Pertumbuhan pendapatan yang kuat (25.9% YoY)",
      "Peningkatan margin laba bersih dari 20.5% menjadi 22.8%",
      "Portfolio produk beragam (batubara kalori tinggi dan sedang)",
      "Sertifikasi lengkap (ISO 9001, 14001, dan 45001)",
    ],
  },
  {
    type: "WEAKNESSES",
    color: "bg-red-100 border-red-500",
    icon: TriangleAlert,
    points: [
      "Rasio utang yang meningkat (DER dari 0.87 menjadi 0.90)",
      "Ketergantungan pada pelanggan utama (top 5 kontribusi > 45%)",
      "Keterbatasan kapasitas produksi saat ini (2.1 juta ton)",
      "Biaya sewa alat berat dari pihak ketiga yang tinggi",
      "Umur perusahaan relatif muda (berdiri 2018)",
    ],
  },
  {
    type: "OPPORTUNITIES",
    color: "bg-blue-100 border-blue-500",
    icon: Lightbulb,
    points: [
      "Permintaan batubara domestik yang terus meningkat untuk PLTU",
      "Perluasan pasar ekspor ke China, India, dan Korea Selatan",
      "Kebijakan pemerintah yang mendukung penggunaan energi domestik",
      "Pengembangan teknologi clean coal untuk mengurangi emisi",
      "Diversifikasi ke energi terbarukan jangka panjang",
    ],
  },
  {
    type: "THREATS",
    color: "bg-yellow-100 border-yellow-500",
    icon: ArrowDown, // Using ArrowDown as a generic threat icon
    points: [
      "Fluktuasi harga batubara global yang signifikan",
      "Regulasi lingkungan yang semakin ketat",
      "Tren global transisi ke energi terbarukan",
      "Persaingan dari perusahaan tambang besar (Adaro, Bukit Asam)",
      "Risiko geopolitik yang mempengaruhi pasar ekspor",
    ],
  },
];

const SWOTAnalysisSection: React.FC = () => (
  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
    {swotData.map((item, index) => (
      <Card key={index} className={`border-l-4 ${item.color}`}>
        <CardHeader className="flex flex-row items-center space-x-2">
          <item.icon className={`h-6 w-6 ${item.color.replace('bg-', 'text-').replace('border-', '')}`} />
          <CardTitle className="text-lg font-bold">{item.type}</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-1 text-gray-700">
            {item.points.map((point, idx) => (
              <li key={idx}>{point}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    ))}
  </div>
);

// --- Section 3: Customer Distribution and Industry Outlook ---
const customerDistributionChartData = [
  { Wilayah: "Jawa", "Total Penjualan (Miliar Rp)": 10.88, "Jumlah Pelanggan": 7 },
  { Wilayah: "Kalimantan", "Total Penjualan (Miliar Rp)": 18.19, "Jumlah Pelanggan": 5 },
  { Wilayah: "Sumatera", "Total Penjualan (Miliar Rp)": 9.28, "Jumlah Pelanggan": 4 },
  { Wilayah: "Sulawesi", "Total Penjualan (Miliar Rp)": 6.40, "Jumlah Pelanggan": 1 },
  { Wilayah: "Bali", "Total Penjualan (Miliar Rp)": 1.43, "Jumlah Pelanggan": 1 },
];

const customerDistributionTableData = [
  { Wilayah: "Jawa", "Jumlah Pelanggan": 7, "Total Penjualan": "Rp 10.88 Miliar", "Rata-rata per Pelanggan": "Rp 1.55 Miliar" },
  { Wilayah: "Kalimantan", "Jumlah Pelanggan": 5, "Total Penjualan": "Rp 18.19 Miliar", "Rata-rata per Pelanggan": "Rp 3.64 Miliar" },
  { Wilayah: "Sumatera", "Jumlah Pelanggan": 4, "Total Penjualan": "Rp 9.28 Miliar", "Rata-rata per Pelanggan": "Rp 2.32 Miliar" },
  { Wilayah: "Sulawesi", "Jumlah Pelanggan": 1, "Total Penjualan": "Rp 6.40 Miliar", "Rata-rata per Pelanggan": "Rp 6.40 Miliar" },
  { Wilayah: "Bali", "Jumlah Pelanggan": 1, "Total Penjualan": "Rp 1.43 Miliar", "Rata-rata per Pelanggan": "Rp 1.43 Miliar" },
  { Wilayah: "TOTAL", "Jumlah Pelanggan": 18, "Total Penjualan": "Rp 46.18 Miliar", "Rata-rata per Pelanggan": "Rp 2.57 Miliar" },
];

const industryOutlookChartData = [
  { month: "Jan", harga2024: 97, proyeksi2025: 102 },
  { month: "Feb", harga2024: 92, proyeksi2025: 100 },
  { month: "Mar", harga2024: 95, proyeksi2025: 103 },
  { month: "Apr", harga2024: 98, proyeksi2025: 104 },
  { month: "May", harga2024: 101, proyeksi2025: 105 },
  { month: "Jun", harga2024: 99, proyeksi2025: 106 },
  { month: "Jul", harga2024: 103, proyeksi2025: 107 },
  { month: "Aug", harga2024: 106, proyeksi2025: 108 },
  { month: "Sep", harga2024: 105, proyeksi2025: 107 },
  { month: "Oct", harga2024: 102, proyeksi2025: 105 },
  { month: "Nov", harga2024: 99, proyeksi2025: 103 },
  { month: "Dec", harga2024: 100, proyeksi2025: 102 },
];

const industryOutlookChartConfig = {
  harga2024: {
    label: "Harga Batubara 2024 ($/ton)",
    color: "#3b82f6", // A distinct blue
  },
  proyeksi2025: {
    label: "Proyeksi 2025 ($/ton)",
    color: "#22c55e", // A distinct green
  },
} satisfies ChartConfig;

const customerDistributionChartConfig = {
  totalPenjualan: {
    label: "Total Penjualan (Miliar Rp)",
    color: "#3b82f6", // A distinct blue
  },
  jumlahPelanggan: {
    label: "Jumlah Pelanggan",
    color: "#22c55e", // A distinct green
  },
} satisfies ChartConfig;

const CustomerIndustryOutlookSection: React.FC = () => (
  <div className="grid pb-6 grid-cols-1 gap-6 lg:grid-cols-2">
    {/* Customer Distribution */}
    <Card>
      <CardHeader>
        <CardTitle>DISTRIBUSI PELANGGAN</CardTitle>
        <CardDescription>Distribusi 18 Pelanggan Utama Berdasarkan Wilayah</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={customerDistributionChartConfig} className="min-h-[300px]">
          <BarChart data={customerDistributionChartData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="Wilayah" tickLine={false} tickMargin={10} axisLine={false} />
            <YAxis />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Legend />
            <Bar dataKey="Total Penjualan (Miliar Rp)" fill="var(--color-totalPenjualan)" radius={4} />
            <Bar dataKey="Jumlah Pelanggan" fill="var(--color-jumlahPelanggan)" radius={4} />
          </BarChart>
        </ChartContainer>
        <Table className="mt-4">
          <TableHeader>
            <TableRow>
              <TableHead>Wilayah</TableHead>
              <TableHead>Jumlah Pelanggan</TableHead>
              <TableHead>Total Penjualan</TableHead>
              <TableHead>Rata-rata per Pelanggan</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customerDistributionTableData.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.Wilayah}</TableCell>
                <TableCell>{item["Jumlah Pelanggan"]}</TableCell>
                <TableCell>{item["Total Penjualan"]}</TableCell>
                <TableCell>{item["Rata-rata per Pelanggan"]}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>

    {/* Industry Outlook */}
    <Card>
      <CardHeader>
        <CardTitle>PROSPEK INDUSTRI BATUBARA</CardTitle>
        <CardDescription>Tren Harga Batubara & Proyeksi</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={industryOutlookChartConfig} className="min-h-[300px]">
          <LineChart data={industryOutlookChartData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis domain={[90, 'auto']} /> {/* Lowered Y-axis scale */}
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Legend />
            <Line
              dataKey="harga2024"
              type="monotone"
              stroke="var(--color-harga2024)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="proyeksi2025"
              type="monotone"
              stroke="var(--color-proyeksi2025)"
              strokeWidth={2}
              dot={false}
              strokeDasharray="5 5"
            />
          </LineChart>
        </ChartContainer>
        <div className="mt-4 space-y-2">
          <h3 className="text-lg font-semibold">OUTLOOK INDUSTRI BATUBARA 2025-2026</h3>
          <ul className="space-y-1">
            <li className="flex items-center text-gray-700">
              <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
              Pertumbuhan Permintaan Domestik <span className="ml-auto font-medium text-green-500">+8.5%</span>
            </li>
            <li className="flex items-center text-gray-700">
              <span className="h-2 w-2 rounded-full bg-blue-500 mr-2"></span>
              Pertumbuhan Ekspor <span className="ml-auto font-medium text-blue-500">+5.2%</span>
            </li>
            <li className="flex items-center text-gray-700">
              <span className="h-2 w-2 rounded-full bg-orange-500 mr-2"></span>
              Proyeksi Harga Rata-Rata <span className="ml-auto font-medium text-orange-500">$95-105/ton</span>
            </li>
            <li className="flex items-center text-gray-700">
              <span className="h-2 w-2 rounded-full bg-red-500 mr-2"></span>
              Risiko Volatilitas Harga <span className="ml-auto font-medium text-red-500">Sedang</span>
            </li>
          </ul>
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-semibold">FAKTOR PENDUKUNG PROSPEK</h3>
          <ul className="list-disc pl-5 space-y-1 text-gray-700">
            <li>Program 35.000 MW pemerintah yang masih membutuhkan pasokan batubara</li>
            <li>Kebijakan DMO (Domestic Market Obligation) yang menjamin permintaan domestik</li>
            <li>Peraturan ekspor yang mendukung nilai tambah produk batubara</li>
            <li>Teknologi Clean Coal yang meningkatkan permintaan batubara kalori tinggi</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  </div>
);

export function IndustryDataTab() {
  return (
    <div className="space-y-8">
      <BusinessModelSection />
      <SWOTAnalysisSection />
      <CustomerIndustryOutlookSection />
    </div>
  );
}