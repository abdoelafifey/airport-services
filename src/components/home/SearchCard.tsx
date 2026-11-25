"use client";

import { CalendarDays, Clock, MapPin, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { serviceNav } from "@/config/site";
import type { GuestCounts, ServiceType } from "@/types/booking";
import type { Airport } from "@/types/catalog";
import { GuestsPicker } from "@/components/ui/GuestsPicker";
import { useToday } from "@/lib/use-today";

type Props = { airports: Airport[] };

const field = "flex flex-col gap-1 px-5 py-3 text-left hover:bg-surface-muted";
const label = "text-xs font-semibold text-ink";
const input =
  "w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-faint";

export function SearchCard({ airports }: Props) {
  const router = useRouter();
  const [service, setService] = useState<ServiceType>("lounge");
  const [airport, setAirport] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [guests, setGuests] = useState<GuestCounts>({ adults: 1, children: 0, infants: 0 });
  const today = useToday();

  const active = serviceNav.find((s) => s.service === service)!;
  const isLounge = service === "lounge";

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const q = new URLSearchParams();
    if (airport) q.set("airport", airport);
    if (date) q.set("date", date);
    if (time) q.set("time", time);
    q.set("adults", String(guests.adults));
    q.set("children", String(guests.children));
    q.set("infants", String(guests.infants));
    router.push(`${active.href}?${q.toString()}`);
  }

  return (
    <form
      onSubmit={onSubmit}
      aria-label="Search airport services"
      className="rounded-lg border border-line bg-white shadow-[0_2px_16px_rgba(0,0,0,0.08)]"
    >
      <div role="tablist" aria-label="Service" className="flex gap-6 border-b border-line-soft px-5">
        {serviceNav.map((s) => (
          <button
            key={s.service}
            type="button"
            role="tab"
            aria-selected={service === s.service}
            onClick={() => setService(s.service)}
            className={`-mb-px border-b-2 py-3.5 text-sm font-semibold transition-colors ${
              service === s.service
                ? "border-accent text-ink"
                : "border-transparent text-ink-soft hover:text-ink"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="grid divide-y divide-line-soft sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-[1.4fr_1fr_0.8fr_1fr_auto] lg:divide-x">
        <label className={field}>
          <span className={label}>Airport</span>
          <span className="flex items-center gap-2">
            <MapPin aria-hidden className="size-4 shrink-0 text-ink-faint" />
            <select
              required
              value={airport}
              onChange={(e) => setAirport(e.target.value)}
              className={`${input} cursor-pointer appearance-none ${airport ? "" : "text-ink-faint"}`}
            >
              <option value="" disabled>
                Where are you flying?
              </option>
              {airports.map((a) => (
                <option key={a.code} value={a.code}>
                  {a.city} ({a.code})
                </option>
              ))}
            </select>
          </span>
        </label>

        <label className={field}>
          <span className={label}>Date</span>
          <span className="flex items-center gap-2">
            <CalendarDays aria-hidden className="size-4 shrink-0 text-ink-faint" />
            <input type="date" value={date} min={today} onChange={(e) => setDate(e.target.value)} className={input} />
          </span>
        </label>

        <label className={field}>
          <span className={label}>{isLounge ? "Arrival time" : "Time"}</span>
          <span className="flex items-center gap-2">
            <Clock aria-hidden className="size-4 shrink-0 text-ink-faint" />
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className={input} />
          </span>
        </label>

        <div className={field}>
          <GuestsPicker value={guests} onChange={setGuests} />
        </div>

        <div className="flex items-center p-3 sm:col-span-2 lg:col-span-1">
          <button
            type="submit"
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-accent px-7 text-base font-semibold text-accent-ink transition-colors hover:bg-accent-hover lg:w-auto"
          >
            <Search aria-hidden className="size-4" />
            {isLounge ? "Find lounges" : "Continue"}
          </button>
        </div>
      </div>
    </form>
  );
}
