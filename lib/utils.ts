import { clsx, type ClassValue } from "clsx"
import { DateTime } from "luxon"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseDateTime(date: string, zone?: string) {
  if (zone) {
    return DateTime.fromFormat(date, "dd-MM-yyyy HH:mm", { zone })
  }
  return DateTime.fromFormat(date, "dd-MM-yyyy HH:mm")
}

export function formatDate(date: Date) {
  return DateTime.fromJSDate(date).toFormat("dd-MM-yyyy")
}

export function formatTime(date: Date) {
  return DateTime.fromJSDate(date).toFormat("HH:mm")
}
