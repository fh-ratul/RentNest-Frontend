import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Rent and payments are in Bangladeshi taka, with lakh grouping (৳2,80,000).
export function formatBDT(value: number | string, { decimals = false }: { decimals?: boolean } = {}) {
  const amount = Number(value)
  const formatted = new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: decimals ? 2 : 0,
    maximumFractionDigits: decimals ? 2 : 0,
  }).format(Number.isFinite(amount) ? amount : 0)
  return `৳${formatted}`
}
