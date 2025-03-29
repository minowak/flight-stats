import { clsx, type ClassValue } from "clsx"
import { DateTime } from "luxon"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseDateTime(date: string) {
  return DateTime.fromFormat(date, "dd-MM-yyyy HH:mm")
}
