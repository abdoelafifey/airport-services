import Link from "next/link";
import { siteConfig } from "@/config/site";

/** Text wordmark from the brand name. Replace with the real logo when it arrives. */
export function Logo() {
  return (
    <Link
      href="/"
      className="-my-2 inline-block py-2 text-[22px] font-bold tracking-tight text-accent"
      aria-label={`${siteConfig.name} home`}
    >
      {siteConfig.name}
    </Link>
  );
}
