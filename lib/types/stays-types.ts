export type AirportStat = {
  count: number,
  iata: string
}

export type AirportStats = Record<string, AirportStat>

export type FlightsStats = {
  count: number
  airportStats: Record<string, AirportStat>
}
