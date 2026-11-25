import { siteConfig } from "@/config/site";
import { formatDateTime, formatMoney, toDateTime } from "@/lib/utils";
import type { EmailKind } from "@/lib/email";
import type { Booking } from "@/types/booking";
import { bookingTitle } from "./BookingSummary";

const copy: Record<EmailKind, { title: string; intro: string; cta: string }> = {
  confirmation: {
    title: "Your booking is confirmed",
    intro: "Thank you for booking with us. Everything is confirmed, nothing more to do.",
    cta: "Manage booking",
  },
  amendment: {
    title: "Your booking was updated",
    intro: "We have saved your changes. Here are the new details.",
    cta: "View booking",
  },
  cancellation: {
    title: "Your booking was cancelled",
    intro: "Your booking has been cancelled. If a refund applies, it returns to your original payment method.",
    cta: "View booking",
  },
};

/** Visual template of the 3 emails. The real backend renders the same layout as HTML email. */
export function EmailTemplate({
  kind,
  booking: b,
  manageUrl,
}: {
  kind: EmailKind;
  booking: Booking;
  manageUrl: string;
}) {
  const c = copy[kind];
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-white text-left">
      <div className="border-b border-line-soft px-6 py-4 text-lg font-bold text-accent">{siteConfig.name}</div>
      <div className="px-6 py-6">
        <h3 className="text-xl font-bold">{c.title}</h3>
        <p className="mt-2 text-sm text-ink-soft">Hi {b.contact.fullName.split(" ")[0]}, {c.intro}</p>

        <div className="mt-5 rounded-lg bg-surface-muted p-4">
          <p className="text-xs text-ink-soft">Booking reference</p>
          <p className="text-lg font-bold tracking-widest">{b.reference}</p>
          <p className="mt-3 text-sm font-semibold">{bookingTitle(b)}</p>
          <p className="text-sm text-ink-soft">{formatDateTime(toDateTime(b.date, b.time))}</p>
          <p className="text-sm text-ink-soft">Flight {b.flightNumber.toUpperCase()} · {b.airportCode}</p>
          <p className="mt-3 text-sm">Total <span className="font-bold">{formatMoney(b.total)}</span></p>
        </div>

        <a href={manageUrl} className="mt-5 inline-flex h-11 items-center rounded-md bg-accent px-5 text-sm font-semibold text-white">
          {c.cta}
        </a>
        <p className="mt-5 text-xs text-ink-soft">
          Need to change something? Use the button above, no login needed. Questions? {siteConfig.supportEmail}
        </p>
      </div>
    </div>
  );
}
