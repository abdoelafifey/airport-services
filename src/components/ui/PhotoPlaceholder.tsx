import { ImageIcon } from "lucide-react";

/**
 * Photo slot. Pass `src` for a real photo; without it, renders a flat gray placeholder
 * at the same size so layouts never shift when photography is swapped in.
 */
export function PhotoPlaceholder({
  src,
  alt = "",
  className = "",
  priority = false,
}: {
  src?: string;
  alt?: string;
  className?: string;
  priority?: boolean;
}) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className={`object-cover ${className}`}
      />
    );
  }
  return (
    <div
      role="img"
      aria-label={alt || "Photo placeholder"}
      className={`grid place-items-center bg-[#ebebeb] ${className}`}
    >
      <ImageIcon aria-hidden strokeWidth={1.25} className="size-8 text-[#b5b5b5]" />
    </div>
  );
}
