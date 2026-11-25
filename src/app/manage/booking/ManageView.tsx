"use client";

import { BadgeCheck, Info } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { BookingSummary, bookingTitle } from "@/components/booking/BookingSummary";
import { Field, inputClass } from "@/components/booking/fields";
import { GuestsPicker } from "@/components/ui/GuestsPicker";
import { ButtonLink, buttonClass } from "@/components/ui/button";
import { airports, vehicles } from "@/data/catalog";
import { BookingError, bookingService } from "@/lib/booking-service";
import { getChangePolicy } from "@/lib/policy";
import { useBooking } from "@/lib/use-booking";
import { formatDateTime, formatMoney } from "@/lib/utils";
import type { Booking, BookingAmendment, GuestCounts, Money, ValidationErrors, VehicleType } from "@/types/booking";

type Preview = { previousTotal: Money; newTotal: Money; difference: Money };

export function ManageView() {
  const token = useSearchParams().get("token");
  const { state, reload } = useBooking(token);

  if (state.status === "loading") return <div className="h-96 animate-pulse rounded-lg bg-surface-muted" />;
  if (state.status === "missing" || !token) {
    return (
      <div className="py-16 text-center">
        <h1 className="text-[28px] font-bold">We could not find this booking</h1>
        <p className="mx-auto mt-2 max-w-md text-ink-soft">The link may be incomplete, or the booking was made in a different browser.</p>
        <div className="mt-6 flex justify-center"><ButtonLink href="/manage" size="lg">Find my booking</ButtonLink></div>
      </div>
    );
  }
  return <Loaded booking={state.booking} token={token} reload={reload} />;
}

function Loaded({ booking: b, token, reload }: { booking: Booking; token: string; reload: () => void }) {
  const policy = getChangePolicy(b);
  const [mode, setMode] = useState<"view" | "edit" | "cancel">("view");
  const [notice, setNotice] = useState("");
  const cancelled = b.status === "cancelled";

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-[28px] font-bold leading-tight tracking-[-0.02em] sm:text-[34px]">{bookingTitle(b)}</h1>
        <span className={`rounded-full px-3 py-1 text-sm font-semibold ${cancelled ? "bg-surface-muted text-ink-soft" : "bg-[#e6f4ec] text-success"}`}>
          {cancelled ? "Cancelled" : "Confirmed"}
        </span>
      </div>
      <p className="mt-1 text-ink-soft">
        Reference <span className="font-bold tracking-widest text-ink">{b.reference}</span>
      </p>

      {notice ? (
        <p role="status" className="mt-5 flex items-start gap-2 rounded-lg border border-line p-4 text-sm">
          <BadgeCheck aria-hidden className="mt-0.5 size-5 shrink-0 text-success" /> {notice}
        </p>
      ) : null}

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_340px] lg:items-start">
        <section aria-labelledby="details">
          <h2 id="details" className="text-[22px] font-bold tracking-[-0.01em]">Booking details</h2>
          <div className="mt-2"><BookingSummary booking={b} /></div>
        </section>

        <aside className="rounded-lg border border-line p-6 shadow-[0_6px_24px_rgba(0,0,0,0.1)] lg:sticky lg:top-24">
          <h2 className="font-bold">Edit or cancel</h2>
          {cancelled ? (
            <p className="mt-3 text-sm text-ink-soft">This booking was cancelled{b.cancelledAt ? ` on ${formatDateTime(new Date(b.cancelledAt))}` : ""}.</p>
          ) : (
            <>
              <p className="mt-3 flex items-start gap-2 text-sm text-ink-soft">
                <Info aria-hidden className="mt-0.5 size-4 shrink-0" />
                {policy.canAmend
                  ? `Free changes and cancellation until ${formatDateTime(policy.freeUntil)}.`
                  : policy.canCancel
                    ? "The free change window has closed. You can still cancel; any refund follows the cancellation policy."
                    : "This booking has started, so it can no longer be changed."}
              </p>
              <div className="mt-5 space-y-3">
                <button type="button" disabled={!policy.canAmend} onClick={() => setMode("edit")} className={buttonClass({ variant: "primary", size: "lg", className: "w-full" })}>
                  Edit booking
                </button>
                <button type="button" disabled={!policy.canCancel} onClick={() => setMode("cancel")} className="inline-flex h-10 w-full items-center justify-center text-sm font-semibold text-danger underline-offset-4 transition-colors hover:underline disabled:pointer-events-none disabled:opacity-40">
                  Cancel booking
                </button>
              </div>
            </>
          )}
        </aside>
      </div>

      {mode === "edit" ? (
        <EditPanel
          booking={b}
          token={token}
          onClose={() => setMode("view")}
          onDone={(msg) => {
            setMode("view");
            setNotice(msg);
            reload();
          }}
        />
      ) : null}

      {mode === "cancel" ? (
        <CancelDialog
          booking={b}
          token={token}
          refundPercent={policy.refundPercent}
          onClose={() => setMode("view")}
          onDone={(msg) => {
            setMode("view");
            setNotice(msg);
            reload();
          }}
        />
      ) : null}
    </>
  );
}

