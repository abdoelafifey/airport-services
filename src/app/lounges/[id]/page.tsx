import { BadgeCheck, Clock, MapPin } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Container } from "@/components/layout/Container";
import { BookingCard } from "@/components/lounges/BookingCard";
import { amenityMeta } from "@/components/ui/amenities";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import { bookingConfig } from "@/config/booking";
import { getAirport, getLounge, getLounges } from "@/lib/catalog-service";

type Props = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  const lounges = await getLounges();
  return lounges.map((l) => ({ id: l.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const lounge = await getLounge(id);
  return lounge
    ? { title: `${lounge.name}, ${lounge.airportCode}`, description: lounge.summary }
    : {};
}

const h2 = "text-[22px] font-bold tracking-[-0.01em]";
const section = "border-t border-line py-8 scroll-mt-24";

export default async function LoungeDetailsPage({ params }: Props) {
  const { id } = await params;
  const lounge = await getLounge(id);
  if (!lounge) notFound();
  const airport = await getAirport(lounge.airportCode);

  const { cutoffHours, freeChangeHoursBefore, guests } = bookingConfig;
  const goodToKnow = [
    ...lounge.conditions,
    `Bookings close ${cutoffHours.lounge} hour${cutoffHours.lounge === 1 ? "" : "s"} before your arrival.`,
    `Stay is limited to ${lounge.maxStayHours} hours per visit.`,
    `Children are ages ${guests.childMinAge} to ${guests.childMaxAge}. Infants are ages 0 to ${guests.infantMaxAge} and enter free.`,
  ];

  const overview = [
    { Icon: MapPin, title: lounge.terminal, text: airport?.name ?? lounge.airportCode },
    { Icon: Clock, title: "Opening hours", text: lounge.openingHours },
    {
      Icon: BadgeCheck,
      title: "Free cancellation",
      text: `Cancel or change up to ${freeChangeHoursBefore} hours before your visit.`,
    },
  ];

  return (
    <Container className="pb-8 pt-6 sm:pt-8">
      <Breadcrumb
        items={[
          { label: "Airport lounges", href: "/lounges" },
          { label: airport?.city ?? lounge.airportCode, href: `/lounges?airport=${lounge.airportCode}` },
          { label: lounge.name },
        ]}
      />

      <h1 className="mt-4 text-[28px] font-bold leading-tight tracking-[-0.02em] sm:text-[32px]">
        {lounge.name}
      </h1>
      <p className="mt-1 text-ink-soft">
        {airport?.name ?? lounge.airportCode} · {lounge.terminal}
      </p>

      {/* Gallery: placeholders until real photography arrives */}
      <div className="mt-6 grid gap-2 overflow-hidden rounded-2xl sm:h-[420px] sm:grid-cols-4 sm:grid-rows-2">
        <PhotoPlaceholder priority src={lounge.images[0]} className="aspect-[4/3] w-full sm:col-span-2 sm:row-span-2 sm:aspect-auto sm:h-full" alt={`${lounge.name} interior`} />
        {[1, 2, 3, 4].map((n) => (
          <PhotoPlaceholder key={n} src={lounge.images[n]} alt={`${lounge.name} photo ${n + 1}`} className="hidden h-full w-full sm:block" />
        ))}
      </div>

      <div className="mt-8 grid gap-12 lg:grid-cols-[1fr_380px] lg:items-start">
        <div>
          <p className="max-w-2xl pb-8 text-lg leading-relaxed">{lounge.summary}</p>

          <section className={section} aria-labelledby="overview">
            <h2 id="overview" className={h2}>Overview</h2>
            <ul className="mt-5 space-y-5">
              {overview.map(({ Icon, title, text }) => (
                <li key={title} className="flex gap-4">
                  <Icon aria-hidden className="mt-0.5 size-6 shrink-0" strokeWidth={1.5} />
                  <div>
                    <p className="font-semibold">{title}</p>
                    <p className="text-sm text-ink-soft">{text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className={section} aria-labelledby="amenities">
            <h2 id="amenities" className={h2}>What&apos;s included</h2>
            <ul className="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-2">
              {lounge.amenities.map((a) => {
                const { Icon, label } = amenityMeta[a];
                return (
                  <li key={a} className="flex items-center gap-4">
                    <Icon aria-hidden className="size-6 shrink-0" strokeWidth={1.5} />
                    <span>{label}</span>
                  </li>
                );
              })}
            </ul>
          </section>

          <section className={section} aria-labelledby="good-to-know">
            <h2 id="good-to-know" className={h2}>Good to know</h2>
            <ul className="mt-5 list-disc space-y-3 pl-5 marker:text-ink-faint">
              {goodToKnow.map((text) => (
                <li key={text} className="leading-relaxed text-ink-soft">{text}</li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-ink-soft">
              Read the full{" "}
              <Link href="/terms" className="font-semibold underline underline-offset-4">Terms</Link>{" "}
              and{" "}
              <Link href="/cancellation-policy" className="font-semibold underline underline-offset-4">
                Cancellation policy
              </Link>
              .
            </p>
          </section>
        </div>

        <div className="lg:sticky lg:top-24">
          <Suspense fallback={<div className="h-96 animate-pulse rounded-lg bg-surface-muted" />}>
            <BookingCard
              loungeId={lounge.id}
              priceAdult={lounge.priceAdult}
              priceChild={lounge.priceChild}
              maxStayHours={lounge.maxStayHours}
            />
          </Suspense>
        </div>
      </div>
    </Container>
  );
}
