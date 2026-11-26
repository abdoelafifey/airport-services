import { Menu } from "lucide-react";
import Link from "next/link";
import { serviceNav } from "@/config/site";
import { Container } from "./Container";
import { Logo } from "./Logo";
import { NavLinks } from "./NavLinks";

/** Floating glass pill. Sticky so page content scrolls underneath and blurs through. */
export function Header() {
  return (
    <header className="sticky top-0 z-40 pt-3 sm:pt-4">
      <Container>
        <div className="grid h-14 grid-cols-[1fr_auto] items-center rounded-full border border-white/70 bg-white/65 pl-6 pr-2 shadow-[0_8px_32px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.04)] backdrop-blur-xl backdrop-saturate-150 md:grid-cols-[1fr_auto_1fr]">
          <Logo />
          <NavLinks />

          <div className="flex justify-end">
            {/* No-JS mobile menu */}
            <details className="relative md:hidden">
              <summary
                className="grid size-10 cursor-pointer list-none place-items-center rounded-full hover:bg-black/5 [&::-webkit-details-marker]:hidden"
                aria-label="Open menu"
              >
                <Menu aria-hidden className="size-5" />
              </summary>
              <nav
                aria-label="Mobile"
                className="absolute right-0 top-14 w-64 overflow-hidden rounded-3xl border border-white/70 bg-white/95 p-2 shadow-[0_16px_48px_rgba(0,0,0,0.2)] backdrop-blur-2xl"
              >
                {serviceNav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block rounded-2xl px-4 py-3 text-sm font-medium hover:bg-black/5"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </details>
          </div>
        </div>
      </Container>
    </header>
  );
}
