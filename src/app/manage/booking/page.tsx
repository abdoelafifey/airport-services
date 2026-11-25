import type { Metadata } from "next";
import { Suspense } from "react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Container } from "@/components/layout/Container";
import { ManageView } from "./ManageView";

export const metadata: Metadata = { title: "Your booking", robots: { index: false } };

export default function ManageBookingPage() {
  return (
    <Container className="max-w-4xl pb-10 pt-6 sm:pb-14 sm:pt-8">
      <Breadcrumb items={[{ label: "Manage booking", href: "/manage" }, { label: "Your booking" }]} className="mb-6" />
      <Suspense fallback={<div className="h-96 animate-pulse rounded-lg bg-surface-muted" />}>
        <ManageView />
      </Suspense>
    </Container>
  );
}
