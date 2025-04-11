import { addDoc, collection, deleteDoc, doc, getDocs, query } from "firebase/firestore";
import { db } from "./clientApp";
import { Flight, FlightData } from "../types/flight-data-types";
import { useAtom } from "jotai";
import { flightDataAtom } from "../atoms";
import { User } from "firebase/auth";


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

export async function getFlights(user: User | null | undefined) {
  if (!user) return

  const userId = user?.uid
  const q = query(collection(db, "users", userId, "flights"))
  const results = await getDocs(q)
  const data = results.docs.map(doc => {
    return {
      id: doc.id,
      ...doc.data()
    }
  })

  return data
}

export async function addFlight(userId: string, flight: Flight) {
  const collectionRef = collection(db, "users", userId, "flights")
  return addDoc(collectionRef, flight)
}

export async function removeFlight(userId: string, id: string) {
  return deleteDoc(doc(db, "users", userId, "flights", id))
}
