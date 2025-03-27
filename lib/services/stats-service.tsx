import { FlightData } from "../types/flight-data-types";
import { AirportStats, FlightsStats } from "../types/stays-types";

export const StatsService = {
  calculate: (data: FlightData): FlightsStats => {
    const airportStats: AirportStats = {}

    for (let flight of data.flights) {
      for (let airport of [flight.departureAirport, flight.arrivalAirport]) {
        if (!airportStats[airport]) {
          airportStats[airport] = { count: 0, iata: airport }
        }
        airportStats[airport].count += 1
      }
    }

    return {
      count: data.flights.length,
      airportStats
    }
  }
}
