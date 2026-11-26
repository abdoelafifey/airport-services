"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

/** Horizontal scroller with arrow buttons, drag, and wheel/trackpad support. */
export function ScrollRow({ children, label }: { children: ReactNode; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [edge, setEdge] = useState({ start: true, end: true });
  const drag = useRef({ down: false, x: 0, left: 0, moved: false });

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setEdge({
      start: el.scrollLeft <= 2,
      end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 2,
    });
  }, []);

  useEffect(() => {
    update();
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [update]);

  const by = (dir: 1 | -1) => ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.7, behavior: "smooth" });

  const arrow = (dir: 1 | -1, hidden: boolean) => (
    <div
      className={`pointer-events-none absolute top-0 z-10 hidden h-10 w-20 items-center transition-opacity sm:flex ${
        dir === 1
          ? "right-0 justify-end bg-linear-to-l from-white from-55% to-transparent"
          : "left-0 justify-start bg-linear-to-r from-white from-55% to-transparent"
      } ${hidden ? "opacity-0" : "opacity-100"}`}
    >
      <button
        type="button"
        aria-label={dir === 1 ? "Scroll right" : "Scroll left"}
        onClick={() => by(dir)}
        tabIndex={hidden ? -1 : 0}
        className={`grid size-9 place-items-center rounded-full border border-line bg-white shadow-sm hover:border-ink ${
          hidden ? "pointer-events-none" : "pointer-events-auto"
        }`}
      >
        {dir === 1 ? <ChevronRight aria-hidden className="size-5" /> : <ChevronLeft aria-hidden className="size-5" />}
      </button>
    </div>
  );

  return (
    <div className="relative">
      {arrow(-1, edge.start)}
      {arrow(1, edge.end)}
      <div
        ref={ref}
        role="group"
        aria-label={label}
        onScroll={update}
        onWheel={(e) => {
          // Let a mouse wheel scroll the row only while the pointer is over it and it can still move that way.
          const el = ref.current;
          if (!el || Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
          const max = el.scrollWidth - el.clientWidth;
          if ((e.deltaY > 0 && el.scrollLeft >= max) || (e.deltaY < 0 && el.scrollLeft <= 0)) return;
          el.scrollLeft += e.deltaY;
        }}
        onPointerDown={(e) => {
          if (e.pointerType !== "mouse") return;
          drag.current = { down: true, x: e.clientX, left: ref.current?.scrollLeft ?? 0, moved: false };
        }}
        onPointerMove={(e) => {
          const d = drag.current;
          if (!d.down || !ref.current) return;
          const dx = e.clientX - d.x;
          if (Math.abs(dx) > 4) d.moved = true;
          if (d.moved) ref.current.scrollLeft = d.left - dx;
        }}
        onPointerUp={() => (drag.current.down = false)}
        onPointerLeave={() => (drag.current.down = false)}
        onClickCapture={(e) => {
          if (drag.current.moved) {
            e.preventDefault();
            e.stopPropagation();
            drag.current.moved = false;
          }
        }}
        className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>
    </div>
  );
}
