import type { Metadata } from "next";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Container } from "@/components/layout/Container";
import { siteConfig } from "@/config/site";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <Container className="pb-12 pt-6 sm:pb-16 sm:pt-8">
      <Breadcrumb items={[{ label: "Contact" }]} className="mb-6" />
      <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <h1 className="text-(length:--text-h1) font-bold leading-[1.08] tracking-[-0.03em]">Contact us</h1>
          <p className="mt-3 max-w-md text-lg text-ink-soft">Questions about a booking or a service? Send us a message and include your booking reference if you have one.</p>
          <dl className="mt-8 space-y-4">
            <div><dt className="text-sm text-ink-soft">Email</dt><dd className="font-semibold">{siteConfig.supportEmail}</dd></div>
            <div><dt className="text-sm text-ink-soft">Phone</dt><dd className="font-semibold">{siteConfig.supportPhone}</dd></div>
          </dl>
        </div>
        <ContactForm />
      </div>
    </Container>
  );
}
