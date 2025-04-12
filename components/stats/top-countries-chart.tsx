"use client";

import { BarChart, Bar, XAxis } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { CountryStats } from "@/lib/types/stats-types";

type Props = {
  data?: CountryStats
  top?: number
}

export const TopCountriesChart: React.FC<Props> = ({ data, top }: Props) => {
  if (!data) return

  const chartData = Object.values(data).toSorted((a, b) => b.count - a.count).slice(0, top || 10)
  const chartConfig = {
    desktop: {
      label: "Count",
      color: "#179299",
    },
  } satisfies ChartConfig

  return (
    <div>
      <ChartContainer config={chartConfig} className="min-h-[200px] max-h-[400px] w-full">
        <BarChart data={chartData}>
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="count" fill="var(--color-desktop)" radius={4} />
          <XAxis
            dataKey="data.country_code"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
