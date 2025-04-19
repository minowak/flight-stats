"use client"

import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { LatLng, LatLngExpression, LatLngTuple } from "leaflet";
import L from "leaflet";

import "leaflet/dist/leaflet.css";
import "leaflet.geodesic";
import { AirportCodesService } from "@/lib/services/airport-codes-service";
import { useEffect } from "react";
import { useAtom } from "jotai";
import { flightDataAtom, selectedYearAtom } from "@/lib/atoms";
import { ALL_FLIGHTS } from "@/lib/constants";
import { parseDateTime } from "@/lib/utils";
import { FlightData } from "@/lib/types/flight-data-types";

interface MapProps {
  posix: LatLngExpression | LatLngTuple,
  zoom: number,
}

const GeodesicComponent = () => {
  const map = useMap();
  const [flightData] = useAtom<FlightData>(flightDataAtom)
  const [selectedYear] = useAtom<string>(selectedYearAtom)

  useEffect(() => {
    if (!map) return;
    if (!flightData) return;

    let points: LatLng[] = []

    let prevDestination = "";
    for (const flight of flightData?.flights) {
      const origin = AirportCodesService.getByIata(flight.departureAirport)
      const destination = AirportCodesService.getByIata(flight.arrivalAirport)

      const d = parseDateTime(flight.departureDate)

      if (d.invalidReason) {
        continue
      }

      if (selectedYear !== ALL_FLIGHTS && d.year !== +selectedYear) {
        continue
      }

      if (origin.iata !== prevDestination) {
        L.geodesic(
          points,
          {
            weight: 3,
            color: "#179299",
            opacity: 0.5,
            wrap: false
          }
        ).addTo(map)
        points = []
      }

      points.push(new LatLng(+origin.latitude, +origin.longitude))
      points.push(new LatLng(+destination.latitude, +destination.longitude))
      prevDestination = destination.iata
    }
  }, [map, flightData, selectedYear]);

  return null;
};

export default function FlightMap(props: MapProps) {

  return (
    <MapContainer
      center={props.posix}
      zoom={props.zoom}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      <GeodesicComponent />
    </MapContainer>
  );
}
