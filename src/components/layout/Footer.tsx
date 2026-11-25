import Link from "next/link";
import { legalNav, serviceNav, siteConfig, supportNav } from "@/config/site";
import { Container } from "./Container";

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: readonly { label: string; href: string }[];
}) {
  return (
    <div>
      <h2 className="text-sm font-semibold">{title}</h2>
      <ul className="mt-4 space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-sm text-ink-soft hover:text-ink hover:underline">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="mt-20 border-t border-line bg-surface-muted">
      <Container className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <FooterColumn title="Services" links={serviceNav} />
        <FooterColumn title="Legal" links={legalNav} />
        <FooterColumn title="Support" links={supportNav} />
        <div>
          <h2 className="text-sm font-semibold">Contact</h2>
          <ul className="mt-4 space-y-3 text-sm text-ink-soft">
            <li>{siteConfig.supportEmail}</li>
            <li>{siteConfig.supportPhone}</li>
          </ul>
        </div>
      </Container>
      <div className="border-t border-line">
        <Container className="flex flex-col gap-1 py-5 text-sm text-ink-soft sm:flex-row sm:justify-between">
          <span>© {siteConfig.name}. All rights reserved.</span>
          <span>Confirmation is sent to your email after payment.</span>
        </Container>
      </div>
    </footer>
  );
}
