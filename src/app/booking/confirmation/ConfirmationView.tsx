"use client";

import { Check, Mail } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { BookingSummary } from "@/components/booking/BookingSummary";
import { ButtonLink } from "@/components/ui/button";
import { useBooking } from "@/lib/use-booking";

export function ConfirmationView() {
  const token = useSearchParams().get("token");
  const { state } = useBooking(token);

  if (state.status === "loading") return <div className="h-96 animate-pulse rounded-lg bg-surface-muted" />;

  if (state.status === "missing") {
    return (
      <div className="py-16 text-center">
        <h1 className="text-[28px] font-bold">We could not find this booking</h1>
        <p className="mx-auto mt-2 max-w-md text-ink-soft">
          Bookings are saved in the browser you booked from. Use the link in your confirmation email, or look it up with your reference.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <ButtonLink href="/manage" size="lg">Find my booking</ButtonLink>
          <ButtonLink href="/" variant="secondary" size="lg">Home</ButtonLink>
        </div>
      </div>
    );
  }

  const b = state.booking;

  return (
    <>
      <div className="flex items-start gap-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-full bg-success text-white">
          <Check aria-hidden className="size-6" strokeWidth={3} />
        </span>
        <div>
          <h1 className="text-[28px] font-bold leading-tight tracking-[-0.02em] sm:text-[34px]">Your booking is confirmed</h1>
          <p className="mt-1 text-ink-soft">
            Reference <span className="font-bold tracking-widest text-ink">{b.reference}</span>
          </p>
        </div>
      </div>

      <p className="mt-6 flex items-start gap-3 rounded-lg border border-line p-4 text-sm">
        <Mail aria-hidden className="mt-0.5 size-5 shrink-0" strokeWidth={1.5} />
        <span>
          We sent the confirmation to <strong>{b.contact.email}</strong>. It has a link to change or cancel your booking, no login needed.
        </span>
      </p>

      <section aria-labelledby="details" className="mt-8">
        <h2 id="details" className="text-[22px] font-bold tracking-[-0.01em]">Booking details</h2>
        <div className="mt-2"><BookingSummary booking={b} /></div>
        <div className="mt-6 flex flex-wrap gap-3">
          <ButtonLink href={`/manage/booking/?token=${b.token}`} size="lg">Manage booking</ButtonLink>
          <ButtonLink href="/" variant="secondary" size="lg">Back to home</ButtonLink>
        </div>
      </section>
    </>
  );
}
