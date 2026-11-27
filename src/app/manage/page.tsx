import type { Metadata } from "next";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Container } from "@/components/layout/Container";
import { FindBookingForm } from "./FindBookingForm";

export const metadata: Metadata = { title: "Manage booking", robots: { index: false } };

export default function ManagePage() {
  return (
    <Container className="max-w-xl pb-12 pt-6 sm:pb-16 sm:pt-8">
      <Breadcrumb items={[{ label: "Manage booking" }]} className="mb-6" />
      <h1 className="text-(length:--text-h2) font-bold tracking-[-0.02em]">Manage your booking</h1>
      <p className="mt-2 text-ink-soft">
        The easiest way is the link in your confirmation email. Lost it? Find your booking with your reference and email.
      </p>
      <FindBookingForm />
    </Container>
  );
}
