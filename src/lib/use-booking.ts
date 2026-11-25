"use client";

import { useCallback, useEffect, useState } from "react";
import type { Booking } from "@/types/booking";
import { bookingService } from "./booking-service";

type State = { status: "loading" } | { status: "missing" } | { status: "ready"; booking: Booking };

/** Loads a booking by the token in the email link. `reload` re-reads after an amend or cancel. */
export function useBooking(token: string | null) {
  const [state, setState] = useState<State>({ status: "loading" });
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let live = true;
    if (!token) {
      Promise.resolve().then(() => live && setState({ status: "missing" }));
      return () => {
        live = false;
      };
    }
    bookingService.getBookingByToken(token).then((booking) => {
      if (live) setState(booking ? { status: "ready", booking } : { status: "missing" });
    });
    return () => {
      live = false;
    };
  }, [token, tick]);

  const reload = useCallback(() => setTick((t) => t + 1), []);
  return { state, reload };
}
