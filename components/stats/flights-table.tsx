"use client"

import { Flight, FlightData } from "@/lib/types/flight-data-types";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "../ui/pagination";
import { useEffect, useState } from "react";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { cn, parseDateTime } from "@/lib/utils";

type Props = {
  data?: FlightData
}

type SortOrder = "asc" | "desc"

export const FlightsTable: React.FC<Props> = ({ data: flightData }: Props) => {
  const pageSize = 10
  const [filteredData, setFilteredData] = useState<Flight[]>([])
  const [offset, setOffset] = useState(0)

  const [sortBy, setSortBy] = useState<string | undefined>()
  const [order, setOrder] = useState<SortOrder | undefined>()

  useEffect(() => {
    if (flightData?.flights) {
      setFilteredData(flightData.flights.slice(offset, offset + pageSize))
    }
  }, [flightData, offset, pageSize]);

  useEffect(() => {
    const sorted = flightData?.flights.slice().sort((a, b) => {
      if (sortBy === "Departure date") {
        if (order === "asc") {
          return parseDateTime(a.departureDate).toMillis() - parseDateTime(b.departureDate).toMillis()
        } else {
          return parseDateTime(b.departureDate).toMillis() - parseDateTime(a.departureDate).toMillis()
        }
      } else if (sortBy === "Arrival data") {
        if (order === "asc") {
          return parseDateTime(a.arrivalDate).toMillis() - parseDateTime(b.arrivalDate).toMillis()
        } else {
          return parseDateTime(b.arrivalDate).toMillis() - parseDateTime(a.arrivalDate).toMillis()
        }
      } else if (sortBy === "Origin") {
        if (order === "asc") {
          return a.departureAirport.localeCompare(b.departureAirport)
        } else {
          return b.departureAirport.localeCompare(a.departureAirport)
        }
      } else if (sortBy === "Destination") {
        if (order === "asc") {
          return a.arrivalAirport.localeCompare(b.arrivalAirport)
        } else {
          return b.arrivalAirport.localeCompare(a.arrivalAirport)
        }
      } else if (sortBy === "Flight no") {
        if (order === "asc") {
          return a.flightNumber.localeCompare(b.flightNumber)
        } else {
          return b.flightNumber.localeCompare(a.flightNumber)
        }
      }
      return 0
    })
    if (sorted) {
      setFilteredData(sorted.slice(offset, offset + pageSize))
    }
  }, [order, sortBy])

  if (!flightData?.flights) return

  return (
    <Table>
      <TableCaption>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious onClick={() => {
                if (offset > 0) {
                  setOffset((prev) => prev - pageSize)
                }
              }}
                className={offset <= 1 ? "pointer-events-none opacity-50" : undefined} />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext onClick={() => {
                if (offset + pageSize < flightData.flights.length) {
                  setOffset((prev) => prev + pageSize)
                }
              }}
                className={offset + pageSize >= flightData.flights.length ? "pointer-events-none opacity-50" : undefined} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">#</TableHead>
          <TableHead>
            <SortableHeader
              sortBy={sortBy}
              order={order}
              setSortBy={setSortBy}
              setOrder={setOrder}
              title="Departure date" />
          </TableHead>
          <TableHead>
            <SortableHeader
              sortBy={sortBy}
              order={order}
              setSortBy={setSortBy}
              setOrder={setOrder}
              title="Arrival date" />
          </TableHead>
          <TableHead>
            <SortableHeader
              sortBy={sortBy}
              order={order}
              setSortBy={setSortBy}
              setOrder={setOrder}
              title="Origin" />
          </TableHead>
          <TableHead>
            <SortableHeader
              sortBy={sortBy}
              order={order}
              setSortBy={setSortBy}
              setOrder={setOrder}
              title="Destination" />
          </TableHead>
          <TableHead>
            <SortableHeader
              sortBy={sortBy}
              order={order}
              setSortBy={setSortBy}
              setOrder={setOrder}
              className="justify-end"
              title="Flight no" />
          </TableHead>
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

type SortableHeaderProps = {
  title: string
  sortBy?: string
  order?: SortOrder
  setSortBy: (s: string | undefined) => void
  setOrder: (s: SortOrder | undefined) => void
  className?: string
}

const SortableHeader: React.FC<SortableHeaderProps> = ({ title, order, sortBy, setSortBy, setOrder, className }) => {
  const switchSort = () => {
    if (sortBy === title) {
      setOrder(order === "asc" ? "desc" : "asc")
    } else {
      setOrder("desc")
    }
    setSortBy(title)
  }

  return (
    <div className={cn("flex gap-2 items-center cursor-pointer select-none", className)} onClick={switchSort}>
      {title}
      {order && sortBy === title ? order === "asc" ? <ArrowUpIcon /> : <ArrowDownIcon /> : ""}
    </div>
  );
}
