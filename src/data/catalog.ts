import type { Airport, Country, Lounge, Vehicle } from "@/types/catalog";

/**
 * DEMO DATA. Airports are real IATA codes, but terminals, lounges, amenities and prices
 * are invented placeholders. In production this whole file is replaced by the backend.
 * Adding a country, airport or lounge here is the only change needed for the UI to show it.
 */

export const countries: Country[] = [
  { code: "EG", name: "Egypt" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "SA", name: "Saudi Arabia" },
  { code: "QA", name: "Qatar" },
  { code: "GB", name: "United Kingdom" },
  { code: "FR", name: "France" },
  { code: "TR", name: "Türkiye" },
  { code: "US", name: "United States" },
  { code: "SG", name: "Singapore" },
];

export const airports: Airport[] = [
  { code: "CAI", name: "Cairo International Airport", city: "Cairo", countryCode: "EG", terminals: ["Terminal 1", "Terminal 2", "Terminal 3"] },
  { code: "DXB", name: "Dubai International Airport", city: "Dubai", countryCode: "AE", terminals: ["Terminal 1", "Terminal 2", "Terminal 3"] },
  { code: "AUH", name: "Zayed International Airport", city: "Abu Dhabi", countryCode: "AE", terminals: ["Terminal A"] },
  { code: "RUH", name: "King Khalid International Airport", city: "Riyadh", countryCode: "SA", terminals: ["Terminal 1", "Terminal 2", "Terminal 5"] },
  { code: "JED", name: "King Abdulaziz International Airport", city: "Jeddah", countryCode: "SA", terminals: ["North Terminal", "Hajj Terminal"] },
  { code: "DOH", name: "Hamad International Airport", city: "Doha", countryCode: "QA", terminals: ["Main Terminal"] },
  { code: "LHR", name: "London Heathrow Airport", city: "London", countryCode: "GB", terminals: ["Terminal 2", "Terminal 3", "Terminal 4", "Terminal 5"] },
  { code: "CDG", name: "Paris Charles de Gaulle Airport", city: "Paris", countryCode: "FR", terminals: ["Terminal 1", "Terminal 2"] },
  { code: "IST", name: "Istanbul Airport", city: "Istanbul", countryCode: "TR", terminals: ["Main Terminal"] },
  { code: "JFK", name: "John F. Kennedy International Airport", city: "New York", countryCode: "US", terminals: ["Terminal 1", "Terminal 4", "Terminal 5", "Terminal 7", "Terminal 8"] },
  { code: "SIN", name: "Singapore Changi Airport", city: "Singapore", countryCode: "SG", terminals: ["Terminal 1", "Terminal 2", "Terminal 3", "Terminal 4"] },
];

const commonConditions = [
  "Entry is subject to capacity and may be refused if the lounge is full.",
  "A valid boarding pass for a same-day departure is required.",
  "Children under 2 enter free but must be added to the booking.",
];

const photoPool = [
  "lounge-garden", "lounge-buffet", "lounge-atrium", "lounge-rest", "lounge-window",
  "lounge-auh-oasis", "lounge-ruh-majlis", "lounge-jed-dune", "lounge-doh-pearl", "lounge-lhr-elm",
  "lounge-lhr-northgate", "lounge-cdg-seine", "lounge-jfk-skyline", "lounge-sin-lotus",
];
/** One distinct cover photo per lounge. Replace with real photography per lounge. */
const primaryPhoto: Record<string, string> = {
  "cai-t3-garden": "lounge-garden",
  "cai-t2-meridian": "lounge-buffet",
  "dxb-t3-atrium": "lounge-atrium",
  "dxb-t1-horizon": "lounge-rest",
  "ist-main-bosphorus": "lounge-window",
  "auh-a-oasis": "lounge-auh-oasis",
  "ruh-t5-majlis": "lounge-ruh-majlis",
  "jed-north-dune": "lounge-jed-dune",
  "doh-main-pearl": "lounge-doh-pearl",
  "lhr-t3-elm": "lounge-lhr-elm",
  "lhr-t5-northgate": "lounge-lhr-northgate",
  "cdg-t2-seine": "lounge-cdg-seine",
  "jfk-t4-skyline": "lounge-jfk-skyline",
  "sin-t3-lotus": "lounge-sin-lotus",
};

/** Cover photo first, then the next four from the pool for the detail gallery. */
function photosFor(id: string): string[] {
  const cover = Math.max(0, photoPool.indexOf(primaryPhoto[id] ?? ""));
  return Array.from({ length: 5 }, (_, i) => `/images/${photoPool[(cover + i) % photoPool.length]}.jpg`);
}

