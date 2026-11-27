"use client";

import { ChevronDown, Minus, Plus, Users } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { bookingConfig } from "@/config/booking";
import type { GuestCounts } from "@/types/booking";

const { guests: limits } = bookingConfig;

const rows: {
  key: keyof GuestCounts;
  label: string;
  hint: string;
  min: number;
  max: number;
}[] = [
  { key: "adults", label: "Adults", hint: `Ages ${limits.childMaxAge + 1}+`, min: 1, max: limits.maxAdults },
  { key: "children", label: "Children", hint: `Ages ${limits.childMinAge} to ${limits.childMaxAge}`, min: 0, max: limits.maxChildren },
  { key: "infants", label: "Infants", hint: `Ages 0 to ${limits.infantMaxAge}`, min: 0, max: limits.maxInfants },
];

export function summarizeGuests(g: GuestCounts): string {
  const total = g.adults + g.children + g.infants;
  const parts = [`${total} guest${total === 1 ? "" : "s"}`];
  if (g.infants) parts.push(`${g.infants} infant${g.infants === 1 ? "" : "s"}`);
  return parts.join(", ");
}

export function GuestsPicker({
  value,
  onChange,
  label = "Guests",
  error,
  triggerClassName = "",
  gap = "gap-0.5",
}: {
  value: GuestCounts;
  onChange: (next: GuestCounts) => void;
  label?: string;
  error?: string;
  /** Extra classes that stretch the trigger over the padding of the cell it sits in, so the whole cell is clickable. */
  triggerClassName?: string;
  /** Space between the label and the value, to line up with neighbouring fields. */
  gap?: string;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const step = (key: keyof GuestCounts, delta: number, min: number, max: number) =>
    onChange({ ...value, [key]: Math.min(max, Math.max(min, value[key] + delta)) });

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
        className={`flex cursor-pointer items-end justify-between gap-3 text-left ${triggerClassName || "w-full"}`}
      >
        <span className={`flex min-w-0 flex-col items-start ${gap}`}>
          <span className="text-xs font-semibold text-ink">{label}</span>
          <span className="flex items-center gap-2 text-sm text-ink">
            <Users aria-hidden className="size-4 shrink-0 text-ink-faint" />
            <span className="truncate">{summarizeGuests(value)}</span>
          </span>
        </span>
        <ChevronDown aria-hidden strokeWidth={2.2} className={`mb-0.5 size-4 shrink-0 text-ink transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open ? (
        <div
          id={panelId}
          role="group"
          aria-label="Guests"
          className="absolute left-0 top-[calc(100%+12px)] z-30 w-72 rounded-lg border border-line bg-white p-2 shadow-[0_8px_28px_rgba(0,0,0,0.16)]"
        >
          {rows.map((row) => (
            <div key={row.key} className="flex items-center justify-between rounded-md px-3 py-3">
              <div>
                <div className="text-sm font-medium">{row.label}</div>
                <div className="text-xs text-ink-faint">{row.hint}</div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  aria-label={`Fewer ${row.label.toLowerCase()}`}
                  disabled={value[row.key] <= row.min}
                  onClick={() => step(row.key, -1, row.min, row.max)}
                  className="grid size-8 place-items-center rounded-full border border-line transition-colors hover:border-ink disabled:opacity-30 disabled:hover:border-line"
                >
                  <Minus aria-hidden className="size-4" />
                </button>
                <span className="w-4 text-center text-sm font-medium tabular-nums" aria-live="polite">
                  {value[row.key]}
                </span>
                <button
                  type="button"
                  aria-label={`More ${row.label.toLowerCase()}`}
                  disabled={value[row.key] >= row.max}
                  onClick={() => step(row.key, 1, row.min, row.max)}
                  className="grid size-8 place-items-center rounded-full border border-line transition-colors hover:border-ink disabled:opacity-30 disabled:hover:border-line"
                >
                  <Plus aria-hidden className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {error ? <p className="mt-1 text-xs text-danger">{error}</p> : null}
    </div>
  );
}
