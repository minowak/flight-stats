import { AirportChart } from "@/components/stats/airport-chart"
import { CountriesChart } from "@/components/stats/countries-chart";
import { StatsCard } from "@/components/stats/stats-card"
import { FlightDataService } from "@/lib/services/flight-data-service"
import { StatsService } from "@/lib/services/stats-service"

export default function Home() {
  const flightData = FlightDataService.fetch();
  const stats = StatsService.calculate(flightData);

  return (
    <main className="space-y-4">
      <div className="grid grid-cols-2 gap-x-4">
        <StatsCard title="Flights" value={stats.count} />
        <StatsCard title="Airports" value={Object.keys(stats.airportStats).length} />
      </div>
      <StatsCard title="Top airports">
        <AirportChart data={stats.airportStats} />
      </StatsCard>
      <StatsCard title="Top countries">
        <CountriesChart data={stats.countryStats} />
      </StatsCard>
    </main>
  );
}
