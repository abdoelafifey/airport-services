"use client";

import { SearchX } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { LoungeCard } from "./LoungeCard";
import { ScrollRow } from "@/components/ui/ScrollRow";
import type { Airport, Lounge } from "@/types/catalog";

export function LoungeBrowser({
  airports,
  lounges,
}: {
  airports: Airport[];
  lounges: Lounge[];
}) {
  const params = useSearchParams();
  const [airport, setAirport] = useState(params.get("airport")?.toUpperCase() ?? "");

  // Carry date, time and guests forward to the details and booking pages.
  const carried = useMemo(() => {
    const q = new URLSearchParams();
    for (const key of ["date", "time", "adults", "children", "infants"]) {
      const v = params.get(key);
      if (v) q.set(key, v);
    }
    return q.toString();
  }, [params]);

  const withLounges = useMemo(
    () => airports.filter((a) => lounges.some((l) => l.airportCode === a.code)),
    [airports, lounges],
  );

  const visible = airport ? lounges.filter((l) => l.airportCode === airport) : lounges;
  const selected = airports.find((a) => a.code === airport);

  const chip = (active: boolean) =>
    `shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
      active
        ? "border-accent bg-accent-soft text-accent"
        : "border-line bg-white text-ink hover:border-ink"
    }`;

  return (
    <>
      <ScrollRow label="Filter by airport">
        <button type="button" className={chip(!airport)} aria-pressed={!airport} onClick={() => setAirport("")}>
          All airports
        </button>
        {withLounges.map((a) => (
          <button
            key={a.code}
            type="button"
            className={chip(airport === a.code)}
            aria-pressed={airport === a.code}
            onClick={() => setAirport(a.code)}
          >
            {a.city} ({a.code})
          </button>
        ))}
      </ScrollRow>

      <p className="mt-6 text-sm text-ink-soft" aria-live="polite">
        <span className="font-semibold text-ink">
          {visible.length} lounge{visible.length === 1 ? "" : "s"}
        </span>
        {selected ? ` at ${selected.name}` : ""}
      </p>

      {visible.length ? (
        <div className="mt-5 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {visible.map((lounge) => (
            <LoungeCard
              key={lounge.id}
              lounge={lounge}
              airport={airports.find((a) => a.code === lounge.airportCode)}
              query={carried}
            />
          ))}
        </div>
      ) : (
        <div className="mt-5 grid place-items-center rounded-lg border border-line py-20 text-center">
          <SearchX aria-hidden className="size-8 text-ink-faint" strokeWidth={1.5} />
          <p className="mt-4 text-lg font-bold">No lounges at this airport yet</p>
          <p className="mt-1 text-sm text-ink-soft">Try another airport.</p>
        </div>
      )}
    </>
  );
}
