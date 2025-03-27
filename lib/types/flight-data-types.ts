export type Flight = {
  departureDate: string;
  arrivalDate: string;
  departureAirport: string;
  arrivalAirport: string;
  flightNumber: string;
}

export type FlightData = {
  flights: Flight[];
}
