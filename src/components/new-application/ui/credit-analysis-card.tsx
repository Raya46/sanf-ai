import { Card, CardDescription, CardTitle } from "@/components/ui/card";

interface CreditAnalysisCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  bgColor: string;
  iconColor: string;
}

export function CreditAnalysisCard({
  title,
  description,
  icon,
  bgColor,
  iconColor,
}: CreditAnalysisCardProps) {
  return (
    <Card className="bg-[#F8FAFF] flex flex-col items-center justify-center border border-[#E0F7FA]">
      <div
        className="rounded-full p-2"
        style={{ backgroundColor: bgColor, color: iconColor }}
      >
        {icon}
      </div>
      <CardTitle>{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </Card>
  );
}
