import { bookingConfig } from "@/config/booking";
import type { Money } from "@/types/booking";

export function money(amount: number, currency: string = bookingConfig.currency): Money {
  return { amount: Math.round(amount * 100) / 100, currency };
}

export function formatMoney(value: Money): string {
  return new Intl.NumberFormat(bookingConfig.locale, {
    style: "currency",
    currency: value.currency,
    minimumFractionDigits: Number.isInteger(value.amount) ? 0 : 2,
  }).format(value.amount);
}

/** Combine a local date (YYYY-MM-DD) and time (HH:mm) into a Date. */
export function toDateTime(date: string, time: string): Date {
  return new Date(`${date}T${time}:00`);
}

export function hoursBetween(from: Date, to: Date): number {
  return (to.getTime() - from.getTime()) / 36e5;
}

export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat(bookingConfig.locale, {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function totalGuests(g: { adults: number; children: number; infants: number }): number {
  return g.adults + g.children + g.infants;
}
