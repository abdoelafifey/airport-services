"use client";

import { BadgeCheck, Lock } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useRef, useState, type FormEvent } from "react";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import { GuestsPicker } from "@/components/ui/GuestsPicker";
import { buttonClass } from "@/components/ui/button";
import { bookingConfig, serviceLabels } from "@/config/booking";
import { BookingError, bookingService } from "@/lib/booking-service";
import { getCutoff } from "@/lib/policy";
import { getQuote } from "@/lib/pricing";
import { useToday } from "@/lib/use-today";
import { formatDateTime, formatMoney, toDateTime } from "@/lib/utils";
import { validateBookingInput } from "@/lib/validation";
import type {
  BookingInput,
  GuestCounts,
  ServiceType,
  ValidationErrors,
  VehicleType,
} from "@/types/booking";
import type { Airport, Lounge, Vehicle } from "@/types/catalog";
import { Field, FormSection, inputClass, selectClass } from "./fields";

type Props = {
  service: ServiceType;
  airports: Airport[];
  vehicles: Vehicle[];
  /** Lounge flow: the lounge is chosen on the previous page */
  lounge?: Lounge;
  photo?: string;
};

const num = (v: string | null, fallback: number) => {
  const n = Number(v);
  return v !== null && v !== "" && Number.isFinite(n) ? n : fallback;
};

