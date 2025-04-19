import { parseDateTime } from "../utils"
import { ALL_FLIGHTS } from "../constants"
import { FlightData } from "../types/flight-data-types"

export const FlightDataService = {
  getYears: (data: FlightData): Record<string, number> => {
    if (!data?.flights) return {}

    const result: Record<string, number> = { [ALL_FLIGHTS]: data.flights.length }

    let prev = 0
    for (const flight of data.flights) {
      const d = parseDateTime(flight.departureDate)
      if (d.invalidReason) {
        continue
      }
      const year = "" + d.year
      if (!result[year]) {
        result[year] = 0
      }
      result[year] += 1

      if (prev > 0) {
        for (let i = prev + 1; i < d.year; i++) {
          if (!result["" + i]) {
            result["" + i] = 0
          }
        }
      }
      prev = d.year
    }

    return result
  }
}