function EditPanel({ booking: b, token, onClose, onDone }: { booking: Booking; token: string; onClose: () => void; onDone: (m: string) => void }) {
  const [date, setDate] = useState(b.date);
  const [time, setTime] = useState(b.time);
  const [flight, setFlight] = useState(b.flightNumber);
  const [guests, setGuests] = useState<GuestCounts>(b.guests);
  const [address, setAddress] = useState(b.service === "lounge" ? "" : b.address);
  const [vehicle, setVehicle] = useState<VehicleType>(b.service === "to-airport" ? b.vehicle : "standard");
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [formError, setFormError] = useState("");
  const [preview, setPreview] = useState<Preview | null>(null);
  const [busy, setBusy] = useState(false);

  const amendment: BookingAmendment = {
    date,
    time,
    flightNumber: flight,
    guests,
    ...(b.service !== "lounge" ? { address } : {}),
    ...(b.service === "to-airport" ? { vehicle } : {}),
  };

  async function review() {
    setBusy(true);
    setFormError("");
    try {
      const res = await bookingService.previewAmendment(token, amendment);
      setErrors({});
      setPreview(res);
    } catch (err) {
      setPreview(null);
      if (err instanceof BookingError) {
        setErrors(err.errors);
        setFormError(err.message);
      } else setFormError("Something went wrong. Please try again.");
    }
    setBusy(false);
  }

  async function confirm() {
    setBusy(true);
    try {
      await bookingService.amendBooking(token, amendment);
      onDone("Your booking was updated. We emailed you the new details.");
    } catch (err) {
      setBusy(false);
      setFormError(err instanceof BookingError ? err.message : "Something went wrong. Please try again.");
    }
  }

  const touch = () => setPreview(null);

  return (
    <section aria-labelledby="edit" className="mt-10 rounded-xl border border-line p-6 sm:p-8">
      <h2 id="edit" className="text-[22px] font-bold tracking-[-0.01em]">Edit your booking</h2>
      <p className="mt-1 text-ink-soft">Update what you need. You will see the new price before anything is saved.</p>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <Field label="Date" htmlFor="m-date" error={errors.date}>
          <input id="m-date" type="date" value={date} onChange={(e) => { setDate(e.target.value); touch(); }} className={inputClass} aria-invalid={errors.date ? true : undefined} />
        </Field>
        <Field label="Time" htmlFor="m-time" error={errors.time}>
          <input id="m-time" type="time" value={time} onChange={(e) => { setTime(e.target.value); touch(); }} className={inputClass} aria-invalid={errors.time ? true : undefined} />
        </Field>
        <Field label="Flight number" htmlFor="m-flight" error={errors.flightNumber}>
          <input id="m-flight" value={flight} onChange={(e) => { setFlight(e.target.value); touch(); }} className={inputClass} aria-invalid={errors.flightNumber ? true : undefined} />
        </Field>
        <div>
          <span className="mb-1.5 block text-sm font-semibold">Guests</span>
          <div className="rounded-md border border-line px-3.5 py-2.5">
            <GuestsPicker value={guests} onChange={(g) => { setGuests(g); touch(); }} error={errors.guests} />
          </div>
        </div>
        {b.service !== "lounge" ? (
          <Field label="Hotel name or address" htmlFor="m-address" error={errors.address} className="sm:col-span-2">
            <input id="m-address" value={address} onChange={(e) => { setAddress(e.target.value); touch(); }} className={inputClass} aria-invalid={errors.address ? true : undefined} />
          </Field>
        ) : null}
        {b.service === "to-airport" ? (
          <Field label="Vehicle" htmlFor="m-vehicle" className="sm:col-span-2">
            <select id="m-vehicle" value={vehicle} onChange={(e) => { setVehicle(e.target.value as VehicleType); touch(); }} className={inputClass}>
              {vehicles.map((v) => <option key={v.type} value={v.type}>{v.label} ({formatMoney({ amount: v.basePrice, currency: "USD" })})</option>)}
            </select>
          </Field>
        ) : null}
      </div>

      {formError ? <p role="alert" className="mt-5 rounded-md bg-accent-soft p-3 text-sm text-danger">{formError}</p> : null}

      {preview ? (
        <dl className="mt-6 space-y-2 rounded-lg bg-surface-muted p-4 text-sm">
          <div className="flex justify-between"><dt className="text-ink-soft">Original price</dt><dd>{formatMoney(preview.previousTotal)}</dd></div>
          <div className="flex justify-between"><dt className="text-ink-soft">New price</dt><dd>{formatMoney(preview.newTotal)}</dd></div>
          <div className="flex justify-between border-t border-line pt-2 font-bold">
            <dt>Price difference</dt>
            <dd>{preview.difference.amount > 0 ? "+" : ""}{formatMoney(preview.difference)}</dd>
          </div>
          <p className="pt-1 text-xs text-ink-soft">
            {preview.difference.amount > 0 ? "The difference is charged to your card." : preview.difference.amount < 0 ? "The difference returns to your card." : "No change in price."}
          </p>
        </dl>
      ) : null}

      <div className="mt-6 flex flex-wrap gap-3">
        {preview ? (
          <button type="button" disabled={busy} onClick={confirm} className={buttonClass({ size: "lg" })}>Confirm changes</button>
        ) : (
          <button type="button" disabled={busy} onClick={review} className={buttonClass({ size: "lg" })}>Review changes</button>
        )}
        <button type="button" onClick={onClose} className={buttonClass({ variant: "secondary", size: "lg" })}>Keep original</button>
      </div>
    </section>
  );
}