export function BookingForm({ service, airports, vehicles, lounge, photo }: Props) {
  const router = useRouter();
  const params = useSearchParams();
  const today = useToday();
  const formRef = useRef<HTMLFormElement>(null);

  const [airportCode, setAirportCode] = useState(lounge?.airportCode ?? params.get("airport") ?? "");
  const [date, setDate] = useState(params.get("date") ?? "");
  const [time, setTime] = useState(params.get("time") ?? "");
  const [flight, setFlight] = useState("");
  const [terminal, setTerminal] = useState("");
  const [guests, setGuests] = useState<GuestCounts>({
    adults: Math.max(1, num(params.get("adults"), 1)),
    children: num(params.get("children"), 0),
    infants: num(params.get("infants"), 0),
  });
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [luggage, setLuggage] = useState(service === "to-airport" ? 1 : 0);
  const [vehicle, setVehicle] = useState<VehicleType>("standard");
  const [requests, setRequests] = useState("");
  const [card, setCard] = useState({ number: "", exp: "", cvc: "" });
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [formError, setFormError] = useState("");
  const [busy, setBusy] = useState(false);

  const airport = airports.find((a) => a.code === airportCode);
  const isLounge = service === "lounge";
  const dateLabel = service === "to-airport" ? "Pickup date" : isLounge ? "Date" : "Arrival date";
  const timeLabel = service === "to-airport" ? "Pickup time" : isLounge ? "Arrival time" : "Landing time";

  const input: BookingInput = useMemo(() => {
    const base = {
      airportCode,
      date,
      time,
      flightNumber: flight,
      terminal: terminal || undefined,
      guests,
      contact: { fullName, email, phone },
      specialRequests: requests || undefined,
    };
    if (service === "lounge") return { ...base, service, loungeId: lounge?.id ?? "" };
    if (service === "meet-greet") return { ...base, service, address, luggageCount: luggage };
    return { ...base, service, address, vehicle, luggageCount: luggage };
  }, [service, lounge, airportCode, date, time, flight, terminal, guests, fullName, email, phone, address, luggage, vehicle, requests]);

  const quote = getQuote(input);
  const startsAt = date && time ? toDateTime(date, time) : null;
  const cutoff = startsAt ? getCutoff(service, startsAt) : null;
  const freeUntil = startsAt
    ? new Date(startsAt.getTime() - bookingConfig.freeChangeHoursBefore * 36e5)
    : null;

  function validateCard(): ValidationErrors {
    const e: ValidationErrors = {};
    if (card.number.replace(/\D/g, "").length < 13) e.cardNumber = "Enter your card number.";
    if (!/^(0[1-9]|1[0-2])\s?\/\s?\d{2}$/.test(card.exp.trim())) e.cardExp = "Use MM / YY.";
    if (!/^\d{3,4}$/.test(card.cvc.trim())) e.cardCvc = "Enter the 3 or 4 digit code.";
    return e;
  }

  function focusFirst(e: ValidationErrors) {
    const order = ["airportCode", "date", "time", "flightNumber", "guests", "address", "vehicle", "fullName", "email", "phone", "cardNumber", "cardExp", "cardCvc", "terms"];
    const first = order.find((k) => e[k]);
    if (!first) return;
    const el = formRef.current?.querySelector<HTMLElement>(`[data-field="${first}"]`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    el?.focus({ preventScroll: true });
  }

  async function onSubmit(ev: FormEvent) {
    ev.preventDefault();
    setFormError("");
    const found: ValidationErrors = { ...validateBookingInput(input), ...validateCard() };
    if (!terms) found.terms = "Accept the terms to continue.";
    setErrors(found);
    if (Object.keys(found).length) {
      focusFirst(found);
      return;
    }
    setBusy(true);
    try {
      // Card details are never stored or sent: the real gateway will own this step.
      const booking = await bookingService.createBooking(input, { termsAccepted: terms });
      router.push(`/booking/confirmation/?token=${booking.token}`);
    } catch (err) {
      setBusy(false);
      if (err instanceof BookingError) {
        setErrors(err.errors);
        setFormError(err.message);
        focusFirst(err.errors);
      } else {
        setFormError("Something went wrong. Please try again.");
      }
    }
  }

  const invalid = (k: string) => (errors[k] ? true : undefined);
  const clear = (k: string) => () =>
    setErrors((prev) => {
      if (!prev[k]) return prev;
      const next = { ...prev };
      delete next[k];
      return next;
    });
  const common = (k: string) => ({
    onInput: clear(k),
    "data-field": k,
    "aria-invalid": invalid(k),
    "aria-describedby": errors[k] ? `${k}-error` : undefined,
  });

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="grid gap-12 lg:grid-cols-[1fr_390px] lg:items-start">
      <div>
        <FormSection title="Trip details">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Airport" htmlFor="airportCode" error={errors.airportCode} className="sm:col-span-2">
              <select
                id="airportCode"
                {...common("airportCode")}
                value={airportCode}
                disabled={Boolean(lounge)}
                onChange={(e) => setAirportCode(e.target.value)}
                className={`${selectClass} disabled:bg-surface-muted`}
              >
                <option value="" disabled>Choose an airport</option>
                {airports.map((a) => (
                  <option key={a.code} value={a.code}>{a.name} ({a.code})</option>
                ))}
              </select>
            </Field>
            <Field label={dateLabel} htmlFor="date" error={errors.date}>
              <input id="date" type="date" {...common("date")} min={today} value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} />
            </Field>
            <Field label={timeLabel} htmlFor="time" error={errors.time}>
              <input id="time" type="time" {...common("time")} value={time} onChange={(e) => setTime(e.target.value)} className={inputClass} />
            </Field>
            <Field label="Flight number" htmlFor="flightNumber" error={errors.flightNumber} hint="For example MS 777. We use it to track delays.">
              <input id="flightNumber" {...common("flightNumber")} value={flight} onChange={(e) => setFlight(e.target.value)} autoComplete="off" placeholder="MS 777" className={inputClass} />
            </Field>
            <Field label="Terminal" htmlFor="terminal" optional>
              <select id="terminal" value={terminal} onChange={(e) => setTerminal(e.target.value)} className={selectClass}>
                <option value="">Not sure</option>
                {(airport?.terminals ?? []).map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </Field>
          </div>
          {cutoff && !cutoff.open ? (
            <p role="alert" className="mt-4 text-sm text-danger">
              Bookings for {serviceLabels[service]} close {cutoff.hours} hour{cutoff.hours === 1 ? "" : "s"} before the service. Choose a later time.
            </p>
          ) : null}
        </FormSection>

        {service !== "lounge" ? (
          <FormSection
            title={service === "meet-greet" ? "Where should we take you?" : "Where should we pick you up?"}
            description={service === "meet-greet" ? "Your greeter meets you at arrivals and takes you to this address." : "Your driver collects you from this address."}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Hotel name or address" htmlFor="address" error={errors.address} className="sm:col-span-2">
                <input id="address" {...common("address")} value={address} onChange={(e) => setAddress(e.target.value)} autoComplete="street-address" className={inputClass} />
              </Field>
              <Field label="Bags" htmlFor="luggage" hint={service === "to-airport" ? "Large suitcases that need space in the boot." : undefined} optional={service === "meet-greet"}>
                <input id="luggage" type="number" min={0} max={20} value={luggage} onChange={(e) => setLuggage(Math.max(0, Number(e.target.value) || 0))} className={inputClass} />
              </Field>
            </div>
            {service === "to-airport" ? (
              <fieldset className="mt-6">
                <legend className="mb-2 text-sm font-semibold">Vehicle</legend>
                <div data-field="vehicle" tabIndex={-1} className="grid gap-3 sm:grid-cols-3">
                  {vehicles.map((v) => (
                    <label
                      key={v.type}
                      className={`cursor-pointer rounded-lg border p-4 transition-colors ${vehicle === v.type ? "border-ink shadow-[0_0_0_1px_var(--ink)]" : "border-line hover:border-ink"}`}
                    >
                      <input type="radio" name="vehicle" value={v.type} checked={vehicle === v.type} onChange={() => setVehicle(v.type)} className="sr-only" />
                      <span className="block font-semibold">{v.label}</span>
                      <span className="mt-1 block text-sm text-ink-soft">Up to {v.capacity} passengers, {v.luggage} bags</span>
                      <span className="mt-3 block font-bold">{formatMoney({ amount: v.basePrice, currency: bookingConfig.currency })}</span>
                    </label>
                  ))}
                </div>
                {errors.vehicle ? <p role="alert" className="mt-1.5 text-sm text-danger">{errors.vehicle}</p> : null}
              </fieldset>
            ) : null}
          </FormSection>
        ) : null}

        <FormSection title="Guests">
          <div className="max-w-sm rounded-md border border-line px-3.5 py-2.5">
            <GuestsPicker value={guests} onChange={(g) => { setGuests(g); clear("guests")(); }} error={errors.guests} triggerClassName="-mx-3.5 -my-2.5 w-[calc(100%+1.75rem)] px-3.5 py-2.5" />
          </div>
        </FormSection>

        <FormSection title="Lead passenger" description="Your confirmation and the link to manage this booking go to this email.">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Full name" htmlFor="fullName" error={errors.fullName} className="sm:col-span-2">
              <input id="fullName" {...common("fullName")} value={fullName} onChange={(e) => setFullName(e.target.value)} autoComplete="name" className={inputClass} />
            </Field>
            <Field label="Email" htmlFor="email" error={errors.email}>
              <input id="email" type="email" {...common("email")} value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" className={inputClass} />
            </Field>
            <Field label="Phone" htmlFor="phone" error={errors.phone} hint={service === "lounge" ? undefined : "Your greeter or driver may call you."}>
              <input id="phone" type="tel" {...common("phone")} value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" className={inputClass} />
            </Field>
            <Field label="Special requests" htmlFor="requests" optional className="sm:col-span-2">
              <textarea id="requests" rows={3} value={requests} onChange={(e) => setRequests(e.target.value)} placeholder="Wheelchair assistance, dietary needs, anything we should know" className={`${inputClass} h-auto py-3`} />
            </Field>
          </div>
        </FormSection>

        <FormSection title="Payment" description="Demo checkout: nothing is charged and card details are not stored.">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Card number" htmlFor="cardNumber" error={errors.cardNumber} className="sm:col-span-2">
              <input id="cardNumber" inputMode="numeric" autoComplete="cc-number" placeholder="1234 5678 9012 3456" {...common("cardNumber")} value={card.number} onChange={(e) => setCard({ ...card, number: e.target.value })} className={inputClass} />
            </Field>
            <Field label="Expiry" htmlFor="cardExp" error={errors.cardExp}>
              <input id="cardExp" autoComplete="cc-exp" placeholder="MM / YY" {...common("cardExp")} value={card.exp} onChange={(e) => setCard({ ...card, exp: e.target.value })} className={inputClass} />
            </Field>
            <Field label="Security code" htmlFor="cardCvc" error={errors.cardCvc}>
              <input id="cardCvc" inputMode="numeric" autoComplete="cc-csc" placeholder="123" {...common("cardCvc")} value={card.cvc} onChange={(e) => setCard({ ...card, cvc: e.target.value })} className={inputClass} />
            </Field>
          </div>
        </FormSection>
      </div>

      {/* Summary */}
      <aside className="rounded-lg border border-line bg-white p-6 shadow-[0_6px_24px_rgba(0,0,0,0.12)] lg:sticky lg:top-24">
        <div className="flex gap-4">
          <PhotoPlaceholder src={photo} alt="" className="size-20 shrink-0 rounded-lg" />
          <div className="min-w-0">
            <p className="text-sm text-ink-soft">{serviceLabels[service]}</p>
            <h2 className="font-bold leading-snug">{lounge?.name ?? (airport ? airport.name : "Choose an airport")}</h2>
            {lounge ? <p className="text-sm text-ink-soft">{lounge.terminal}</p> : null}
          </div>
        </div>

        {startsAt && !Number.isNaN(startsAt.getTime()) ? (
          <p className="mt-4 text-sm">{formatDateTime(startsAt)}</p>
        ) : null}

        <dl className="mt-5 space-y-2.5 border-t border-line pt-5 text-sm">
          {quote.lines.length ? (
            quote.lines.map((l) => (
              <div key={l.label} className="flex justify-between gap-3">
                <dt className="text-ink-soft">{l.label}</dt>
                <dd>{formatMoney(l.amount)}</dd>
              </div>
            ))
          ) : (
            <p className="text-ink-soft">Your price appears here.</p>
          )}
          {guests.infants ? (
            <div className="flex justify-between"><dt className="text-ink-soft">{guests.infants} × Infant</dt><dd className="text-success">Free</dd></div>
          ) : null}
          <div className="flex justify-between border-t border-line pt-4 text-base font-bold">
            <dt>Total</dt>
            <dd>{formatMoney(quote.total)}</dd>
          </div>
        </dl>

        <p className="mt-4 flex items-start gap-2 text-sm text-ink-soft">
          <BadgeCheck aria-hidden className="mt-0.5 size-4 shrink-0 text-success" />
          {freeUntil
            ? `Free cancellation until ${formatDateTime(freeUntil)}`
            : `Free cancellation until ${bookingConfig.freeChangeHoursBefore} hours before`}
        </p>

        <label className="mt-5 flex cursor-pointer items-start gap-3 text-sm">
          <input
            type="checkbox"
            data-field="terms"
            checked={terms}
            onChange={(e) => setTerms(e.target.checked)}
            aria-invalid={invalid("terms")}
            className="mt-0.5 size-5 shrink-0 accent-[var(--accent)]"
          />
          <span>
            I accept the <a href="/terms/" target="_blank" className="font-semibold underline underline-offset-2">Terms</a> and the{" "}
            <a href="/cancellation-policy/" target="_blank" className="font-semibold underline underline-offset-2">Cancellation policy</a>.
          </span>
        </label>
        {errors.terms ? <p role="alert" className="mt-1.5 text-sm text-danger">{errors.terms}</p> : null}

        {formError ? <p role="alert" className="mt-4 rounded-md bg-accent-soft p-3 text-sm text-danger">{formError}</p> : null}

        <button type="submit" disabled={busy} className={buttonClass({ size: "lg", className: "mt-5 w-full" })}>
          <Lock aria-hidden className="size-4" />
          {busy ? "Processing…" : `Pay ${formatMoney(quote.total)}`}
        </button>
        <p className="mt-3 text-center text-sm text-ink-soft">Confirmation goes to your email straight away.</p>
      </aside>
    </form>
  );
}
