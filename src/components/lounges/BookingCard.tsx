"use client";

import { BadgeCheck } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { GuestsPicker } from "@/components/ui/GuestsPicker";
import { buttonClass } from "@/components/ui/button";
import { bookingConfig } from "@/config/booking";
import { getCutoff } from "@/lib/policy";
import { useToday } from "@/lib/use-today";
import { formatDateTime, formatMoney, money, toDateTime } from "@/lib/utils";
import type { GuestCounts } from "@/types/booking";

const num = (v: string | null, fallback: number) => {
  const n = Number(v);
  return Number.isFinite(n) && v !== null && v !== "" ? n : fallback;
};

export function BookingCard({
  loungeId,
  priceAdult,
  priceChild,
  maxStayHours,
}: {
  loungeId: string;
  priceAdult: number;
  priceChild: number;
  maxStayHours: number;
}) {
  const params = useSearchParams();
  const today = useToday();
  const [date, setDate] = useState(params.get("date") ?? "");
  const [time, setTime] = useState(params.get("time") ?? "");
  const [guests, setGuests] = useState<GuestCounts>({
    adults: Math.max(1, num(params.get("adults"), 1)),
    children: num(params.get("children"), 0),
    infants: num(params.get("infants"), 0),
  });

  const total = guests.adults * priceAdult + guests.children * priceChild;
  const startsAt = date && time ? toDateTime(date, time) : null;
  const cutoff = startsAt ? getCutoff("lounge", startsAt) : null;
  const ready = Boolean(startsAt && cutoff?.open);
  const freeUntil = startsAt
    ? new Date(startsAt.getTime() - bookingConfig.freeChangeHoursBefore * 36e5)
    : null;

  const qs = new URLSearchParams({
    date,
    time,
    adults: String(guests.adults),
    children: String(guests.children),
    infants: String(guests.infants),
  }).toString();

  const cell = "flex flex-col gap-0.5 px-3 py-2.5";
  const cellLabel = "text-[11px] font-bold uppercase tracking-wide text-ink";
  const cellInput = "w-full bg-transparent text-sm text-ink outline-none";

  return (
    <aside
      aria-label="Book this lounge"
      className="rounded-lg border border-line bg-white p-6 shadow-[0_6px_24px_rgba(0,0,0,0.12)]"
    >
      <p className="flex items-baseline gap-1.5">
        <span className="text-2xl font-bold">{formatMoney(money(priceAdult))}</span>
        <span className="text-ink-soft">per adult</span>
      </p>

      <div className="mt-5 divide-y divide-line rounded-md border border-ink">
        <div className="grid grid-cols-2 divide-x divide-line">
          <label className={cell}>
            <span className={cellLabel}>Date</span>
            <input type="date" value={date} min={today} onChange={(e) => setDate(e.target.value)} className={cellInput} />
          </label>
          <label className={cell}>
            <span className={cellLabel}>Arrival</span>
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className={cellInput} />
          </label>
        </div>
        <div className={cell}>
          <GuestsPicker value={guests} onChange={setGuests} label="GUESTS" />
        </div>
      </div>

      {cutoff && !cutoff.open ? (
        <p role="alert" className="mt-3 text-sm text-danger">
          Bookings close {cutoff.hours} hour{cutoff.hours === 1 ? "" : "s"} before arrival. Choose a later time.
        </p>
      ) : null}

      {ready ? (
        <Link href={`/lounges/${loungeId}/book?${qs}`} className={buttonClass({ size: "lg", className: "mt-4 w-full" })}>
          Book
        </Link>
      ) : (
        <button type="button" disabled className={buttonClass({ size: "lg", className: "mt-4 w-full" })}>
          Select date and time
        </button>
      )}
      <p className="mt-3 text-center text-sm text-ink-soft">You won&apos;t be charged yet</p>

      <dl className="mt-5 space-y-3 text-sm">
        {guests.adults > 0 ? (
          <div className="flex justify-between">
            <dt className="text-ink-soft underline decoration-line underline-offset-4">
              {formatMoney(money(priceAdult))} × {guests.adults} adult{guests.adults === 1 ? "" : "s"}
            </dt>
            <dd>{formatMoney(money(guests.adults * priceAdult))}</dd>
          </div>
        ) : null}
        {guests.children > 0 ? (
          <div className="flex justify-between">
            <dt className="text-ink-soft underline decoration-line underline-offset-4">
              {formatMoney(money(priceChild))} × {guests.children} child{guests.children === 1 ? "" : "ren"}
            </dt>
            <dd>{formatMoney(money(guests.children * priceChild))}</dd>
          </div>
        ) : null}
        {guests.infants > 0 ? (
          <div className="flex justify-between">
            <dt className="text-ink-soft">{guests.infants} infant{guests.infants === 1 ? "" : "s"}</dt>
            <dd className="text-success">Free</dd>
          </div>
        ) : null}
        <div className="flex justify-between border-t border-line pt-4 text-base font-bold">
          <dt>Total</dt>
          <dd>{formatMoney(money(total))}</dd>
        </div>
      </dl>

      <ul className="mt-5 space-y-2 border-t border-line pt-5 text-sm text-ink-soft">
        <li className="flex items-start gap-2">
          <BadgeCheck aria-hidden className="mt-0.5 size-4 shrink-0 text-success" />
          {freeUntil
            ? `Free cancellation until ${formatDateTime(freeUntil)}`
            : `Free cancellation until ${bookingConfig.freeChangeHoursBefore} hours before`}
        </li>
        <li className="flex items-start gap-2">
          <BadgeCheck aria-hidden className="mt-0.5 size-4 shrink-0 text-success" />
          Stay up to {maxStayHours} hours
        </li>
      </ul>
    </aside>
  );
}
