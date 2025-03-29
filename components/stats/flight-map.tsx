"use client"

import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { LatLngExpression, LatLngTuple } from "leaflet";
import L from "leaflet"
import { GeodesicLine } from 'react-leaflet-geodesic';

import "leaflet/dist/leaflet.css";
import "leaflet.geodesic";
import { FlightDataService } from "@/lib/services/flight-data-service";
import { AirportCodesService } from "@/lib/services/airport-codes-service";
import { useEffect } from "react";

interface MapProps {
  posix: LatLngExpression | LatLngTuple,
  zoom: number,
}

const GeodesicComponent = () => {
  const map = useMap();
  const flightData = FlightDataService.fetch()

  useEffect(() => {
    if (!map) return;

    for (let flight of flightData.flights) {
      const origin = AirportCodesService.getByIata(flight.departureAirport)
      const destination = AirportCodesService.getByIata(flight.arrivalAirport)
      L.geodesic(
        [
          [
            [+origin.latitude, +origin.longitude],
            [+destination.latitude, +destination.longitude]],
        ],
        {
          weight: 3,
          color: "blue",
          opacity: 0.5,
          wrap: false
        }
      ).addTo(map);
    }
  }, [map]);

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
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <GeodesicComponent />
    </MapContainer>
  );
}
