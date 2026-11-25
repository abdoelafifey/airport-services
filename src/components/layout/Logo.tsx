import Link from "next/link";
import { siteConfig } from "@/config/site";

/** Placeholder wordmark. Replace with the real logo when it arrives. */
export function Logo() {
  return (
    <Link
      href="/"
      className="text-[22px] font-bold tracking-tight text-accent"
      aria-label={`${siteConfig.name} home`}
    >
      {siteConfig.name}
    </Link>
  );
}