function CancelDialog({ booking: b, token, refundPercent, onClose, onDone }: { booking: Booking; token: string; refundPercent: number; onClose: () => void; onDone: (m: string) => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const refund: Money = { amount: Math.round(b.total.amount * refundPercent) / 100, currency: b.total.currency };
  const airport = airports.find((a) => a.code === b.airportCode);

  async function cancel() {
    setBusy(true);
    try {
      const res = await bookingService.cancelBooking(token);
      onDone(
        res.refund.amount > 0
          ? `Your booking was cancelled. ${formatMoney(res.refund)} is on its way back to your card.`
          : "Your booking was cancelled. No refund applies.",
      );
    } catch (err) {
      setBusy(false);
      setError(err instanceof BookingError ? err.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" role="presentation">
      <div role="dialog" aria-modal="true" aria-labelledby="cancel-title" className="w-full max-w-md rounded-2xl bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
        <h2 id="cancel-title" className="text-[22px] font-bold tracking-[-0.01em]">Cancel this booking?</h2>
        <p className="mt-2 text-sm text-ink-soft">{bookingTitle(b)} · {airport?.code ?? b.airportCode} · {formatDateTime(new Date(`${b.date}T${b.time}:00`))}</p>

        <dl className="mt-5 space-y-2 rounded-lg bg-surface-muted p-4 text-sm">
          <div className="flex justify-between"><dt className="text-ink-soft">You paid</dt><dd>{formatMoney(b.total)}</dd></div>
          <div className="flex justify-between border-t border-line pt-2 font-bold"><dt>Refund</dt><dd>{formatMoney(refund)}</dd></div>
        </dl>
        <p className="mt-3 text-xs text-ink-soft">
          {refundPercent === 100 ? "You are inside the free cancellation window." : refundPercent > 0 ? `${refundPercent}% is refunded after the free window.` : "The free cancellation window has closed, so no refund applies."}
        </p>
        {error ? <p role="alert" className="mt-3 text-sm text-danger">{error}</p> : null}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className={buttonClass({ variant: "secondary", size: "lg" })}>Keep booking</button>
          <button type="button" disabled={busy} onClick={cancel} className={buttonClass({ size: "lg" })}>{busy ? "Cancelling…" : "Cancel booking"}</button>
        </div>
      </div>
    </div>
  );
}
