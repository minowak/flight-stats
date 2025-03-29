"use client";

import { PlaneIcon, PlusIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { FlightDataService } from "@/lib/services/flight-data-service";
import { useEffect, useState } from "react";

export const TopBar: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<string>()
  const years = FlightDataService.getYears()

  return (
    <menu className="p-4 border-b fixed top-0 left-0 right-0 bg-background/30 backdrop-blur-md z-50">
      <div className="flex gap-4 justify-between items-center">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <PlaneIcon />
            <div className="font-bold text-md">
              Flight Stats
            </div>
          </div>
          <div>
            <Select value={selectedYear} defaultValue={years[0]} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((option, idx) => <SelectItem key={"year_option_" + idx} value={option}>{option}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Button size="sm">
            <div className="flex gap-2 items-center">
              <PlusIcon />
              <div>Add</div>
            </div>
          </Button>
        </div>
      </div>
    </menu>
  );
}
