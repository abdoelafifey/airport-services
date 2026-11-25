import type { VehicleType } from "./booking";

export type Country = {
  code: string;
  name: string;
};

export type Airport = {
  /** IATA code */
  code: string;
  name: string;
  city: string;
  countryCode: string;
  terminals: string[];
};

export type Lounge = {
  id: string;
  airportCode: string;
  name: string;
  terminal: string;
  /** Short line shown on the card */
  summary: string;
  /** Shown as a grid with icons on the details page */
  amenities: LoungeAmenity[];
  /** Fixed by the lounge, shown on the card (hours) */
  maxStayHours: number;
  openingHours: string;
  /** Price per adult and per child, in config currency. Infants free. */
  priceAdult: number;
  priceChild: number;
  /** Shown under "Things to keep in mind" */
  conditions: string[];
  /** Placeholder until real photography arrives */
  images: string[];
};

export type LoungeAmenity =
  | "wifi"
  | "food"
  | "drinks"
  | "showers"
  | "power"
  | "quiet"
  | "kids"
  | "newspapers"
  | "prayer";

export type Vehicle = {
  type: VehicleType;
  label: string;
  capacity: number;
  luggage: number;
  /** Flat base price for the transfer */
  basePrice: number;
};
