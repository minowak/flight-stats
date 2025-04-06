"use server"

import { Duration, Interval } from "luxon";
import { FlightData } from "../types/flight-data-types";
import { AirportStats, CountryStats, Stats } from "../types/stats-types";
import { AirportCodesService } from "../services/airport-codes-service";
import { find as findTimezone } from "geo-tz";
import { parseDateTime } from "../utils";

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Earth's radius in kilometers
  const toRad = (deg: number) => deg * (Math.PI / 180);

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in kilometers
}

export async function calculateStats(data: FlightData): Promise<Stats> {
  const airportStats: AirportStats = {}
  const countryStats: CountryStats = {}

  if (data?.flights) {
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
  }

  return {
    count: data?.flights?.length,
    airportStats,
    countryStats
  }
}

export async function calculateDistance(data: FlightData) {
  let total = 0
  if (data?.flights) {
    for (let flight of data.flights) {
      const origin = AirportCodesService.getByIata(flight.departureAirport)
      const destination = AirportCodesService.getByIata(flight.arrivalAirport)

      const x1 = origin.latitude
      const y1 = origin.longitude

      const x2 = destination.latitude
      const y2 = destination.longitude

      total += getDistance(+x1, +y1, +x2, +y2)
    }
  }

  return total
}

export async function fetchTimeSpent(data: FlightData) {
  let result = Duration.fromMillis(0)

  if (data?.flights) {
    for (let flight of data.flights) {
      const origin = AirportCodesService.getByIata(flight.departureAirport)
      const destination = AirportCodesService.getByIata(flight.arrivalAirport)
      try {
        const originTz = await findTimezone(+origin.latitude, +origin.longitude)
        const destinationTz = await findTimezone(+destination.latitude, +destination.longitude)

        const originDate = parseDateTime(flight.departureDate, originTz[0])
        const destinationDate = parseDateTime(flight.arrivalDate, destinationTz[0])

        const interval = Interval.fromDateTimes(originDate, destinationDate)
        result = result.plus(interval.toDuration())
      } catch {
        console.error("Error while calculating interval")
      }
    }
  }

  return result.shiftTo("days", "hours", "minutes").toHuman({
    unitDisplay: "short"
  })
}
