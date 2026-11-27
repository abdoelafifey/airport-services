"use client";

import { useEffect, useState } from "react";
import { ButtonLink } from "@/components/ui/button";

/**
 * Phones only. The booking card sits far down the lounge page, so this bar keeps the price and a
 * way to reach the card on screen. It steps aside once the card (or the footer) is visible.
 */
export function MobileBookBar({ price }: { price: string }) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const targets: Element[] = [];
    const card = document.getElementById("book-card");
    const footer = document.querySelector("footer");
    if (card) targets.push(card);
    if (footer) targets.push(footer);
    const visible = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target));
      setHidden(visible.size > 0);
    });
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  return (
    <div
      aria-hidden={hidden}
      className={`fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 px-5 py-3 backdrop-blur transition-transform duration-300 lg:hidden ${hidden ? "pointer-events-none translate-y-full" : ""}`}
    >
      <div className="mx-auto flex max-w-(--page-max) items-center justify-between gap-4">
        <p className="leading-tight">
          <span className="text-lg font-bold">{price}</span>
          <span className="ml-1 text-sm text-ink-soft">per adult</span>
        </p>
        <ButtonLink href="#book-card" size="lg" tabIndex={hidden ? -1 : undefined}>
          Book this lounge
        </ButtonLink>
      </div>
    </div>
  );
}
