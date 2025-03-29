import { FlightData } from "../types/flight-data-types"
import mockData from "./mock_data.json"
import { parseDateTime } from "../utils"
import { ALL_FLIGHTS } from "../constants"

export const FlightDataService = {
  fetch: (): FlightData => {
    return mockData
  },

  getYears: (): Record<string, number> => {
    const data = FlightDataService.fetch()
    let result: Record<string, number> = { [ALL_FLIGHTS]: data.flights.length }

    for (let flight of data.flights) {
      const d = parseDateTime(flight.departureDate)
      if (d.invalidReason) {
        continue
      }
      const year = "" + d.year
      if (!result[year]) {
        result[year] = 0
      }
      result[year] += 1
    }

    return result
  }
}
