import type { Metadata } from "next";
import { EmailTemplate } from "@/components/booking/EmailTemplate";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Container } from "@/components/layout/Container";
import type { Booking } from "@/types/booking";

export const metadata: Metadata = { title: "Email templates", robots: { index: false } };

const sample: Booking = {
  service: "lounge",
  loungeId: "dxb-t3-atrium",
  reference: "AB4821XZ",
  token: "sample",
  status: "confirmed",
  createdAt: "2026-12-01T10:00:00Z",
  updatedAt: "2026-12-01T10:00:00Z",
  airportCode: "DXB",
  date: "2026-12-10",
  time: "14:00",
  flightNumber: "EK 928",
  terminal: "Terminal 3",
  guests: { adults: 2, children: 1, infants: 0 },
  contact: { fullName: "Sara Ahmed", email: "sara@example.com", phone: "+20 100 000 0000" },
  total: { amount: 143, currency: "USD" },
  termsAcceptedAt: "2026-12-01T10:00:00Z",
};

export default function EmailsPage() {
  return (
    <Container className="pb-12 pt-6">
      <Breadcrumb items={[{ label: "Email templates" }]} className="mb-6" />
      <h1 className="text-(length:--text-h2) font-bold tracking-[-0.02em]">Email templates</h1>
      <p className="mt-2 max-w-xl text-ink-soft">
        The three emails the backend sends: confirmation, amendment and cancellation. Each carries the link to Manage Booking.
      </p>
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {(["confirmation", "amendment", "cancellation"] as const).map((kind) => (
          <div key={kind}>
            <p className="mb-2 text-sm font-semibold capitalize">{kind}</p>
            <EmailTemplate kind={kind} booking={sample} manageUrl="/manage/booking/?token=sample" />
          </div>
        ))}
      </div>
    </Container>
  );
}
