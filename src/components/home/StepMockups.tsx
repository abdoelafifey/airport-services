import { Check, MapPin, Search } from "lucide-react";

/** Real UI of the product, drawn in code. Decorative: the step text carries the meaning. */
const frame = "overflow-hidden rounded-lg border border-line bg-white shadow-[0_4px_18px_rgba(0,0,0,0.08)]";

export function SearchMock() {
  return (
    <div aria-hidden className={frame}>
      <div className="flex gap-4 border-b border-line-soft px-4 text-xs font-semibold">
        <span className="-mb-px border-b-2 border-accent py-2.5">Airport Lounge</span>
        <span className="py-2.5 text-ink-soft">Meet &amp; Greet</span>
      </div>
      <div className="space-y-2 p-4">
        <div className="flex items-center gap-2 rounded-md border border-line px-3 py-2.5 text-xs">
          <MapPin className="size-3.5 text-ink-faint" /> Dubai (DXB)
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-md border border-line px-3 py-2.5">12/10/2026</div>
          <div className="rounded-md border border-line px-3 py-2.5">2 adults</div>
        </div>
        <div className="flex h-9 items-center justify-center gap-1.5 rounded-md bg-accent text-xs font-semibold text-white">
          <Search className="size-3.5" /> Find lounges
        </div>
      </div>
    </div>
  );
}

export function CheckoutMock() {
  return (
    <div aria-hidden className={frame}>
      <div className="p-4">
        <p className="text-xs font-semibold">Atrium Lounge · DXB T3</p>
        <p className="mt-0.5 text-[11px] text-ink-soft">Thu, Dec 10 · 14:00 · 2 adults, 1 child</p>
        <dl className="mt-4 space-y-1.5 text-xs">
          <div className="flex justify-between"><dt className="text-ink-soft">$55 × 2 adults</dt><dd>$110</dd></div>
          <div className="flex justify-between"><dt className="text-ink-soft">$33 × 1 child</dt><dd>$33</dd></div>
          <div className="flex justify-between border-t border-line pt-2 text-sm font-bold"><dt>Total</dt><dd>$143</dd></div>
        </dl>
        <p className="mt-3 flex items-center gap-1.5 text-[11px] text-success">
          <Check className="size-3.5" /> Free cancellation until Dec 9, 14:00
        </p>
        <div className="mt-3 flex h-9 items-center justify-center rounded-md bg-accent text-xs font-semibold text-white">
          Pay $143
        </div>
      </div>
    </div>
  );
}

export function EmailMock() {
  return (
    <div aria-hidden className={frame}>
      <div className="border-b border-line-soft px-4 py-2.5 text-[11px] text-ink-soft">
        To: you@example.com
      </div>
      <div className="p-4">
        <p className="text-sm font-bold">Your booking is confirmed</p>
        <p className="mt-1 text-[11px] text-ink-soft">Booking reference</p>
        <p className="text-xs font-semibold tracking-wide">AB-4821-XZ</p>
        <div className="mt-3 rounded-md bg-surface-muted p-3 text-[11px] text-ink-soft">
          Atrium Lounge · Thu, Dec 10 · 14:00
        </div>
        <div className="mt-3 flex h-9 items-center justify-center rounded-md border border-ink text-xs font-semibold">
          Manage booking
        </div>
      </div>
    </div>
  );
}
