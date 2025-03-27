import airportData from "@/lib/data/airport_codes.json"
import { AirportData } from "../types/airport-codes-types"

export const AirportCodesService = {
  getByIata: (iata: string): AirportData => {
    return airportData.find((el) => el.iata === iata) as AirportData
  },
}
