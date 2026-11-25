"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Field, inputClass } from "@/components/booking/fields";
import { buttonClass } from "@/components/ui/button";
import { bookingService } from "@/lib/booking-service";

export function FindBookingForm() {
  const router = useRouter();
  const [reference, setReference] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!reference.trim() || !email.trim()) {
      setError("Enter your booking reference and email.");
      return;
    }
    setBusy(true);
    const booking = await bookingService.findBooking(reference, email);
    if (!booking) {
      setBusy(false);
      setError("We could not find a booking with those details. Check them and try again.");
      return;
    }
    router.push(`/manage/booking/?token=${booking.token}`);
  }

  return (
    <form onSubmit={onSubmit} noValidate className="mt-8 space-y-5">
      <Field label="Booking reference" htmlFor="reference" hint="Six to eight characters, from your email.">
        <input id="reference" value={reference} onChange={(e) => setReference(e.target.value)} autoCapitalize="characters" className={`${inputClass} uppercase`} />
      </Field>
      <Field label="Email" htmlFor="find-email">
        <input id="find-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" className={inputClass} />
      </Field>
      {error ? <p role="alert" className="rounded-md bg-accent-soft p-3 text-sm text-danger">{error}</p> : null}
      <button type="submit" disabled={busy} className={buttonClass({ size: "lg", className: "w-full" })}>
        {busy ? "Searching…" : "Find booking"}
      </button>
    </form>
  );
}
