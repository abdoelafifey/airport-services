import { airports, lounges, vehicles } from "@/data/catalog";
import { serviceLabels } from "@/config/booking";
import { summarizeGuests } from "@/components/ui/GuestsPicker";
import { formatDateTime, formatMoney, toDateTime } from "@/lib/utils";
import type { Booking } from "@/types/booking";

export function bookingTitle(b: Booking): string {
  if (b.service === "lounge") return lounges.find((l) => l.id === b.loungeId)?.name ?? "Airport lounge";
  return serviceLabels[b.service];
}

/** Read-only details of a booking. Used by Confirmation, Manage Booking and the emails. */
export function BookingSummary({ booking: b }: { booking: Booking }) {
  const airport = airports.find((a) => a.code === b.airportCode);
  const rows: [string, string][] = [
    ["Service", serviceLabels[b.service]],
    ...(b.service === "lounge"
      ? ([["Lounge", bookingTitle(b)]] as [string, string][])
      : []),
    ["Airport", airport ? `${airport.name} (${airport.code})` : b.airportCode],
    ["Date and time", formatDateTime(toDateTime(b.date, b.time))],
    ["Flight", b.flightNumber.toUpperCase()],
    ...(b.terminal ? ([["Terminal", b.terminal]] as [string, string][]) : []),
    ...(b.service !== "lounge" ? ([["Address", b.address]] as [string, string][]) : []),
    ...(b.service === "to-airport"
      ? ([["Vehicle", vehicles.find((v) => v.type === b.vehicle)?.label ?? b.vehicle]] as [string, string][])
      : []),
    ["Guests", summarizeGuests(b.guests)],
    ["Lead passenger", b.contact.fullName],
    ["Email", b.contact.email],
    ["Phone", b.contact.phone],
    ...(b.specialRequests ? ([["Special requests", b.specialRequests]] as [string, string][]) : []),
  ];

  return (
    <dl className="divide-y divide-line-soft text-sm">
      {rows.map(([k, v]) => (
        <div key={k} className="grid gap-1 py-3 sm:grid-cols-[170px_1fr]">
          <dt className="text-ink-soft">{k}</dt>
          <dd className="font-medium">{v}</dd>
        </div>
      ))}
      <div className="grid gap-1 py-3 sm:grid-cols-[170px_1fr]">
        <dt className="text-ink-soft">Total paid</dt>
        <dd className="text-base font-bold">{formatMoney(b.total)}</dd>
      </div>
    </dl>
  );
}
