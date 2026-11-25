import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage";
import { bookingConfig } from "@/config/booking";

export const metadata: Metadata = { title: "Amendments, Refund & Cancellation" };

export default function CancellationPolicyPage() {
  const { freeChangeHoursBefore: h, refundPercentAfterWindow: after } = bookingConfig;
  return (
    <LegalPage
      title="Amendments, Refund & Cancellation"
      updated="Time limits below are placeholders from common industry practice, to be confirmed by the client."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-line p-6">
          <p className="text-sm font-semibold text-success">More than {h} hours before</p>
          <p className="mt-2 text-2xl font-bold tracking-[-0.02em]">Free changes and full refund</p>
          <p className="mt-2 text-ink-soft">Change the details or cancel from the link in your email. You get 100% of your payment back.</p>
        </div>
        <div className="rounded-xl border border-line p-6">
          <p className="text-sm font-semibold text-danger">Within {h} hours</p>
          <p className="mt-2 text-2xl font-bold tracking-[-0.02em]">{after === 0 ? "No changes, no refund" : `${after}% refund`}</p>
          <p className="mt-2 text-ink-soft">Online changes close. You can still cancel, {after === 0 ? "but no refund applies" : `and ${after}% is refunded`}.</p>
        </div>
      </div>
      <section>
        <h2 className="text-[22px] font-bold tracking-[-0.01em]">How to change or cancel</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 leading-relaxed text-ink-soft">
          <li>Open the link in your confirmation email, or use Manage booking with your reference and email.</li>
          <li>Choose Edit booking or Cancel booking.</li>
          <li>For changes, review the price difference before you confirm.</li>
          <li>We email you a confirmation of every change.</li>
        </ol>
      </section>
      <section>
        <h2 className="text-[22px] font-bold tracking-[-0.01em]">Refunds</h2>
        <p className="mt-3 leading-relaxed text-ink-soft">Refunds go back to the card you paid with. If a change lowers the price, the difference is refunded; if it raises the price, the difference is charged.</p>
      </section>
    </LegalPage>
  );
}
