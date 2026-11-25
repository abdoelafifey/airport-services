import {
  Baby,
  MoonStar,
  Newspaper,
  PlugZap,
  ShowerHead,
  UtensilsCrossed,
  VolumeX,
  Wifi,
  Wine,
  type LucideIcon,
} from "lucide-react";
import type { LoungeAmenity } from "@/types/catalog";

export const amenityMeta: Record<LoungeAmenity, { label: string; Icon: LucideIcon }> = {
  wifi: { label: "Free Wi-Fi", Icon: Wifi },
  food: { label: "Food & snacks", Icon: UtensilsCrossed },
  drinks: { label: "Drinks", Icon: Wine },
  showers: { label: "Showers", Icon: ShowerHead },
  power: { label: "Charging points", Icon: PlugZap },
  quiet: { label: "Quiet zone", Icon: VolumeX },
  kids: { label: "Family area", Icon: Baby },
  newspapers: { label: "Newspapers", Icon: Newspaper },
  prayer: { label: "Prayer room", Icon: MoonStar },
};
