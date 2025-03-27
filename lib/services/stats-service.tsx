import { FlightData } from "../types/flight-data-types";
import { AirportStats, CountryStats, FlightsStats } from "../types/stats-types";
import { AirportCodesService } from "./airport-codes-service";

export const StatsService = {
  calculate: (data: FlightData): FlightsStats => {
    const airportStats: AirportStats = {}
    const countryStats: CountryStats = {}

    for (let flight of data.flights) {
      for (let airport of [flight.departureAirport, flight.arrivalAirport]) {
        const airportData = AirportCodesService.getByIata(airport)

        if (!airportStats[airport]) {
          airportStats[airport] = { count: 0, data: airportData }
        }
        airportStats[airport].count += 1

        const country = airportData.country_code
        if (!countryStats[country]) {
          countryStats[country] = { count: 0, data: airportData }
        }
        countryStats[country].count += 1
      }
    }

    return {
      count: data.flights.length,
      airportStats,
      countryStats
    }
  }
}
