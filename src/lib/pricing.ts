import { bookingConfig } from "@/config/booking";
import { lounges, vehicles } from "@/data/catalog";
import type { BookingInput, Quote } from "@/types/booking";
import { money } from "./utils";

/** Placeholder pricing from catalog data. The real backend will own this. */
export function getQuote(input: BookingInput): Quote {
  const lines: Quote["lines"] = [];
  const { adults, children } = input.guests;

  switch (input.service) {
    case "lounge": {
      const lounge = lounges.find((l) => l.id === input.loungeId);
      if (!lounge) break;
      if (adults) lines.push({ label: `${adults} × Adult`, amount: money(adults * lounge.priceAdult) });
      if (children) lines.push({ label: `${children} × Child`, amount: money(children * lounge.priceChild) });
      break;
    }
    case "meet-greet": {
      const { meetGreetPerAdult, meetGreetPerChild } = bookingConfig.prices;
      if (adults) lines.push({ label: `${adults} × Adult`, amount: money(adults * meetGreetPerAdult) });
      if (children) lines.push({ label: `${children} × Child`, amount: money(children * meetGreetPerChild) });
      break;
    }
    case "to-airport": {
      const vehicle = vehicles.find((v) => v.type === input.vehicle);
      if (vehicle) lines.push({ label: vehicle.label, amount: money(vehicle.basePrice) });
      break;
    }
  }

  const total = money(lines.reduce((sum, l) => sum + l.amount.amount, 0));
  return { lines, total };
}
