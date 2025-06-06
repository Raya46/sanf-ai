import { CardContent } from "@/components/ui/card";
import { Badge } from "lucide-react";
import { ChartPieDonutText } from "./chart-pie";
import { ChartBarStacked } from "./chart-stacked";

export function SectionOverview() {
  const keyMetrics = [
    {
      title: "Kapitalisasi Pasar",
      value: "542,5T",
      color: "text-[#00b4d8]",
    },
    {
      title: "Imbal hasil dividen",
      value: "8,08%",
      color: "text-[#00b4d8]",
    },
    {
      title: "Rasio Harga",
      value: "11,07",
      color: "text-[#00b4d8]",
    },
    {
      title: "EPS Dasar (TTM)",
      value: "383,93 IDR",
      color: "text-[#00b4d8]",
    },
    {
      title: "Didirikan",
      value: "1895",
      color: "text-[#00b4d8]",
    },
    {
      title: "Karyawan (FY)",
      value: "81,17k",
      color: "text-[#00b4d8]",
    },
    {
      title: "CEO",
      value: "Tegar jir",
      color: "text-[#00b4d8]",
    },
    {
      title: "Website",
      value: "sanf.co.id",
      color: "text-[#00b4d8]",
    },
  ];

  const ownershipData = [
    {
      label: "Saham yang dipegang dalam jangka waktu lama",
      value: "96,18%",
      color: "#0077b6",
    },
    { label: "Suku Bunga", value: "96,18%", color: "#03045e" },
  ];

  const capitalStructureLegend = [
    { label: "Kap Pasar", color: "#0077b6" },
    { label: "Hutang", color: "#ade8f4" },
    { label: "Suku Bunga", color: "#03045e" },
  ];

  return (
    <div>
      <CardContent className="p-4">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-4 gap-x-8 gap-y-12 mb-12">
          {keyMetrics.map((metric, index) => (
            <div key={index} className="flex flex-col">
              <h3 className="[font-family:'Inter-Bold',Helvetica] font-bold text-[#333333] text-xl mb-2">
                {metric.title}
              </h3>
              <span
                className={`[font-family:'Inter-Bold',Helvetica] font-bold ${metric.color} text-xl`}
              >
                {metric.value}
              </span>
            </div>
          ))}
        </div>

        {/* Visualizations Section */}
        <div className="grid grid-cols-2 gap-8 mt-8">
          {/* Ownership Section */}
          <div className="relative">
            <h3 className="[font-family:'Inter-Bold',Helvetica] font-bold text-[#333333] text-xl mb-4">
              Kepemilikan
            </h3>

            <ChartPieDonutText />

            {/* Ownership Legend */}
            <div className="mt-8 space-y-4">
              {ownershipData.map((item, index) => (
                <div key={index} className="flex items-center">
                  <Badge
                    className={`w-[13px] h-[13px] rounded-full bg-[${item.color}] p-0 mr-4`}
                  />
                  <div className="flex justify-between w-full">
                    <span className="[font-family:'Inter-SemiBold',Helvetica] font-semibold text-black text-[15px]">
                      {item.label}
                    </span>
                    <span className="[font-family:'Inter-SemiBold',Helvetica] font-semibold text-black text-[15px]">
                      {item.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Capital Structure Section */}
          <div className="relative">
            <h3 className="[font-family:'Inter-Bold',Helvetica] font-bold text-[#333333] text-xl mb-4">
              Struktur Modal
            </h3>

            <div className="flex justify-center">
              {/* Bar chart visualization */}
              <ChartBarStacked />
            </div>

            {/* Capital Structure Legend */}
            <div className="mt-4 space-y-4">
              {capitalStructureLegend.map((item, index) => (
                <div key={index} className="flex items-center">
                  <Badge
                    className={`w-[13px] h-[13px] rounded-full bg-[${item.color}] p-0 mr-4`}
                  />
                  <span className="[font-family:'Inter-SemiBold',Helvetica] font-semibold text-black text-sm">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </div>
  );
}