function lounge(
  id: string,
  airportCode: string,
  name: string,
  terminal: string,
  summary: string,
  priceAdult: number,
  extra: Partial<Lounge> = {},
): Lounge {
  return {
    id,
    airportCode,
    name,
    terminal,
    summary,
    amenities: ["wifi", "food", "drinks", "power"],
    maxStayHours: 3,
    openingHours: "24 hours",
    priceAdult,
    priceChild: Math.round(priceAdult * 0.6),
    conditions: commonConditions,
    images: photosFor(id),
    ...extra,
  };
}

export const lounges: Lounge[] = [
  lounge("cai-t3-garden", "CAI", "The Garden Lounge", "Terminal 3", "Quiet seating, hot buffet and fast Wi-Fi before your flight.", 35, { amenities: ["wifi", "food", "drinks", "power", "quiet", "prayer"] }),
  lounge("cai-t2-meridian", "CAI", "Meridian Lounge", "Terminal 2", "A calm space near the gates with snacks and drinks.", 30),

  lounge("dxb-t3-atrium", "DXB", "Atrium Lounge", "Terminal 3", "Spacious lounge with showers, buffet and a family area.", 55, { amenities: ["wifi", "food", "drinks", "showers", "power", "kids", "prayer"], maxStayHours: 4 }),
  lounge("dxb-t1-horizon", "DXB", "Horizon Lounge", "Terminal 1", "Relaxed seating with a full bar and live departures board.", 50, { amenities: ["wifi", "food", "drinks", "power", "newspapers"] }),

  lounge("auh-a-oasis", "AUH", "Oasis Lounge", "Terminal A", "Bright lounge with a la carte dining and work desks.", 50, { amenities: ["wifi", "food", "drinks", "showers", "power", "quiet"] }),

  lounge("ruh-t5-majlis", "RUH", "Majlis Lounge", "Terminal 5", "Traditional seating, coffee service and a quiet zone.", 45, { amenities: ["wifi", "food", "drinks", "power", "quiet", "prayer"] }),
  lounge("jed-north-dune", "JED", "Dune Lounge", "North Terminal", "Comfortable seating with refreshments and prayer room.", 45, { amenities: ["wifi", "food", "drinks", "power", "prayer"] }),

  lounge("doh-main-pearl", "DOH", "Pearl Lounge", "Main Terminal", "Premium dining and showers for long layovers.", 60, { amenities: ["wifi", "food", "drinks", "showers", "power", "quiet", "kids"], maxStayHours: 4 }),

  lounge("lhr-t5-northgate", "LHR", "Northgate Lounge", "Terminal 5", "Light meals, drinks and newspapers in a quiet setting.", 48, { amenities: ["wifi", "food", "drinks", "power", "newspapers", "quiet"] }),
  lounge("lhr-t3-elm", "LHR", "Elm Lounge", "Terminal 3", "Relaxed lounge with a buffet and a children's corner.", 44, { amenities: ["wifi", "food", "drinks", "power", "kids"] }),

  lounge("cdg-t2-seine", "CDG", "Seine Lounge", "Terminal 2", "Light French breakfast and a calm reading area.", 46, { amenities: ["wifi", "food", "drinks", "power", "newspapers"] }),

  lounge("ist-main-bosphorus", "IST", "Bosphorus Lounge", "Main Terminal", "Large lounge with Turkish breakfast and a quiet area.", 52, { amenities: ["wifi", "food", "drinks", "showers", "power", "quiet", "kids"], maxStayHours: 4 }),

  lounge("jfk-t4-skyline", "JFK", "Skyline Lounge", "Terminal 4", "Work-friendly lounge with a full bar and charging desks.", 59, { amenities: ["wifi", "food", "drinks", "showers", "power"] }),

  lounge("sin-t3-lotus", "SIN", "Lotus Lounge", "Terminal 3", "Garden-view seating, noodle bar and showers.", 54, { amenities: ["wifi", "food", "drinks", "showers", "power", "quiet"] }),
];

export const vehicles: Vehicle[] = [
  { type: "standard", label: "Standard sedan", capacity: 3, luggage: 3, basePrice: 40 },
  { type: "premium", label: "Premium sedan", capacity: 3, luggage: 3, basePrice: 65 },
  { type: "van", label: "Van (up to 7)", capacity: 7, luggage: 7, basePrice: 85 },
];
