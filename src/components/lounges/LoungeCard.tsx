import { Clock } from "lucide-react";
import Link from "next/link";
import { amenityMeta } from "@/components/ui/amenities";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import { formatMoney, money } from "@/lib/utils";
import type { Airport, Lounge } from "@/types/catalog";

/** Card pattern: photo on top, text under it, no box (GetYourGuide / Klook). */
export function LoungeCard({
  lounge,
  airport,
  query = "",
}: {
  lounge: Lounge;
  airport?: Airport;
  /** Search params to carry into the details page (date, guests...) */
  query?: string;
}) {
  const amenities = lounge.amenities
    .slice(0, 3)
    .map((a) => amenityMeta[a].label)
    .join(" · ");

  return (
    <Link
      href={`/lounges/${lounge.id}${query ? `?${query}` : ""}`}
      className="group flex h-full flex-col"
    >
      <div className="overflow-hidden rounded-xl">
        <PhotoPlaceholder
          src={lounge.images[0]}
          alt={`${lounge.name} interior`}
          className="aspect-[4/3] w-full transition-transform duration-500 group-hover:scale-[1.04]"
        />
      </div>

      <div className="flex flex-1 flex-col pt-3">
        <p className="text-xs text-ink-faint">
          {airport ? `${airport.city} (${airport.code})` : lounge.airportCode} · {lounge.terminal}
        </p>
        <h3 className="mt-1 text-lg font-bold leading-snug group-hover:underline">{lounge.name}</h3>
        <p className="mt-1 text-sm text-ink-soft">{amenities}</p>
        <p className="mt-2 flex items-center gap-1.5 text-sm text-ink-soft">
          <Clock aria-hidden className="size-3.5" /> Up to {lounge.maxStayHours} hours
        </p>

        <p className="mt-auto pt-3 text-sm text-ink-soft">
          From{" "}
          <span className="text-base font-bold text-ink">
            {formatMoney(money(lounge.priceAdult))}
          </span>{" "}
          per adult
        </p>
      </div>
    </Link>
  );
}
