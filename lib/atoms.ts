import { atom } from "jotai";
import { ALL_FLIGHTS } from "./constants";
import { FlightData } from "./types/flight-data-types";

export const selectedYearAtom = atom(ALL_FLIGHTS)
export const flightDataAtom = atom({} as FlightData)
