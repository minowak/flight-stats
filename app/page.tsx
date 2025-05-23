"use client";

import { TopAirportChart } from "@/components/stats/top-airport-chart";
import { TopCountriesChart } from "@/components/stats/top-countries-chart";
import { DistanceToTheMoon } from "@/components/stats/distance-to-the-moon";
import { StatsCard } from "@/components/stats/stats-card";
import { FlightsChart } from "@/components/stats/flights-chart";
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { selectedYearAtom } from "@/lib/atoms";
import { DateTime } from "luxon";
import { ALL_FLIGHTS } from "@/lib/constants";
import { ClockIcon, EarthIcon, MapIcon, MoonStarIcon, PlaneTakeoffIcon, SplineIcon, TableIcon, TowerControlIcon } from "lucide-react";
import { useUserSession } from "@/lib/user-session";
import { Stats } from "@/lib/types/stats-types";
import { calculateDistance, calculateStats, fetchTimeSpent } from "@/lib/actions/stats-actions";
import { FlightData } from "@/lib/types/flight-data-types";
import { useFlightData } from "@/lib/hooks/useFlightData";
import { FlightMapWrapper } from "@/components/stats/flight-map.wrapper";
import { FlightsTable } from "@/components/stats/flights-table";

export default function Home() {
  const [flightData] = useFlightData()
  const [selectedYear] = useAtom<string>(selectedYearAtom)
  const [filteredData, setFilteredData] = useState<FlightData>()

  const [time, setTime] = useState("")
  const [stats, setStats] = useState<Stats>()
  const [distance, setDistance] = useState(0)

  const user = useUserSession(null)

  useEffect(() => {
    if (filteredData) {
      fetchTimeSpent(filteredData).then(setTime)
      calculateStats(filteredData).then(setStats)
      calculateDistance(filteredData).then(setDistance)
    }
  }, [filteredData])

  useEffect(() => {
    setFilteredData(flightData)
  }, [flightData])

  useEffect(() => {
    if (flightData) {
      if (selectedYear === ALL_FLIGHTS) {
        setFilteredData(flightData)
      } else {
        const filteredFlights = flightData.flights.filter((el) => {
          const d = DateTime.fromFormat(el.departureDate, "dd-MM-yyyy HH:mm")
          return !d.invalidReason && d.year === +selectedYear
        })
        setFilteredData({
          flights: filteredFlights
        })
      }
    }
  }, [selectedYear, flightData])

  if (!user) {
    return null
  }

  return (
    <div>
      <div className="space-y-4">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-x-4 gap-4">
          <StatsCard title="Flights" icon={<PlaneTakeoffIcon />} value={stats?.count} />
          <StatsCard title="Airports" icon={<TowerControlIcon />} value={stats ? "" + Object.keys(stats?.airportStats || []).length : "0"} />
          <StatsCard title="Total distance" icon={<SplineIcon />} value={"" + distance.toLocaleString(undefined, { maximumFractionDigits: 0 }) + " km"} />
          <StatsCard title="Total time" icon={<ClockIcon />} value={time} loading={!time} />
        </div>
        <StatsCard title="Distance to the moon" icon={<MoonStarIcon />}>
          <DistanceToTheMoon distance={distance} />
        </StatsCard>
        <div className="grid md:grid-cols-2 gap-4">
          <StatsCard title="Top airports" icon={<TowerControlIcon />}>
            <TopAirportChart data={stats?.airportStats} />
          </StatsCard>
          <StatsCard title="Top countries" icon={<EarthIcon />}>
            <TopCountriesChart data={stats?.countryStats} />
          </StatsCard>
        </div>
        <StatsCard title="Flights" icon={<PlaneTakeoffIcon />}>
          <FlightsChart data={filteredData} />
        </StatsCard>
        <StatsCard title="Map" icon={<MapIcon />}>
          <FlightMapWrapper />
        </StatsCard>
        <div className="hidden sm:block">
          <StatsCard title="Flights list" icon={<TableIcon />}>
            <FlightsTable data={filteredData} />
          </StatsCard>
        </div>
      </div>
    </div>
  );
}
