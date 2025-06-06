"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ChevronRight } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, LabelList } from "recharts";
import { ChartBarMultiple } from "./chart-bar";
import { ChartDot } from "./chart-dot";
import { ChartLineDotsColors } from "./chart-line";
import { ChartPieDonut } from "./chart-pie-1";

export function ContentOverview() {
  const timeFrameOptions = [
    { value: "annual", label: "Tahunan" },
    { value: "quarterly", label: "Per-kuartal" },
  ];

  const profitConversionChartData = [
    { month: "January", visitors: 186 },
    { month: "February", visitors: 205 },
    { month: "March", visitors: -207 },
    { month: "April", visitors: 173 },
    { month: "May", visitors: -209 },
    { month: "June", visitors: 214 },
  ];
  const chartConfigProfit = {
    visitors: {
      label: "Visitors",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  const businessSourceData = [
    { sector: "Perbankan", revenue: 60, fill: "#0077B6" },
    { sector: "Konsumer", revenue: 20, fill: "#ADE8F4" },
    { sector: "Energi", revenue: 10, fill: "#03045E" },
    { sector: "Lainnya", revenue: 10, fill: "#0077B6" },
  ];

  const countryData = [
    { country: "Indonesia", revenue: 70, fill: "#0077B6" },
    { country: "Singapura", revenue: 15, fill: "#ADE8F4" },
    { country: "Malaysia", revenue: 10, fill: "#03045E" },
    { country: "Lainnya", revenue: 5, fill: "#0077B6" },
  ];

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <div className="p-6">
          <header className="mb-8">
            <h1 className="text-2xl font-bold text-[#333333]">
              Pertumbuhan dan Profitabilitas
            </h1>
            <p className="text-base text-[#333333]">
              Kinerja dan marjin perusahaan terkini
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Performance Chart Section */}
            <section className="flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-lg text-[#333333]">
                  Kinerja
                </h2>
                <ToggleGroup type="single">
                  {timeFrameOptions.map((option) => (
                    <ToggleGroupItem
                      key={option.value}
                      value={option.value}
                      className="h-[30px] px-2.5 font-bold text-[#333333] text-base"
                    >
                      {option.label}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </div>
              <Card className="border-0 shadow-none">
                <ChartBarMultiple />
              </Card>
            </section>

            {/* Profit Conversion Section */}
            <section className="flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-lg text-[#333333] max-w-[238px]">
                  Konversi pendapatan ke keuntungan
                </h2>
                <ToggleGroup type="single" defaultValue="annual">
                  {timeFrameOptions.map((option) => (
                    <ToggleGroupItem
                      key={option.value}
                      value={option.value}
                      className="h-[30px] px-2.5 font-bold text-[#333333] text-base"
                    >
                      {option.label}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </div>
              <Card className="border-0 shadow-none">
                <CardContent className="p-0">
                  <ChartContainer config={chartConfigProfit}>
                    <BarChart
                      accessibilityLayer
                      data={profitConversionChartData}
                    >
                      <CartesianGrid vertical={false} />
                      <ChartTooltip
                        cursor={false}
                        content={
                          <ChartTooltipContent hideLabel hideIndicator />
                        }
                      />
                      <Bar dataKey="visitors">
                        <LabelList
                          position="top"
                          dataKey="month"
                          fillOpacity={1}
                        />
                        {profitConversionChartData.map((item) => (
                          <Cell
                            key={item.month}
                            fill={item.visitors > 0 ? "#0077B6" : "#ADE8F4"}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </section>
          </div>
        </div>
      </Card>
      <Card>
        <div className="px-6 py-3">
          <div className="flex flex-col mb-8">
            <h1 className="font-bold text-2xl text-[#333333] ">
              Rincian Pendapatan
            </h1>
            <p className="text-base text-[#333333]">
              Arus pendapatan dan wilayah di mana bisnis memperoleh keuntungan
            </p>
          </div>

          <div className="mt-8 space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex gap-4 items-center">
                <p className="font-bold">Berdasarkan Sumber/Bisnis</p>
                <p>Periode 2024</p>
              </div>
              <div className="flex gap-4 items-center">
                <p className="font-bold">Berdasarkan Negara</p>
                <p>Periode 2024</p>
              </div>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-12 mt-4">
              <ChartPieDonut />
              <ChartPieDonut />
            </div>
            <div className="flex flex-wrap justify-center gap-8 mt-4">
              <div className="flex flex-col items-center gap-2">
                <h3 className="font-semibold text-sm">
                  Berdasarkan sumber/bisnis
                </h3>
                <div className="flex flex-wrap justify-center gap-4">
                  {businessSourceData.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-lg`}
                        style={{ backgroundColor: item.fill }}
                      />
                      <span className="text-neutral-colorstext-gray text-[14px]">
                        {item.sector} ({item.revenue}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <h3 className="font-semibold text-sm">Berdasarkan negara</h3>
                <div className="flex flex-wrap justify-center gap-4">
                  {countryData.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-lg`}
                        style={{ backgroundColor: item.fill }}
                      />
                      <span className="text-neutral-colorstext-gray text-[14px]">
                        {item.country} ({item.revenue}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
      <Card>
        <div className="px-6 py-3">
          <div className="flex flex-row items-center">
            <h1 className="font-bold text-2xl text-[#333333]">Perkiraan</h1>
            <ChevronRight className="ml-2 mt-2 w-[18px] h-[18px]" />
          </div>

          <p className="text-base text-black mb-4">
            Akurasi proyeksi dan estimasi pendapatan dan perolehan
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className="flex flex-col">
              <Card>
                <CardContent>
                  <ChartDot />
                </CardContent>
              </Card>
            </section>

            <section className="flex flex-col">
              <Card>
                <CardContent>
                  <ChartDot />
                </CardContent>
              </Card>
            </section>
          </div>

          <div className="flex flex-wrap justify-center gap-16 mt-4">
            <div className="flex items-center gap-[9px]">
              <div className={`w-3 h-3 bg-[#0077B6] rounded-lg`}></div>
              <div className="text-[#615e82] text-sm">Aktual</div>
            </div>
            <div className="flex items-center gap-[9px]">
              <div className={`w-3 h-3 bg-[#ADE8F4] rounded-lg`}></div>
              <div className="text-[#615e82] text-sm">Estimasi</div>
            </div>
          </div>
        </div>
      </Card>
      <Card>
        <div className="px-6 py-3">
          <div className="flex flex-row items-center mb-4">
            <h1 className="font-bold text-2xl text-[#333333]">
              Kesehatan Keuangan
            </h1>
            <ChevronRight className="ml-2 mt-2 w-[18px] h-[18px]" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent>
                <ChartBarMultiple />
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <ChartLineDotsColors />
              </CardContent>
            </Card>
          </div>
          <div className="flex flex-wrap justify-center gap-16 mt-4">
            <div className="flex items-center gap-[9px]">
              <div className={`w-3 h-3 bg-[#0077B6] rounded-lg`}></div>
              <div className="text-[#615e82] text-sm">Desktop</div>
            </div>
            <div className="flex items-center gap-[9px]">
              <div className={`w-3 h-3 bg-[#ADE8F4] rounded-lg`}></div>
              <div className="text-[#615e82] text-sm">Mobile</div>
            </div>
            <div className="flex items-center gap-[9px]">
              <div className={`w-3 h-3 bg-[#03045E] rounded-lg`}></div>
              <div className="text-[#615e82] text-sm">Visitors</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
