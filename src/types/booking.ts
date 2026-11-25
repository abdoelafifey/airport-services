export type ServiceType = "lounge" | "meet-greet" | "to-airport";

export type BookingStatus = "confirmed" | "cancelled";

export type VehicleType = "standard" | "premium" | "van";

export type Money = {
  /** Minor units would be safer with a real gateway; kept as a plain number for the mock. */
  amount: number;
  currency: string;
};

export type GuestCounts = {
  adults: number;
  /** Ages 3 to 11 (from config) */
  children: number;
  /** Ages 0 to 2 (from config) */
  infants: number;
};

export type Contact = {
  fullName: string;
  email: string;
  phone: string;
};

type BookingBase = {
  /** Human-friendly reference shown to the customer, e.g. "K7M2QX" */
  reference: string;
  /** Unguessable token carried in the email link to open Manage Booking (no login) */
  token: string;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
  cancelledAt?: string;

  airportCode: string;
  /** Local date at the airport, YYYY-MM-DD */
  date: string;
  /** Local time at the airport, HH:mm */
  time: string;
  flightNumber: string;
  terminal?: string;

  guests: GuestCounts;
  contact: Contact;
  specialRequests?: string;

  total: Money;
  termsAcceptedAt: string;
};

export type LoungeBooking = BookingBase & {
  service: "lounge";
  loungeId: string;
};

export type MeetGreetBooking = BookingBase & {
  service: "meet-greet";
  /** Hotel or destination address */
  address: string;
  luggageCount?: number;
};

export type ToAirportBooking = BookingBase & {
  service: "to-airport";
  /** Pickup hotel or address */
  address: string;
  vehicle: VehicleType;
  luggageCount: number;
  childSeats?: number;
};

export type Booking = LoungeBooking | MeetGreetBooking | ToAirportBooking;

/** What the flows hand to the service. The service adds reference, token, status, totals and timestamps. */
export type BookingInput =
  | Omit<LoungeBooking, ServerFields>
  | Omit<MeetGreetBooking, ServerFields>
  | Omit<ToAirportBooking, ServerFields>;

type ServerFields =
  | "reference"
  | "token"
  | "status"
  | "createdAt"
  | "updatedAt"
  | "cancelledAt"
  | "total"
  | "termsAcceptedAt";

/** Fields the customer may change from Manage Booking. */
export type BookingAmendment = Partial<
  Pick<
    BookingBase,
    "date" | "time" | "flightNumber" | "terminal" | "guests" | "specialRequests"
  > & { address: string; luggageCount: number; vehicle: VehicleType }
>;

export type Quote = {
  lines: { label: string; amount: Money }[];
  total: Money;
};

export type ChangePolicyState = {
  canAmend: boolean;
  canCancel: boolean;
  /** 0 to 100, share of the total refunded if cancelled right now */
  refundPercent: number;
  /** Free changes and cancellation end at this moment */
  freeUntil: Date;
  startsAt: Date;
};

export type ValidationErrors = Record<string, string>;
