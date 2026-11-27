import type { Metadata } from "next";
import { Suspense } from "react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Container } from "@/components/layout/Container";
import { ConfirmationView } from "./ConfirmationView";

export const metadata: Metadata = { title: "Booking confirmed", robots: { index: false } };

export default function ConfirmationPage() {
  return (
    <Container className="max-w-2xl pb-10 pt-6 sm:pb-14 sm:pt-8">
      <Breadcrumb items={[{ label: "Booking confirmed" }]} className="mb-6" />
      <Suspense fallback={<div className="h-96 animate-pulse rounded-lg bg-surface-muted" />}>
        <ConfirmationView />
      </Suspense>
    </Container>
  );
}
