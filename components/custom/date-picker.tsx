import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "../ui/input"
import { DateTime } from "luxon"

type Props = {
  date?: Date;
  setDate: (d?: Date) => void;
}

export function DatePicker({ date, setDate }: Props) {

  const setMinute = (minute: number) => {
    if (!date) return;

    const newDate = DateTime.fromJSDate(date).set({ minute: minute })
    setDate(newDate.toJSDate())
  }

  const setHour = (hour: number) => {
    if (!date) return;

    const newDate = DateTime.fromJSDate(date).set({ hour: hour })
    setDate(newDate.toJSDate())
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full sm:w-[280px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 sm:flex relative z-[9999]">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
        <div className="p-4 space-y-4 flex flex-col justify-center items-center">
          <div>
            <div className="text-semibold text-xs">Hour</div>
            <Input type="number" className="w-16" max={23} min={0}
              value={date ? DateTime.fromJSDate(date).get('hour') : 0}
              onChange={(e) => setHour(parseInt(e.target.value))} />
          </div>
          <div>
            <div className="text-semibold text-xs">Minute</div>
            <Input type="number" className="w-16" max={59} min={0}
              value={date ? DateTime.fromJSDate(date).get('minute') : 0}
              onChange={(e) => setMinute(parseInt(e.target.value))} />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

