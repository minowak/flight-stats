"use client";

import { FlightData } from "@/lib/types/flight-data-types";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { Line, LineChart, XAxis } from "recharts";
import { parseDateTime } from "@/lib/utils";
import { useAtom } from "jotai";
import { selectedYearAtom } from "@/lib/atoms";
import { ALL_FLIGHTS } from "@/lib/constants";

type Props = {
  data: FlightData
}

type ChartDataPoint = {
  label: string
  count: number
}

export const FlightsChart: React.FC<Props> = ({ data }: Props) => {
  const [selectedYear] = useAtom<string>(selectedYearAtom)

  let chartData: Record<string, ChartDataPoint> = {}

  for (let flight of data.flights) {
    const d = parseDateTime(flight.departureDate)
    if (d.invalidReason) {
      continue
    }
    const key = "" + (selectedYear === ALL_FLIGHTS ? d.year : d.monthShort)

    if (!chartData[key]) {
      chartData[key] = {
        label: key,
        count: 0
      }
    }

    chartData[key].count += 1
  }

  const chartConfig = {
    desktop: {
      label: "Count",
    },
  } satisfies ChartConfig

  return (
    <div>
      <ChartContainer config={chartConfig} className="min-h-[200px] max-h-[400px] w-full">
        <LineChart data={Object.values(chartData)}>
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line dataKey="count" fill="var(--color-desktop)" radius={4} />
          <XAxis
            dataKey="label"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
}
