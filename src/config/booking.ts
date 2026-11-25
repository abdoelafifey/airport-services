import type { ServiceType } from "@/types/booking";

/**
 * Business rules. Every number here is a PLACEHOLDER taken from what competing sites
 * commonly do. The client has not confirmed any of them. Change them here, nowhere else.
 */
export const bookingConfig = {
  currency: "USD",
  locale: "en-US",

  /** Hours before the service starts that booking closes. */
  cutoffHours: {
    lounge: 1,
    "meet-greet": 24,
    "to-airport": 24,
  } satisfies Record<ServiceType, number>,

  /** Free amendments and cancellation until this many hours before the service. */
  freeChangeHoursBefore: 24,
  /** Share refunded after the free window closes (0 = no refund). */
  refundPercentAfterWindow: 0,

  /** Passenger categories, matching what competitors ask for. */
  guests: {
    childMinAge: 3,
    childMaxAge: 11,
    infantMaxAge: 2,
    maxAdults: 10,
    maxChildren: 10,
    maxInfants: 5,
  },

  /** Placeholder service fee rules. */
  prices: {
    meetGreetPerAdult: 45,
    meetGreetPerChild: 25,
  },

  /** How long a driver or greeter waits. Shown as conditions on the service pages. */
  waiting: {
    arrivalMinutes: 60,
    departureMinutes: 15,
  },
} as const;

export const serviceLabels: Record<ServiceType, string> = {
  lounge: "Airport Lounge",
  "meet-greet": "Meet & Greet",
  "to-airport": "To Airport",
};
