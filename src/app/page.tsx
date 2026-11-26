import {
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
      photo: "/images/lounge-window.jpg",
      text: "Relax before your flight. Choose a lounge, pay, walk in.",
      price: `From ${formatMoney(money(Math.min(...lounges.map((l) => l.priceAdult))))}`,
    },
    {
      href: "/meet-and-greet",
      title: "Meet & Greet",
      photo: "/images/meet-greet.jpg",
      text: "Met at the airport and taken to your hotel.",
      price: `From ${formatMoney(money(bookingConfig.prices.meetGreetPerAdult))}`,
    },
    {
      href: "/to-airport",
      title: "To Airport",
      photo: "/images/transfer.jpg",
      text: "A car from your hotel to the airport, on time.",
      price: `From ${formatMoney(money(Math.min(...vehicles.map((v) => v.basePrice))))}`,
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

  const tile = "group relative block overflow-hidden rounded-2xl";
  const tileLabel =
    "absolute bottom-3 left-3 rounded-full bg-white px-3.5 py-1.5 text-sm font-semibold shadow-[0_2px_10px_rgba(0,0,0,0.15)]";

  return (
    <>
      {/* Hero */}
      <section className="pb-10 pt-8 sm:pt-12">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-14">
            <div>
              <h1 className="text-[clamp(2.5rem,5.4vw,4.25rem)] font-bold leading-[1.04] tracking-[-0.035em]">
                Your airport, <br className="hidden sm:block" />
                sorted before you land.
              </h1>
              <p className="mt-5 max-w-md text-lg text-ink-soft">
                Book lounges, meet &amp; greet and transfers in one place. Confirmed by email in minutes.
              </p>
              <ul className="mt-6 space-y-2.5 text-[15px]">
                {["No account needed", `Free changes up to ${freeChangeHoursBefore} hours before`, "Manage everything from one email link"].map((t) => (
                  <li key={t} className="flex items-center gap-2.5">
                    <Check aria-hidden className="size-4 text-success" strokeWidth={2.5} /> {t}
                  </li>
                ))}
              </ul>
            </div>

            {/* Photo collage: each tile links to its service */}
            <div className="grid h-[340px] grid-cols-2 grid-rows-2 gap-3 sm:h-[460px] lg:h-[540px]">
              <Link href="/lounges" className={`${tile} row-span-2`}>
                <PhotoPlaceholder priority src="/images/hero-coffee.jpg" alt="Coffee and breakfast in an airport lounge with a runway view" className="size-full transition-transform duration-500 group-hover:scale-[1.03]" />
                <span className={tileLabel}>Airport Lounge</span>
              </Link>
              <Link href="/meet-and-greet" className={tile}>
                <PhotoPlaceholder priority src="/images/hero-terminal.jpg" alt="Traveler walking through a bright airport terminal" className="size-full transition-transform duration-500 group-hover:scale-[1.03]" />
                <span className={tileLabel}>Meet &amp; Greet</span>
              </Link>
              <Link href="/to-airport" className={tile}>
                <PhotoPlaceholder priority src="/images/hero-arrival.jpg" alt="Chauffeur loading luggage at a hotel entrance" className="size-full transition-transform duration-500 group-hover:scale-[1.03]" />
                <span className={tileLabel}>To Airport</span>
              </Link>
            </div>
          </div>

          <div className="mt-10">
            <SearchCard airports={airports} />
          </div>

          <dl className="mt-8 grid grid-cols-2 gap-y-6 border-t border-line-soft pt-8 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="sm:border-l sm:border-line-soft sm:pl-6 sm:first:border-0 sm:first:pl-0">
                <dd className="text-3xl font-bold tracking-[-0.02em]">{s.value}</dd>
                <dt className="mt-1 text-sm text-ink-soft">{s.label}</dt>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* Services */}
      <section className="py-12">
        <Container>
          <h2 className="text-(length:--text-h2) font-bold tracking-[-0.02em]">Choose your service</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {services.map((s) => (
              <Link key={s.href} href={s.href} className="group block">
                <div className="overflow-hidden rounded-xl">
                  <PhotoPlaceholder src={s.photo} alt={s.title} className="aspect-[4/3] w-full transition-transform duration-500 group-hover:scale-[1.04]" />
                </div>
                <h3 className="mt-3 text-xl font-bold group-hover:underline">{s.title}</h3>
                <p className="mt-1 text-ink-soft">{s.text}</p>
                <p className="mt-2 font-semibold">{s.price}</p>
              </Link>
            ))}
          </div>
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
              <h2 className="max-w-md text-[clamp(1.75rem,3.4vw,2.75rem)] font-bold leading-tight tracking-[-0.025em]">
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
