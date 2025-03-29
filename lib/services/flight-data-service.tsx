import { FlightData } from "../types/flight-data-types"
import mockData from "./mock_data.json"

export const FlightDataService = {
  fetch: (): FlightData => {
    return mockData
  },

  getYears: (): string[] => {
    return ["All", "2019", "2020"]
  }
}
