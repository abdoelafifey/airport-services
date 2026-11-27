import { Check } from "lucide-react";
import { Suspense, type ReactNode } from "react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Container } from "@/components/layout/Container";
import { ButtonLink } from "@/components/ui/button";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";

export function ServicePage({
  title,
  intro,
  photo,
  included,
  conditions,
  children,
}: {
  title: string;
  intro: string;
  photo: string;
  included: string[];
  conditions: string[];
  children: ReactNode;
}) {
  return (
    <Container className="pb-8 pt-6 sm:pt-8">
      <Breadcrumb items={[{ label: title }]} className="mb-6" />
      <div className="grid items-center gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
        <div>
          <h1 className="text-(length:--text-h1) font-bold leading-[1.08] tracking-[-0.03em]">{title}</h1>
          <p className="mt-4 max-w-lg text-lg text-ink-soft">{intro}</p>
          <ul className="mt-6 space-y-2.5">
            {included.map((t) => (
              <li key={t} className="flex items-start gap-2.5">
                <Check aria-hidden className="mt-1 size-4 shrink-0 text-success" strokeWidth={2.5} /> {t}
              </li>
            ))}
          </ul>
          <ButtonLink href="#book" size="lg" className="mt-7 w-full sm:w-auto">Book now</ButtonLink>
        </div>
        <PhotoPlaceholder priority src={photo} alt={title} className="aspect-[4/3] w-full rounded-2xl" />
      </div>

      <section className="mt-12 rounded-xl bg-surface-muted p-6 sm:p-8" aria-labelledby="conditions">
        <h2 id="conditions" className="text-[22px] font-bold tracking-[-0.01em]">Good to know</h2>
        <ul className="mt-4 grid gap-x-10 gap-y-3 sm:grid-cols-2">
          {conditions.map((t) => (
            <li key={t} className="flex gap-3 text-ink-soft">
              <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-ink-faint" />
              <span className="leading-relaxed">{t}</span>
            </li>
          ))}
        </ul>
      </section>

      <div id="book" className="mt-12 scroll-mt-24">
        <h2 className="mb-6 text-(length:--text-h2) font-bold tracking-[-0.02em]">Book now</h2>
        <Suspense fallback={<div className="h-96 animate-pulse rounded-lg bg-surface-muted" />}>{children}</Suspense>
      </div>
    </Container>
  );
}
