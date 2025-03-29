"use client";

import { FlightData } from "@/lib/types/flight-data-types";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { Line, LineChart, XAxis } from "recharts";
import { DateTime } from "luxon";

type Props = {
  data: FlightData
}

type ChartDataPoint = {
  year: string
  count: number
}

export const FlightsChart: React.FC<Props> = ({ data }: Props) => {
  let chartData: Record<string, ChartDataPoint> = {}

  for (let flight of data.flights) {
    const d = DateTime.fromFormat(flight.departureDate, "dd-MM-yyyy HH:mm")
    const year = "" + d.year

    if (!chartData[year]) {
      chartData[year] = {
        year,
        count: 0
      }
    }

    chartData[year].count += 1
  }

  console.log(chartData)


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
            dataKey="year"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
}
