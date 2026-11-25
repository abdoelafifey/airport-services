import type { Metadata } from "next";
import { BookingForm } from "@/components/booking/BookingForm";
import { ServicePage } from "@/components/booking/ServicePage";
import { bookingConfig } from "@/config/booking";
import { getAirports, getVehicles } from "@/lib/catalog-service";

export const metadata: Metadata = {
  title: "Meet & Greet",
  description: "A greeter meets you at the airport and takes you to your hotel.",
};

export default async function MeetAndGreetPage() {
  const [airports, vehicles] = await Promise.all([getAirports(), getVehicles()]);
  const { waiting, cutoffHours, freeChangeHoursBefore, guests } = bookingConfig;
  return (
    <ServicePage
      title="Meet & Greet"
      intro="Skip the confusion on arrival. A greeter meets you at the airport and takes you to your hotel."
      photo="/images/meet-greet.jpg"
      included={[
        "A greeter waiting at arrivals with your name",
        "Help with your bags",
        "A car to your hotel",
        "Flight tracking, so delays are covered",
      ]}
      conditions={[
        `Book at least ${cutoffHours["meet-greet"]} hours before you land.`,
        `Your greeter waits up to ${waiting.arrivalMinutes} minutes after landing.`,
        `Free changes and cancellation up to ${freeChangeHoursBefore} hours before.`,
        `Children are ages ${guests.childMinAge} to ${guests.childMaxAge}. Infants are ages 0 to ${guests.infantMaxAge}.`,
        "Enter your flight number so your greeter can track your arrival.",
        "Your greeter may call you on the phone number you give.",
      ]}
    >
      <BookingForm service="meet-greet" airports={airports} vehicles={vehicles} photo="/images/meet-greet.jpg" />
    </ServicePage>
  );
}
