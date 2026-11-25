import { Menu } from "lucide-react";
import Link from "next/link";
import { serviceNav } from "@/config/site";
import { Container } from "./Container";
import { Logo } from "./Logo";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line-soft bg-white">
      <Container className="flex h-16 items-center justify-between gap-6">
        <div className="flex items-center gap-10">
          <Logo />
          <nav aria-label="Services" className="hidden items-center gap-1 md:flex">
            {serviceNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-ink transition-colors hover:bg-surface-muted"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/manage"
            className="hidden rounded-md px-3 py-2 text-sm font-medium text-ink transition-colors hover:bg-surface-muted md:inline-flex"
          >
            Manage booking
          </Link>

          {/* No-JS mobile menu */}
          <details className="relative md:hidden">
            <summary
              className="grid size-10 cursor-pointer list-none place-items-center rounded-md border border-line [&::-webkit-details-marker]:hidden"
              aria-label="Open menu"
            >
              <Menu aria-hidden className="size-5" />
            </summary>
            <nav
              aria-label="Mobile"
              className="absolute right-0 top-12 w-64 rounded-lg border border-line bg-white py-2 shadow-[0_8px_28px_rgba(0,0,0,0.14)]"
            >
              {[...serviceNav, { label: "Manage booking", href: "/manage" }].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-4 py-3 text-sm font-medium hover:bg-surface-muted"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </details>
        </div>
      </Container>
    </header>
  );
}
