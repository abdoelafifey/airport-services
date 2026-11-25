import type {
  Booking,
  BookingAmendment,
  BookingInput,
  Money,
  Quote,
  ValidationErrors,
} from "@/types/booking";
import { sendBookingEmail } from "./email";
import { readStore, writeStore } from "./mock-store";
import { getChangePolicy } from "./policy";
import { getQuote } from "./pricing";
import { money } from "./utils";
import { validateBookingInput } from "./validation";

/**
 * THE seam between the front end and the (future) backend.
 * Every flow talks to `bookingService` and nothing else. When the real backend arrives,
 * write another object that satisfies this interface (fetch calls) and change the one
 * export at the bottom. No page or component needs to change.
 */
export interface BookingService {
  quote(input: BookingInput): Promise<Quote>;

  /** Validates, "charges", stores, and sends the confirmation email. */
  createBooking(input: BookingInput, options: { termsAccepted: boolean }): Promise<Booking>;

  /** Used by the link in the email. Returns null for an unknown token. */
  getBookingByToken(token: string): Promise<Booking | null>;

  /** "Find my booking" form: reference + email. Returns null when nothing matches. */
  findBooking(reference: string, email: string): Promise<Booking | null>;

  /** Shows what an edit would cost before the customer confirms it. */
  previewAmendment(
    token: string,
    amendment: BookingAmendment,
  ): Promise<{ booking: Booking; previousTotal: Money; newTotal: Money; difference: Money }>;

  amendBooking(token: string, amendment: BookingAmendment): Promise<Booking>;

  cancelBooking(token: string): Promise<{ booking: Booking; refund: Money }>;
}

export class BookingError extends Error {
  readonly code: "validation" | "terms" | "not_found" | "not_allowed";
  readonly errors: ValidationErrors;

  constructor(
    code: BookingError["code"],
    message: string,
    errors: ValidationErrors = {},
  ) {
    super(message);
    this.name = "BookingError";
    this.code = code;
    this.errors = errors;
  }
}

// ---------------------------------------------------------------------------
// Mock implementation
// ---------------------------------------------------------------------------

const STORE_KEY = "mock.bookings.v1";
// No 0/O/1/I, so a reference read out over the phone is unambiguous.
const REFERENCE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function randomReference(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  return Array.from(bytes, (b) => REFERENCE_ALPHABET[b % REFERENCE_ALPHABET.length]).join("");
}

function randomToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(24));
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

function load(): Booking[] {
  return readStore<Booking[]>(STORE_KEY, []);
}

function save(bookings: Booking[]): void {
  writeStore(STORE_KEY, bookings);
}

function applyAmendment(b: Booking, a: BookingAmendment): Booking {
  const common = {
    date: a.date ?? b.date,
    time: a.time ?? b.time,
    flightNumber: a.flightNumber ?? b.flightNumber,
    terminal: a.terminal ?? b.terminal,
    guests: a.guests ?? b.guests,
    specialRequests: a.specialRequests ?? b.specialRequests,
  };
  switch (b.service) {
    case "lounge":
      return { ...b, ...common };
    case "meet-greet":
      return {
        ...b,
        ...common,
        address: a.address ?? b.address,
        luggageCount: a.luggageCount ?? b.luggageCount,
      };
    case "to-airport":
      return {
        ...b,
        ...common,
        address: a.address ?? b.address,
        luggageCount: a.luggageCount ?? b.luggageCount,
        vehicle: a.vehicle ?? b.vehicle,
      };
  }
}

function findByToken(token: string): Booking | undefined {
  return load().find((b) => b.token === token);
}

function replace(updated: Booking): void {
  save(load().map((b) => (b.token === updated.token ? updated : b)));
}

const mockBookingService: BookingService = {
  async quote(input) {
    return getQuote(input);
  },

  async createBooking(input, { termsAccepted }) {
    const errors = validateBookingInput(input);
    if (Object.keys(errors).length) {
      throw new BookingError("validation", "Please fix the highlighted fields.", errors);
    }
    if (!termsAccepted) {
      throw new BookingError("terms", "Please accept the terms to continue.", {
        terms: "You need to accept the terms to book.",
      });
    }

    const now = new Date().toISOString();
    const booking: Booking = {
      ...input,
      reference: randomReference(),
      token: randomToken(),
      status: "confirmed",
      createdAt: now,
      updatedAt: now,
      total: getQuote(input).total,
      termsAcceptedAt: now,
    };

    save([...load(), booking]);
    await sendBookingEmail("confirmation", booking);
    return booking;
  },

  async getBookingByToken(token) {
    return findByToken(token) ?? null;
  },

  async findBooking(reference, email) {
    const ref = reference.trim().toUpperCase();
    const mail = email.trim().toLowerCase();
    return load().find((b) => b.reference === ref && b.contact.email.toLowerCase() === mail) ?? null;
  },

  async previewAmendment(token, amendment) {
    const current = findByToken(token);
    if (!current) throw new BookingError("not_found", "We could not find this booking.");
    if (!getChangePolicy(current).canAmend) {
      throw new BookingError("not_allowed", "This booking can no longer be changed online.");
    }

    const next = applyAmendment(current, amendment);
    const errors = validateBookingInput(next);
    if (Object.keys(errors).length) {
      throw new BookingError("validation", "Please fix the highlighted fields.", errors);
    }

    const newTotal = getQuote(next).total;
    return {
      booking: next,
      previousTotal: current.total,
      newTotal,
      difference: money(newTotal.amount - current.total.amount, newTotal.currency),
    };
  },

  async amendBooking(token, amendment) {
    const { booking } = await mockBookingService.previewAmendment(token, amendment);
    const updated: Booking = {
      ...booking,
      total: getQuote(booking).total,
      updatedAt: new Date().toISOString(),
    };
    replace(updated);
    await sendBookingEmail("amendment", updated);
    return updated;
  },

  async cancelBooking(token) {
    const current = findByToken(token);
    if (!current) throw new BookingError("not_found", "We could not find this booking.");

    const policy = getChangePolicy(current);
    if (!policy.canCancel) {
      throw new BookingError("not_allowed", "This booking can no longer be cancelled.");
    }

    const now = new Date().toISOString();
    const cancelled: Booking = { ...current, status: "cancelled", cancelledAt: now, updatedAt: now };
    replace(cancelled);
    await sendBookingEmail("cancellation", cancelled);

    return {
      booking: cancelled,
      refund: money((current.total.amount * policy.refundPercent) / 100, current.total.currency),
    };
  },
};

/** Swap this one line to plug in the real backend. */
export const bookingService: BookingService = mockBookingService;
