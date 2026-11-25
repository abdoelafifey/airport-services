import { airports, countries, lounges, vehicles } from "@/data/catalog";
import type { Airport, Country, Lounge, Vehicle } from "@/types/catalog";

/**
 * Read-only catalog. Async on purpose: swapping these bodies for fetch() calls to the
 * real backend must not change a single caller.
 */

export async function getCountries(): Promise<Country[]> {
  return countries;
}

export async function getAirports(countryCode?: string): Promise<Airport[]> {
  return countryCode ? airports.filter((a) => a.countryCode === countryCode) : airports;
}

export async function getAirport(code: string): Promise<Airport | undefined> {
  return airports.find((a) => a.code === code.toUpperCase());
}

/** Match on IATA code, airport name or city. */
export async function searchAirports(query: string): Promise<Airport[]> {
  const q = query.trim().toLowerCase();
  if (!q) return airports;
  return airports.filter(
    (a) =>
      a.code.toLowerCase().startsWith(q) ||
      a.city.toLowerCase().includes(q) ||
      a.name.toLowerCase().includes(q),
  );
}

export async function getLounges(): Promise<Lounge[]> {
  return lounges;
}

export async function getLoungesByAirport(airportCode: string): Promise<Lounge[]> {
  return lounges.filter((l) => l.airportCode === airportCode.toUpperCase());
}

export async function getLounge(id: string): Promise<Lounge | undefined> {
  return lounges.find((l) => l.id === id);
}

export async function getVehicles(): Promise<Vehicle[]> {
  return vehicles;
}

export async function getVehicle(type: Vehicle["type"]): Promise<Vehicle | undefined> {
  return vehicles.find((v) => v.type === type);
}
