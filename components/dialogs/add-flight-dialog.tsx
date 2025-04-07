"use client";

import { PropsWithChildren, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { PlaneIcon, PlaneLandingIcon, PlaneTakeoffIcon, SaveIcon, XIcon } from "lucide-react";
import { Button } from "../ui/button";
import { AirportPicker } from "../custom/airport-picker";
import { AirportBadge } from "../custom/airport-badge";
import { DatePicker } from "../custom/date-picker";
import { formatDate, formatTime, parseDateTime } from "@/lib/utils";

type Props = {} & PropsWithChildren

export const AddFlightDialog: React.FC<Props> = ({ children }) => {
  const [origin, setOrigin] = useState("")
  const [destination, setDestination] = useState("")
  const [departureDate, setDepartureDate] = useState<Date>()
  const [arrivalDate, setArrivalDate] = useState<Date>()

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add flight</DialogTitle>
          <DialogDescription>
            Enter description for the flight
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 justify-stretch">
              {origin && <AirportBadge icon={<PlaneTakeoffIcon />} value={origin} onRemove={() => setOrigin("")} />}
              {origin && destination &&
                <>
                  <div className="border-b border-border h-[1px] flex-1" />
                  <PlaneIcon className="size-4" />
                  <div className="border-b border-border h-[1px] flex-1" />
                </>
              }
              {destination && <AirportBadge icon={<PlaneLandingIcon />} value={destination} onRemove={() => setDestination("")} />}
            </div>
            <div className="flex items-center gap-2 justify-between text-xs text-muted-foreground">
              <div>
                <div>
                  {departureDate ? formatDate(departureDate) : ""}
                </div>
                <div>
                  {departureDate ? formatTime(departureDate) : ""}
                </div>
              </div>
              <div>
                <div>
                  {arrivalDate ? formatDate(arrivalDate) : ""}
                </div>
                <div className="text-right">
                  {arrivalDate ? formatTime(arrivalDate) : ""}
                </div>
              </div>
            </div>
          </div>
          {!origin &&
            <div>
              <span className="font-semibold text-sm">Origin</span>
              <AirportPicker onValueChange={setOrigin}
              />
            </div>}
          {!destination &&
            <div>
              <span className="font-semibold text-sm">Destination</span>
              <AirportPicker onValueChange={setDestination} />
            </div>
          }
          <div className="flex justify-between items-center gap-2">
            <div>
              <span className="font-semibold text-sm">Departure</span>
              <DatePicker date={departureDate} setDate={setDepartureDate} />
            </div>
            <div>
              <span className="font-semibold text-sm">Arrival</span>
              <DatePicker date={arrivalDate} setDate={setArrivalDate} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button size="sm">
            <div className="flex items-center gap-2">
              <SaveIcon />
              Save
            </div>
          </Button>
          <Button variant="destructive" size="sm">
            <div className="flex items-center gap-2">
              <XIcon />
              Cancel
            </div>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
