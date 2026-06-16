import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number | null | undefined, purpose?: string): string {
  if (price == null) return purpose === "BREEDING" ? "Contact breeder" : "Negotiable";
  return `${new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(price)} ₾`;
}

export function formatAge(value: number, unit: string): string {
  const u = unit.toLowerCase();
  return `${value} ${value === 1 ? u.replace(/s$/, "") : u}`;
}

// Georgian mobile: optional +995/995 prefix, then 9 digits starting with 5
export function isValidGeorgianPhone(value: string): boolean {
  const stripped = value.replace(/[\s\-()]/g, "");
  return /^(\+?995)?5\d{8}$/.test(stripped);
}
