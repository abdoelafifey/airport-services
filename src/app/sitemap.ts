import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { getLounges } from "@/lib/catalog-service";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lounges = await getLounges();
  const paths = [
    "/",
    "/lounges",
    ...lounges.map((l) => `/lounges/${l.id}`),
    "/meet-and-greet",
    "/to-airport",
    "/faq",
    "/cancellation-policy",
    "/terms",
    "/privacy",
    "/contact",
  ];
  return paths.map((p) => ({ url: `${siteConfig.url}${p === "/" ? "/" : `${p}/`}` }));
}
