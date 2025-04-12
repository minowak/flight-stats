import { addDoc, collection, deleteDoc, doc, getDocs, query } from "firebase/firestore";
import { db } from "./clientApp";
import { Flight } from "../types/flight-data-types";
import { User } from "firebase/auth";

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
