import type { Metadata } from "next";
import { BookingForm } from "@/components/booking/BookingForm";
import { ServicePage } from "@/components/booking/ServicePage";
import { bookingConfig } from "@/config/booking";
import { getAirports, getVehicles } from "@/lib/catalog-service";

export const metadata: Metadata = {
  title: "To Airport",
  description: "A car from your hotel to the airport, on time.",
};

export default async function ToAirportPage() {
  const [airports, vehicles] = await Promise.all([getAirports(), getVehicles()]);
  const { waiting, cutoffHours, freeChangeHoursBefore, guests } = bookingConfig;
  return (
    <ServicePage
      title="To Airport"
      intro="A car from your hotel to the airport, on time, at a price you see before you pay."
      photo="/images/transfer.jpg"
      included={[
        "Pickup from your hotel or address",
        "A fixed price, no meter",
        "Help with your bags",
        "Choose a sedan, premium sedan or van",
      ]}
      conditions={[
        `Book at least ${cutoffHours["to-airport"]} hours before pickup.`,
        `Your driver waits up to ${waiting.departureMinutes} minutes at pickup.`,
        `Free changes and cancellation up to ${freeChangeHoursBefore} hours before.`,
        `Children are ages ${guests.childMinAge} to ${guests.childMaxAge}. Infants are ages 0 to ${guests.infantMaxAge}.`,
        "Tell us how many bags you have so we send the right vehicle.",
        "Plan pickup for about 3 hours before an international flight.",
      ]}
    >
      <BookingForm service="to-airport" airports={airports} vehicles={vehicles} photo="/images/transfer.jpg" />
    </ServicePage>
  );
}
