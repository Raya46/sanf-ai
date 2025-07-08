"use client";

import { BarChart, Bar, ResponsiveContainer } from "recharts";

const portfolioData = [
  { value: 20 },
  { value: 35 },
  { value: 25 },
  { value: 30 },
  { value: 45 },
  { value: 40 },
  { value: 50 },
];

export function PortfolioChart() {
  return (
    <div className="h-24">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={portfolioData}>
          <Bar dataKey="value" fill="#A855F7" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
