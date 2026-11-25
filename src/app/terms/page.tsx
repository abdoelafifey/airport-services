import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage";
import { bookingConfig } from "@/config/booking";

export const metadata: Metadata = { title: "Terms & Conditions" };

export default function TermsPage() {
  const { cutoffHours } = bookingConfig;
  return (
    <LegalPage
      title="Terms & Conditions"
      sections={[
        { heading: "1. About these terms", body: <p>These terms apply to bookings of airport lounges, meet &amp; greet and airport transfers made on this website. By booking you accept them.</p> },
        { heading: "2. Your booking", body: <p>A booking is confirmed when payment succeeds and we send the confirmation email. The email contains a link to change or cancel your booking. Keep it private: anyone with the link can manage the booking.</p> },
        { heading: "3. Booking deadlines", body: <p>Lounge bookings close {cutoffHours.lounge} hour before arrival. Meet &amp; greet and transfers close {cutoffHours["meet-greet"]} hours before the service. After that you can still arrive at a lounge as a walk-in guest, subject to availability.</p> },
        { heading: "4. Accurate details", body: <p>You must give the correct flight number, date, time and passenger details. We are not responsible for services missed because of incorrect details.</p> },
        { heading: "5. Changes and cancellation", body: <p>See the Amendments, Refund &amp; Cancellation Policy for how and when you can change or cancel, and how refunds work.</p> },
        { heading: "6. Entry to lounges", body: <p>Entry is subject to the lounge&apos;s capacity and rules. A valid boarding pass for a same-day departure is required.</p> },
        { heading: "7. Liability", body: <p>Placeholder clause. Final wording to be provided by the client&apos;s legal team.</p> },
      ]}
    />
  );
}
