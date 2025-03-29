"use client"

import { MapContainer, Polyline, TileLayer } from "react-leaflet";
import { LatLngExpression, LatLngTuple } from "leaflet";

import "leaflet/dist/leaflet.css";
import { FlightDataService } from "@/lib/services/flight-data-service";
import { AirportCodesService } from "@/lib/services/airport-codes-service";

interface MapProps {
  posix: LatLngExpression | LatLngTuple,
  zoom: number,
}

export default function FlightMap(props: MapProps) {
  const flightData = FlightDataService.fetch()

  return (
    <MapContainer
      center={props.posix}
      zoom={props.zoom}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {
        flightData.flights.map((flight, idx) => {
          const origin = AirportCodesService.getByIata(flight.departureAirport)
          const destination = AirportCodesService.getByIata(flight.arrivalAirport)

          return <Polyline
            key={"flight_path_" + idx}
            positions={[
              [+origin.latitude, +origin.longitude],
              [+destination.latitude, +destination.longitude]
            ]}
            color={'red'} />
        })
      }
    </MapContainer>
  );
}
