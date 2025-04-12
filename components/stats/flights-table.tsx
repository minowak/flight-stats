"use client"

import { Flight, FlightData } from "@/lib/types/flight-data-types";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "../ui/pagination";
import { useCallback, useEffect, useState } from "react";
import { ArrowDownIcon, ArrowUpIcon, SearchIcon, Trash2Icon } from "lucide-react";
import { cn, parseDateTime } from "@/lib/utils";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { removeFlight } from "@/lib/firebase/firestore";
import { useUserSession } from "@/lib/user-session";
import { toast } from "sonner";
import { useFlightData } from "@/lib/hooks/useFlightData";
import { Input } from "../ui/input";

type Props = {
  data?: FlightData
}

type SortOrder = "asc" | "desc"

export const FlightsTable: React.FC<Props> = ({ data: flightData }: Props) => {
  const pageSize = 10
  const [filteredData, setFilteredData] = useState<Flight[]>(flightData?.flights || [])
  const [offset, setOffset] = useState(0)
  const [, refresh] = useFlightData()

  const [sortBy, setSortBy] = useState<string | undefined>()
  const [order, setOrder] = useState<SortOrder | undefined>()
  const [searchTerm, setSearchTerm] = useState("")

  const user = useUserSession(null)

  const sortData = useCallback(() => {
    let sorted = flightData?.flights
    if (sortBy && order) {
      sorted = flightData?.flights.slice().sort((a, b) => {
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
    }
    const filtered = sorted?.filter((fl) => {
      const toSearch = `${fl.departureAirport} ${fl.arrivalAirport} ${fl.flightNumber}`.toLowerCase()
      return toSearch.includes(searchTerm.toLowerCase())
    })
    if (filtered) {
      setFilteredData(filtered)
    }
  }, [flightData?.flights, order, searchTerm, sortBy])

  useEffect(() => {
    sortData()
  }, [order, sortBy, searchTerm, sortData])

  if (!flightData?.flights) return

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-2 items-center">
        <SearchIcon className="text-muted-foreground" />
        <Input placeholder="Search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>
      {flightData.flights.length === 0 ?
        <div className="text-muted-foreground italic text-center">No flights</div>
        :
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
                  title="Flight no" />
              </TableHead>
              <TableHead className="text-right">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.slice(offset, offset + pageSize).map((flight, idx) => (
              <TableRow key={"flight_" + idx}>
                <TableCell>{offset + idx + 1}</TableCell>
                <TableCell>{flight.departureDate}</TableCell>
                <TableCell>{flight.arrivalDate}</TableCell>
                <TableCell>{flight.departureAirport}</TableCell>
                <TableCell>{flight.arrivalAirport}</TableCell>
                <TableCell >{flight.flightNumber}</TableCell>
                <TableCell className="flex justify-end">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Trash2Icon
                        className="text-destructive cursor-pointer" />
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remove flight?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to remove flight {flight.flightNumber}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>No</AlertDialogCancel>
                        <AlertDialogAction onClick={() => {
                          if (user && flight.id) {
                            removeFlight(user?.uid, flight.id).then(() => {
                              toast.success("Flight removed")
                              refresh()
                            }).catch(() => {
                              toast.error("Error while adding flight")
                            })
                          }
                        }}>Yes</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))
            }
          </TableBody>
        </Table>
      }
    </div>
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
