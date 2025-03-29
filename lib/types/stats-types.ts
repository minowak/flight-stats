import { AirportData } from "./airport-codes-types"

export type AirportStat = {
  count: number,
  data: AirportData
}

export type AirportStats = Record<string, AirportStat>
export type CountryStats = Record<string, AirportStat>

export type Stats = {
  count: number
  airportStats: AirportStats
  countryStats: CountryStats
}
