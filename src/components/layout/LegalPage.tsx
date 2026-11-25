import type { ReactNode } from "react";
import { Breadcrumb } from "./Breadcrumb";
import { Container } from "./Container";

export function LegalPage({
  title,
  updated = "Placeholder text. Replace with the official version from the client.",
  sections,
  children,
}: {
  title: string;
  updated?: string;
  sections?: { heading: string; body: ReactNode }[];
  children?: ReactNode;
}) {
  return (
    <Container className="max-w-3xl pb-12 pt-6 sm:pb-16 sm:pt-8">
      <Breadcrumb items={[{ label: title }]} className="mb-6" />
      <h1 className="text-(length:--text-h1) font-bold leading-[1.08] tracking-[-0.03em]">{title}</h1>
      <p className="mt-3 text-sm text-ink-soft">{updated}</p>
      <div className="mt-10 space-y-10">
        {sections?.map((s) => (
          <section key={s.heading}>
            <h2 className="text-[22px] font-bold tracking-[-0.01em]">{s.heading}</h2>
            <div className="mt-3 space-y-3 leading-relaxed text-ink-soft">{s.body}</div>
          </section>
        ))}
        {children}
      </div>
    </Container>
  );
}
