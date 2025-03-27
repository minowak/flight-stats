"use client"

import { Flight, FlightData } from "@/lib/types/flight-data-types";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../ui/pagination";
import { useEffect, useState } from "react";

type Props = {
  data: FlightData
}

export const FlightsTable: React.FC<Props> = ({ data }: Props) => {
  const pageSize = 10
  const [filteredData, setFilteredData] = useState<Flight[]>([])
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    console.log("setting from: " + offset + " to " + (offset + pageSize))
    setFilteredData(data.flights.slice(offset, offset + pageSize))
  }, [data, offset, pageSize]);

  return (
    <Table>
      <TableCaption>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              {offset > 0 &&
                <PaginationPrevious onClick={() => setOffset((prev) => prev - pageSize)} />
              }
            </PaginationItem>
            <PaginationItem>
              {offset + pageSize < data.flights.length &&
                <PaginationNext onClick={() => setOffset((prev) => prev + pageSize)} />
              }
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">#</TableHead>
          <TableHead>Departure date</TableHead>
          <TableHead>Arrival date</TableHead>
          <TableHead>Origin</TableHead>
          <TableHead>Destination</TableHead>
          <TableHead className="text-right">Flight no</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredData.map((flight, idx) => (
          <TableRow key={"flight_" + idx}>
            <TableCell>{offset + idx + 1}</TableCell>
            <TableCell>{flight.departureDate}</TableCell>
            <TableCell>{flight.arrivalDate}</TableCell>
            <TableCell>{flight.departureAirport}</TableCell>
            <TableCell>{flight.arrivalAirport}</TableCell>
            <TableCell className="text-right">{flight.flightNumber}</TableCell>
          </TableRow>
        ))
        }
      </TableBody>
    </Table>
  );
}
