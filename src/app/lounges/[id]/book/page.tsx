import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { BookingForm } from "@/components/booking/BookingForm";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Container } from "@/components/layout/Container";
import { getAirports, getLounge, getLounges, getVehicles } from "@/lib/catalog-service";

type Props = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  const lounges = await getLounges();
  return lounges.map((l) => ({ id: l.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const lounge = await getLounge(id);
  return { title: lounge ? `Book ${lounge.name}` : "Book a lounge" };
}

export default async function LoungeBookingPage({ params }: Props) {
  const { id } = await params;
  const lounge = await getLounge(id);
  if (!lounge) notFound();
  const [airports, vehicles] = await Promise.all([getAirports(), getVehicles()]);

  return (
    <Container className="pb-8 pt-6 sm:pt-8">
      <Breadcrumb
        items={[
          { label: "Airport lounges", href: "/lounges" },
          { label: lounge.name, href: `/lounges/${lounge.id}` },
          { label: "Confirm and pay" },
        ]}
      />
      <h1 className="mb-8 mt-4 text-[28px] font-bold tracking-[-0.02em] sm:text-[32px]">Confirm and pay</h1>
      <Suspense fallback={<div className="h-[600px] animate-pulse rounded-lg bg-surface-muted" />}>
        <BookingForm service="lounge" airports={airports} vehicles={vehicles} lounge={lounge} photo={lounge.images[0]} />
      </Suspense>
    </Container>
  );
}
