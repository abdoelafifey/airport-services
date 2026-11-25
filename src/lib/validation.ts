import { bookingConfig } from "@/config/booking";
import { airports, lounges, vehicles } from "@/data/catalog";
import type { BookingInput, ValidationErrors } from "@/types/booking";
import { getCutoff } from "./policy";
import { toDateTime, totalGuests } from "./utils";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const FLIGHT = /^[A-Z0-9]{2}\s?\d{1,4}[A-Z]?$/i;

/**
 * Field-level rules shared by create and amend. Returns {} when valid.
 * Messages are written for the customer and shown next to the field.
 */
export function validateBookingInput(
  input: BookingInput,
  now: Date = new Date(),
): ValidationErrors {
  const e: ValidationErrors = {};
  const g = bookingConfig.guests;

  if (!airports.some((a) => a.code === input.airportCode)) {
    e.airportCode = "Choose an airport.";
  }

  if (!input.date) e.date = "Choose a date.";
  if (!input.time) e.time = "Choose a time.";
  if (input.date && input.time) {
    const startsAt = toDateTime(input.date, input.time);
    if (Number.isNaN(startsAt.getTime())) {
      e.date = "Enter a valid date and time.";
    } else {
      const cutoff = getCutoff(input.service, startsAt, now);
      if (!cutoff.open) {
        e.time =
          cutoff.hours === 1
            ? "Bookings close 1 hour before arrival."
            : `Bookings close ${cutoff.hours} hours before the service.`;
      }
    }
  }

  if (!FLIGHT.test(input.flightNumber.trim())) {
    e.flightNumber = "Enter a flight number like MS 777.";
  }

  const { adults, children, infants } = input.guests;
  if (adults < 1) e.guests = "At least one adult is required.";
  else if (adults > g.maxAdults || children > g.maxChildren || infants > g.maxInfants) {
    e.guests = "That is more guests than one booking allows.";
  } else if (infants > adults) {
    e.guests = "Each infant needs an adult.";
  } else if (totalGuests(input.guests) < 1) {
    e.guests = "Add at least one guest.";
  }

  if (input.contact.fullName.trim().length < 2) e.fullName = "Enter the lead passenger's full name.";
  if (!EMAIL.test(input.contact.email.trim())) e.email = "Enter a valid email address.";
  if (input.contact.phone.replace(/\D/g, "").length < 7) e.phone = "Enter a valid phone number.";

  switch (input.service) {
    case "lounge":
      if (!lounges.some((l) => l.id === input.loungeId && l.airportCode === input.airportCode)) {
        e.loungeId = "Choose a lounge at this airport.";
      }
      break;
    case "meet-greet":
      if (input.address.trim().length < 5) e.address = "Enter your hotel name or address.";
      break;
    case "to-airport":
      if (input.address.trim().length < 5) e.address = "Enter your pickup hotel or address.";
      if (!vehicles.some((v) => v.type === input.vehicle)) e.vehicle = "Choose a vehicle.";
      if (input.luggageCount < 0) e.luggageCount = "Luggage cannot be negative.";
      break;
  }

  return e;
}
