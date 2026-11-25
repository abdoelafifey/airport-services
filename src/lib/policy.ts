import { bookingConfig } from "@/config/booking";
import type { Booking, ChangePolicyState, ServiceType } from "@/types/booking";
import { hoursBetween, toDateTime } from "./utils";

export function getStartsAt(booking: Pick<Booking, "date" | "time">): Date {
  return toDateTime(booking.date, booking.time);
}

/** Can a new booking still be made for a service that starts at `startsAt`? */
export function getCutoff(
  service: ServiceType,
  startsAt: Date,
  now: Date = new Date(),
): { open: boolean; closesAt: Date; hours: number } {
  const hours = bookingConfig.cutoffHours[service];
  const closesAt = new Date(startsAt.getTime() - hours * 36e5);
  return { open: now < closesAt, closesAt, hours };
}

/**
 * What the customer can still do from Manage Booking right now.
 * Free changes and cancellation end `freeChangeHoursBefore` before the service.
 */
export function getChangePolicy(
  booking: Booking,
  now: Date = new Date(),
): ChangePolicyState {
  const startsAt = getStartsAt(booking);
  const freeUntil = new Date(
    startsAt.getTime() - bookingConfig.freeChangeHoursBefore * 36e5,
  );
  const active = booking.status === "confirmed" && hoursBetween(now, startsAt) > 0;
  const inFreeWindow = now < freeUntil;

  return {
    canAmend: active && inFreeWindow,
    canCancel: active,
    refundPercent: inFreeWindow ? 100 : bookingConfig.refundPercentAfterWindow,
    freeUntil,
    startsAt,
  };
}
