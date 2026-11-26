"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { serviceNav } from "@/config/site";

/** Desktop pill links with an active state based on the current route. */
export function NavLinks() {
  const pathname = usePathname() ?? "";
  return (
    <nav aria-label="Services" className="hidden items-center gap-1 md:flex">
      {serviceNav.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              active ? "bg-ink text-white" : "text-ink hover:bg-black/5"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
