import {
  ArrowUpRight,
  Check,
  Headset,
  MailCheck,
  ShieldCheck,
  Undo2,
} from "lucide-react";
import Link from "next/link";
import { SearchCard } from "@/components/home/SearchCard";
import { Container } from "@/components/layout/Container";
import { LoungeCard } from "@/components/lounges/LoungeCard";
import { ButtonLink } from "@/components/ui/button";
import { CheckoutMock, EmailMock, SearchMock } from "@/components/home/StepMockups";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import { bookingConfig } from "@/config/booking";
import { getAirports, getLounges, getVehicles } from "@/lib/catalog-service";
import { formatMoney, money } from "@/lib/utils";

const FEATURED_LOUNGES = ["dxb-t3-atrium", "cai-t3-garden", "ruh-t5-majlis", "doh-main-pearl"];

export default async function Home() {
  const [airports, lounges, vehicles] = await Promise.all([
    getAirports(),
    getLounges(),
    getVehicles(),
  ]);

  const featured = FEATURED_LOUNGES.map((id) => lounges.find((l) => l.id === id)).filter(
    (l): l is NonNullable<typeof l> => Boolean(l),
  );
  const { freeChangeHoursBefore } = bookingConfig;

  const services = [
    {
      href: "/lounges",
      title: "Airport Lounge",
      photo: "/images/hero-coffee.jpg",
      alt: "Coffee and breakfast in an airport lounge with a runway view",
      sub: `From ${formatMoney(money(Math.min(...lounges.map((l) => l.priceAdult))))} · ${lounges.length} lounges`,
    },
    {
      href: "/meet-and-greet",
      title: "Meet & Greet",
      photo: "/images/hero-terminal.jpg",
      alt: "Traveler walking through a bright airport terminal",
      sub: `From ${formatMoney(money(bookingConfig.prices.meetGreetPerAdult))} per adult`,
    },
    {
      href: "/to-airport",
      title: "To Airport",
      photo: "/images/hero-arrival.jpg",
      alt: "Chauffeur loading luggage at a hotel entrance",
      sub: `Cars from ${formatMoney(money(Math.min(...vehicles.map((v) => v.basePrice))))}`,
    },
  ];

  const why = [
    { Icon: MailCheck, title: "Instant email confirmation", text: "Your booking is confirmed as soon as you pay." },
    { Icon: Undo2, title: "Free changes and cancellation", text: `Up to ${freeChangeHoursBefore} hours before, from the link in your email.` },
    { Icon: ShieldCheck, title: "Secure payment", text: "Your card details are encrypted." },
    { Icon: Headset, title: "Support", text: "Questions about a booking? We are here to help." },
  ];

  const steps = [
    { Mock: SearchMock, title: "Choose a service", text: "Pick the airport and enter your trip details." },
    { Mock: CheckoutMock, title: "Pay securely", text: "One checkout. No account needed." },
    { Mock: EmailMock, title: "Get it by email", text: "Confirmation arrives with a link to change or cancel." },
  ];

  const stats = [
    { value: String(lounges.length), label: "airport lounges" },
    { value: String(new Set(lounges.map((l) => l.airportCode)).size), label: "airports" },
    { value: "3", label: "services in one place" },
    { value: `${freeChangeHoursBefore}h`, label: "free cancellation window" },
  ];

  return (
    <>
      {/* Hero */}
      <section className="pb-10 pt-12 sm:pt-16">
        <Container>
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-[clamp(2.4rem,5vw,4.1rem)] font-bold leading-[1.04] tracking-[-0.04em] text-balance">
              Everything for your airport day, in one place.
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg text-ink-soft text-balance">
              Lounges, meet &amp; greet and transfers. Book in minutes, manage from your email.
            </p>
          </div>
          <div className="mx-auto mt-10 max-w-5xl">
            <SearchCard airports={airports} />
          </div>

          {/* The three services: panels expand on hover (desktop) */}
          <div className="mt-12 flex h-[560px] flex-col gap-3 sm:h-[460px] sm:flex-row">
            {services.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="group relative min-h-0 flex-1 overflow-hidden rounded-3xl transition-[flex-grow] duration-500 sm:hover:flex-[1.6]"
              >
                <PhotoPlaceholder priority src={s.photo} alt={s.alt} className="absolute inset-0 size-full transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(0,0,0,0.7)_100%)]" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-6 text-white">
                  <div>
                    <p className="text-2xl font-bold tracking-[-0.01em]">{s.title}</p>
                    <p className="mt-1 text-sm text-white/85">{s.sub}</p>
                  </div>
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-white text-ink transition-transform group-hover:rotate-45">
                    <ArrowUpRight aria-hidden className="size-5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <dl className="mt-10 grid grid-cols-2 gap-y-6 border-t border-line-soft pt-8 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="sm:border-l sm:border-line-soft sm:pl-6 sm:first:border-0 sm:first:pl-0">
                <dd className="text-3xl font-bold tracking-[-0.02em]">{s.value}</dd>
                <dt className="mt-1 text-sm text-ink-soft">{s.label}</dt>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* Popular lounges */}
      <section className="pb-14 pt-2">
        <Container>
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-(length:--text-h2) font-bold tracking-[-0.02em]">Popular lounges</h2>
            <ButtonLink href="/lounges" variant="secondary">
              See all
            </ButtonLink>
          </div>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((lounge) => (
              <LoungeCard
                key={lounge.id}
                lounge={lounge}
                airport={airports.find((a) => a.code === lounge.airportCode)}
              />
            ))}
          </div>
        </Container>
      </section>

      {/* Why book with us: photo with real UI on top, reasons on the side */}
      <section className="py-14">
        <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="relative">
            <PhotoPlaceholder src="/images/hero-lounge.jpg" alt="Lounge seating with a view of the runway" className="aspect-[4/5] w-full rounded-2xl sm:aspect-[5/4]" />
            <div className="absolute bottom-4 left-4 right-4 max-w-xs rounded-xl bg-white p-4 shadow-[0_8px_28px_rgba(0,0,0,0.2)] sm:bottom-6 sm:left-6">
              <p className="flex items-center gap-2 text-sm font-semibold">
                <span className="grid size-6 place-items-center rounded-full bg-success text-white">
                  <Check aria-hidden className="size-3.5" strokeWidth={3} />
                </span>
                Booking confirmed
              </p>
              <p className="mt-2 text-sm text-ink-soft">Atrium Lounge · Dubai (DXB)</p>
              <p className="mt-1 text-sm text-success">Free cancellation until Dec 9, 14:00</p>
            </div>
          </div>

          <div>
            <h2 className="text-(length:--text-h2) font-bold tracking-[-0.02em]">Why book with us</h2>
            <ul className="mt-6 divide-y divide-line">
              {why.map(({ Icon, title, text }) => (
                <li key={title} className="flex gap-4 py-5 first:pt-0">
                  <Icon aria-hidden className="mt-0.5 size-6 shrink-0" strokeWidth={1.5} />
                  <div>
                    <h3 className="font-bold">{title}</h3>
                    <p className="mt-1 text-ink-soft">{text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* How it works: the real screens */}
      <section className="border-y border-line-soft bg-surface-muted py-14">
        <Container>
          <h2 className="text-(length:--text-h2) font-bold tracking-[-0.02em]">How it works</h2>
          <ol className="mt-8 grid gap-6 lg:grid-cols-3">
            {steps.map(({ title, text, Mock }, i) => (
              <li key={title} className="flex flex-col rounded-2xl bg-white p-5">
                <div className="grid min-h-[250px] place-items-center rounded-xl bg-surface-muted p-5">
                  <div className="w-full max-w-[290px]"><Mock /></div>
                </div>
                <p className="mt-5 text-sm font-semibold text-accent">Step {i + 1}</p>
                <h3 className="mt-1 text-xl font-bold">{title}</h3>
                <p className="mt-1 text-ink-soft">{text}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* Closing banner */}
      <section className="pt-14">
        <Container>
          <div className="relative overflow-hidden rounded-2xl">
            <PhotoPlaceholder src="/images/closing-sunset.jpg" alt="" className="h-[320px] w-full sm:h-[360px]" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-center p-6 text-white sm:p-12">
              <h2 className="max-w-md text-balance text-[clamp(1.75rem,3.4vw,2.75rem)] font-bold leading-tight tracking-[-0.025em]">
                Arrive relaxed. Leave on time.
              </h2>
              <p className="mt-3 max-w-sm text-white/85">Book a lounge, a greeter or a ride in a few minutes.</p>
              <div className="mt-6">
                <ButtonLink href="/lounges" size="lg">Find a lounge</ButtonLink>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
