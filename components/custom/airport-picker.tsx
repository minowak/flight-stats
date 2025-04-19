import { AirportCodesService } from "@/lib/services/airport-codes-service";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";

type DataType = {
  value: string;
  label: string;
}

type Props = {
  onValueChange: (v: string) => void;
}

export const AirportPicker: React.FC<Props> = ({ onValueChange }) => {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [filteredData, setFilteredData] = useState<DataType[]>([])

  const airportData = AirportCodesService.getAll()
  const data: DataType[] = []

  for (const airport of airportData) {
    data.push({
      label: airport.airport,
      value: airport.iata
    })
  }

  useEffect(() => {
    if (search.length >= 3) {
      setOpen(true)
    } else {
      setOpen(false)
    }
    const f = data.filter((el) => el.label.toUpperCase().includes(search.toUpperCase())
      || el.value.toUpperCase().includes(search.toUpperCase()))
    setFilteredData(f)
  }, [search])

  return (
    <div className="relative min-w-0 w-full">
      <Input
        className="w-full justify-between min-w-0"
        value={search}
        onChange={(s) => {
          const val = s.target.value
          setSearch(val)
        }}
      />
      {open && (
        <div className="text-sm absolute left-0 right-0 top-10 bg-background z-50 rounded-md border-border border space-y-2">
          {filteredData.map((d) =>
            <div
              key={d.value}
              className="px-4 py-2 cursor-pointer duration-150 hover:bg-primary hover:text-black rounded-md"
              onClick={() => {
                onValueChange(d.value)
                setOpen(false)
              }}
            >
              {d.label}
            </div>
          )}
          {filteredData.length === 0 && <div key="nodata" className="px-4 py-2 text-center text-muted-foreground italic">No results</div>}
        </div>
      )}
    </div>
  )
}

