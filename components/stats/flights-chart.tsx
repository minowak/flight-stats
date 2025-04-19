"use client";

import { FlightData } from "@/lib/types/flight-data-types";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { Area, AreaChart, XAxis } from "recharts";
import { parseDateTime } from "@/lib/utils";
import { useAtom } from "jotai";
import { selectedYearAtom } from "@/lib/atoms";
import { ALL_FLIGHTS } from "@/lib/constants";

type Props = {
  data?: FlightData
}

type ChartDataPoint = {
  label: string
  count: number
}

const getChartPoints = (data: FlightData, selectedYear: string) => {
  const chartData: Record<string, ChartDataPoint> = {}
  let prev = 0
  for (const flight of data.flights) {
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

    if (prev > 0) {
      for (let i = prev + 1; i < d.year; i++) {
        if (!chartData["" + i]) {
          chartData["" + i] = {
            label: "" + i,
            count: 0
          }
        }
      }
    }
    prev = d.year
  }
  return chartData
}

export const FlightsChart: React.FC<Props> = ({ data }: Props) => {
  const [selectedYear] = useAtom<string>(selectedYearAtom)

  if (!data?.flights) return null

  const chartData = getChartPoints(data, selectedYear)

  const chartConfig = {
    desktop: {
      label: "Count",
      color: "#7287fd",
    },
  } satisfies ChartConfig

  return (
    <div className="min-w-0">
      {Object.keys(chartData).length === 0 ? <div className="text-center text-muted-foreground italic">No flights</div> :
        <ChartContainer config={chartConfig} className="min-h-[150px] max-h-[400px] w-full">
          <AreaChart data={Object.values(chartData)}>
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area dataKey="count" fill="var(--color-desktop)" radius={4} fillOpacity={0.03} />
            <XAxis
              dataKey="label"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
          </AreaChart>
        </ChartContainer>
      }
    </div>
  );
}
