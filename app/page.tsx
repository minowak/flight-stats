"use client";

import { TopAirportChart } from "@/components/stats/top-airport-chart";
import { TopCountriesChart } from "@/components/stats/top-countries-chart";
import { DistanceToTheMoon } from "@/components/stats/distance-to-the-moon";
import { FlightsTable } from "@/components/stats/flights-table";
import { StatsCard } from "@/components/stats/stats-card";
import { FlightsChart } from "@/components/stats/flights-chart";
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { flightDataAtom, selectedYearAtom } from "@/lib/atoms";
import { DateTime } from "luxon";
import { ALL_FLIGHTS } from "@/lib/constants";
import { ClockIcon, EarthIcon, MapIcon, MoonStarIcon, PlaneTakeoffIcon, SplineIcon, TableIcon, TowerControlIcon } from "lucide-react";
import { FlightMapWrapper } from "@/components/stats/flight-map.wrapper";
import { useUserSession } from "@/lib/user-session";
import { Stats } from "@/lib/types/stats-types";
import { calculateDistance, calculateStats, fetchTimeSpent } from "@/lib/actions/stats-actions";
import { FlightData } from "@/lib/types/flight-data-types";
import { getFlights } from "@/lib/firebase/firestore";

export default function Home() {
  const [allData, setAllData] = useAtom<FlightData>(flightDataAtom)
  const [selectedYear] = useAtom<string>(selectedYearAtom)
  const [flightData, setFlightData] = useState<FlightData>()

  const [time, setTime] = useState("")
  const [stats, setStats] = useState<Stats>()
  const [distance, setDistance] = useState(0)

  const user = useUserSession(null)

  useEffect(() => {
    if (flightData) {
      fetchTimeSpent(flightData).then(setTime)
      calculateStats(flightData).then(setStats)
      calculateDistance(flightData).then(setDistance)
    }
  }, [flightData])

  useEffect(() => {
    if (user?.uid) {
      getFlights(user.uid).then((d) => {
        setAllData(d)
        setFlightData(d)
      })
    }
  }, [user])

  useEffect(() => {
    if (allData) {
      if (selectedYear === ALL_FLIGHTS) {
        setFlightData(allData)
      } else {
        const filteredFlights = allData.flights.filter((el) => {
          const d = DateTime.fromFormat(el.departureDate, "dd-MM-yyyy HH:mm")
          return !d.invalidReason && d.year === +selectedYear
        })
        setFlightData({
          flights: filteredFlights
        })
      }
    }
  }, [selectedYear, allData])

  if (!user) {
    return null
  }

  return (
    <div className="mt-16">
      <div className="space-y-4">
        <div className="grid grid-cols-4 gap-x-4">
          <StatsCard title="Flights" icon={<PlaneTakeoffIcon />} value={stats?.count} />
          <StatsCard title="Airports" icon={<TowerControlIcon />} value={stats ? Object.keys(stats.airportStats).length : 0} />
          <StatsCard title="Total distance" icon={<SplineIcon />} value={"" + distance.toLocaleString(undefined, { maximumFractionDigits: 0 }) + " km"} />
          <StatsCard title="Total time" icon={<ClockIcon />} value={"" + time} loading={!time} />
        </div>
        <StatsCard title="Distance to the moon" icon={<MoonStarIcon />}>
          <DistanceToTheMoon distance={distance} />
        </StatsCard>
        <div className="grid grid-cols-2 gap-x-4">
          <StatsCard title="Top airports" icon={<TowerControlIcon />}>
            <TopAirportChart data={stats?.airportStats} />
          </StatsCard>
          <StatsCard title="Top countries" icon={<EarthIcon />}>
            <TopCountriesChart data={stats?.countryStats} />
          </StatsCard>
        </div>
        <StatsCard title="Flights" icon={<PlaneTakeoffIcon />}>
          <FlightsChart data={flightData} />
        </StatsCard>
        <StatsCard title="Map" icon={<MapIcon />}>
          <FlightMapWrapper />
        </StatsCard>
        <StatsCard title="Flights list" icon={<TableIcon />}>
          <FlightsTable data={flightData} />
        </StatsCard>
      </div>
    </div>
  );
}
