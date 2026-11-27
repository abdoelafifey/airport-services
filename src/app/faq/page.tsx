import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage";
import { bookingConfig } from "@/config/booking";

export const metadata: Metadata = { title: "FAQ" };

export default function FaqPage() {
  const { cutoffHours, freeChangeHoursBefore: h, guests, waiting } = bookingConfig;
  const items = [
    ["How do I know my booking is confirmed?", "You get an email straight after payment. There is no separate approval step."],
    ["Do I need an account?", "No. The link in your email opens your booking, where you can change or cancel it."],
    ["I lost my email. How do I find my booking?", "Open Manage booking and enter your booking reference and email."],
    ["Can I change or cancel?", `Yes. It is free up to ${h} hours before. See the cancellation policy for details.`],
    ["How late can I book a lounge?", `Up to ${cutoffHours.lounge} hour before you arrive. After that, you can arrive as a walk-in guest, subject to availability.`],
    ["How late can I book Meet & Greet or a transfer?", `At least ${cutoffHours["meet-greet"]} hours before.`],
    ["How are children and infants counted?", `Children are ages ${guests.childMinAge} to ${guests.childMaxAge} and pay a child price. Infants are ages 0 to ${guests.infantMaxAge} and are free, but must be added to the booking.`],
    ["How long will my driver or greeter wait?", `A greeter waits up to ${waiting.arrivalMinutes} minutes after landing. A driver waits up to ${waiting.departureMinutes} minutes at pickup.`],
    ["Why do you need my flight number?", "To track delays so your greeter or driver arrives when you do, and to check your lounge access."],
  ];
  return (
    <LegalPage title="Frequently asked questions" updated="Answers use the current booking rules.">
      <div className="divide-y divide-line border-y border-line">
        {items.map(([q, a]) => (
          <details key={q} className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-semibold [&::-webkit-details-marker]:hidden">
              {q}
              <span aria-hidden className="text-2xl font-normal leading-none text-ink-soft transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="-mt-1 pb-5 leading-relaxed text-ink-soft">{a}</p>
          </details>
        ))}
      </div>
    </LegalPage>
  );
}
