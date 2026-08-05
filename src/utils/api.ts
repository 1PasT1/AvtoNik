import { Car } from '../types/car';

interface InquiryFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  pickupdate: string;
  dropoffdate: string;
  carid: string;
  message?: string;
  totalPrice: number;
  bookingId?: number;
}

/** A block of days that is already taken. Both ends are inclusive. */
export interface BookedRange {
  from: Date;
  to: Date;
}

export interface BookingRequest {
  carId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  /** "YYYY-MM-DD" — never an ISO timestamp, see toDateOnly below. */
  pickupDate: string;
  dropoffDate: string;
  message?: string;
  totalPrice: number;
}

export interface BookingResponse {
  id: number;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  carName?: string;
  duplicate?: boolean;
}

/** Thrown when the dates were taken between page load and submit. */
export class DatesUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DatesUnavailableError';
  }
}

const API_BASE_URL = 'https://autonikapi.vercel.app';
const MAILER_API_URL = 'https://avtonikmailer.vercel.app';

/**
 * Format a Date as "YYYY-MM-DD" using its LOCAL calendar fields.
 *
 * Do not use toISOString() for this. In Tbilisi (UTC+4) a Date at local
 * midnight on Aug 10 becomes "2026-08-09T20:00:00Z", so toISOString()
 * reports the 9th and the customer books the wrong day.
 */
export function toDateOnly(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Parse "YYYY-MM-DD" into a Date at LOCAL midnight, for the same reason. */
export function fromDateOnly(value: string): Date {
  const [y, m, d] = value.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export async function fetchCars(): Promise<Car[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/cars-data`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error("Invalid data structure received from API");
    }

    const cars: Car[] = data.map((car: any) => ({
      id: car.id.toString(),
      name: car.name,
      price: car.price,
      image: car.image,
      category: car.category,
      transmission: car.transmission,
      seats: car.seats,
      fuelType: car.fuelType,
      description: car.description,
      gallery: car.gallery,
      year: car.year,
    }));

    return cars;
  } catch (error) {
    console.error("Error fetching cars:", error);
    throw error;
  }
}

/**
 * Days already taken for one car — approved bookings only, from today on.
 * Returns an empty list rather than throwing: a broken availability feed
 * should not stop someone from enquiring, since the server re-checks the
 * dates on submit and again on approval.
 */
export async function fetchBookedDates(carId: string): Promise<BookedRange[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/booked-dates?carId=${encodeURIComponent(carId)}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: { ranges?: unknown } = await response.json();
    const ranges: unknown[] = Array.isArray(data?.ranges) ? data.ranges : [];

    const isRawRange = (r: unknown): r is { from: string; to: string } =>
      typeof r === 'object' &&
      r !== null &&
      typeof (r as { from?: unknown }).from === 'string' &&
      typeof (r as { to?: unknown }).to === 'string';

    return ranges.filter(isRawRange).map((r) => ({
      from: fromDateOnly(r.from),
      to: fromDateOnly(r.to),
    }));
  } catch (error) {
    console.error('Error fetching booked dates:', error);
    return [];
  }
}

/** Create a pending booking request. An admin approves it before it blocks dates. */
export async function createBooking(
  booking: BookingRequest
): Promise<BookingResponse> {
  const response = await fetch(`${API_BASE_URL}/api/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(booking),
  });

  const payload = await response.json().catch(() => null);

  if (response.status === 409) {
    throw new DatesUnavailableError(
      payload?.error || 'Those dates are no longer available.'
    );
  }

  if (!response.ok) {
    throw new Error(
      payload?.error || `Failed to create booking: ${response.status}`
    );
  }

  return payload as BookingResponse;
}

export async function sendInquiry(formData: InquiryFormData): Promise<Response> {
  const response = await fetch(
    `${MAILER_API_URL}/api/send-mail`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(formData),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Server error response:", errorText);
    console.error("Response status:", response.status);
    console.error("Response headers:", Object.fromEntries(response.headers.entries()));
    throw new Error(`Failed to send inquiry: ${response.status} ${response.statusText}`);
  }

  return response;
}

