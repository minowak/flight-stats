import { useAtom } from "jotai";
import { useUserSession } from "../user-session"
import { flightDataAtom } from "../atoms";
import { FlightData } from "../types/flight-data-types";
import { useEffect } from "react";
import { getFlights } from "../firebase/firestore";

export function useFlightData(): [FlightData, () => void] {
  const user = useUserSession(null);
  const [flightData, setFlightData] = useAtom<FlightData>(flightDataAtom)

  const refresh = () => {
    getFlights(user).then((data) => {
      setFlightData({ flights: data } as FlightData)
    });
  }

  useEffect(() => {
    refresh()
  }, [user])

  return [flightData, refresh]
}
