import { AirportChart } from "@/components/stats/airport-chart";
import { CountriesChart } from "@/components/stats/countries-chart";
import { DistanceToTheMoon } from "@/components/stats/distance-to-the-moon";
import { FlightsTable } from "@/components/stats/flights-table";
import { StatsCard } from "@/components/stats/stats-card";
import { FlightDataService } from "@/lib/services/flight-data-service";
import { StatsService } from "@/lib/services/stats-service";

export default function Home() {
  const flightData = FlightDataService.fetch()
  const stats = StatsService.calculate(flightData)
  const distance = StatsService.calculateDistance(flightData)

  return (
    <main className="space-y-4">
      <div className="grid grid-cols-3 gap-x-4">
        <StatsCard title="Flights" value={stats.count} />
        <StatsCard title="Airports" value={Object.keys(stats.airportStats).length} />
        <StatsCard title="Total distance" value={distance.toLocaleString(undefined, { maximumFractionDigits: 0 }) + " km"} />
      </div>
      <StatsCard title="Distance to the moon">
        <DistanceToTheMoon distance={distance} />
      </StatsCard>
      <div className="grid grid-cols-2 gap-x-4">
        <StatsCard title="Top airports">
          <AirportChart data={stats.airportStats} />
        </StatsCard>
        <StatsCard title="Top countries">
          <CountriesChart data={stats.countryStats} />
        </StatsCard>
      </div>
      <StatsCard title="Flights list">
        <FlightsTable data={flightData} />
      </StatsCard>
    </main>
  );
}
