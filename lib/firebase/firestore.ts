import { addDoc, collection, getDocs, query } from "firebase/firestore";
import { db } from "./clientApp";
import { FlightData } from "../types/flight-data-types";
import { useAtom } from "jotai";
import { flightDataAtom } from "../atoms";


export async function addFlights(userId: string) {
  const [allData] = useAtom<FlightData>(flightDataAtom)

  try {
    for (let flight of allData.flights) {
      await addDoc(
        collection(db, "users", userId, "flights"),
        flight
      )
    }
  } catch (e) {
    console.log("Error adding document: ", e)
  }
}

export async function getFlights(userId: string) {
  const q = query(collection(db, "users", userId, "flights"))
  const results = await getDocs(q)
  const data = results.docs.map(doc => {
    return {
      ...doc.data()
    }
  })

  return { flights: data } as FlightData
}
