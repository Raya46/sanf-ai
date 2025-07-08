import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface InfoCardProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export function InfoCard({ title, children, className }: InfoCardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-lg p-6 border border-gray-200",
        className
      )}
    >
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      )}
      {children}
    </div>
  );
}
