import { siteConfig } from "@/config/site";
import { serviceLabels } from "@/config/booking";
import type { Booking } from "@/types/booking";
import { readStore, writeStore } from "./mock-store";

export type EmailKind = "confirmation" | "amendment" | "cancellation";

export type OutboxEmail = {
  kind: EmailKind;
  to: string;
  subject: string;
  reference: string;
  /** The link the customer clicks to open Manage Booking. No login. */
  manageUrl: string;
  sentAt: string;
};

const OUTBOX_KEY = "mock.outbox.v1";

export function buildManageUrl(token: string): string {
  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (typeof window !== "undefined" ? window.location.origin : "");
  return `${origin}/manage/booking/?token=${token}`;
}

const subjects: Record<EmailKind, (b: Booking) => string> = {
  confirmation: (b) => `Your ${serviceLabels[b.service]} booking ${b.reference} is confirmed`,
  amendment: (b) => `Your booking ${b.reference} was updated`,
  cancellation: (b) => `Your booking ${b.reference} was cancelled`,
};

/**
 * Mock email. Records what would have been sent so the confirmation page and the
 * email template previews can show it. The real backend sends the actual email.
 */
export async function sendBookingEmail(kind: EmailKind, booking: Booking): Promise<OutboxEmail> {
  const email: OutboxEmail = {
    kind,
    to: booking.contact.email,
    subject: `${subjects[kind](booking)} | ${siteConfig.name}`,
    reference: booking.reference,
    manageUrl: buildManageUrl(booking.token),
    sentAt: new Date().toISOString(),
  };
  writeStore(OUTBOX_KEY, [...readStore<OutboxEmail[]>(OUTBOX_KEY, []), email]);
  return email;
}

export function getOutbox(): OutboxEmail[] {
  return readStore<OutboxEmail[]>(OUTBOX_KEY, []);
}
