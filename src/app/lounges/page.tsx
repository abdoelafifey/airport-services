import type { Metadata } from "next";
import { Suspense } from "react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Container } from "@/components/layout/Container";
import { LoungeBrowser } from "@/components/lounges/LoungeBrowser";
import { getAirports, getLounges } from "@/lib/catalog-service";

export const metadata: Metadata = {
  title: "Airport lounges",
  description: "Book airport lounge access in advance and get your confirmation by email.",
};

export default async function LoungesPage() {
  const [airports, lounges] = await Promise.all([getAirports(), getLounges()]);

  return (
    <Container className="pb-8 pt-6 sm:pt-8">
      <Breadcrumb items={[{ label: "Airport lounges" }]} className="mb-6" />
      <h1 className="text-(length:--text-h2) font-bold tracking-[-0.02em]">Airport lounges</h1>
      <p className="mt-2 max-w-xl text-ink-soft">
        Choose your airport and book a lounge. Confirmation goes to your email.
      </p>

      <div className="mt-8">
        <Suspense fallback={<div className="h-96 animate-pulse rounded-lg bg-surface-muted" />}>
          <LoungeBrowser airports={airports} lounges={lounges} />
        </Suspense>
      </div>
    </Container>
  );
}
