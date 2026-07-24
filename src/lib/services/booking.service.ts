/** Presentation booking service (Thursday-only, slot availability). */
import { getProvider } from "@/lib/data/providers";
import {
  PRESENTATION_SLOT_TIMES,
  isThursday,
  type SlotTime,
} from "@/lib/domain/presentation";
import type { ID, PresentationBooking } from "@/types";

const db = () => getProvider();

export const bookingService = {
  getByApplication: (applicationId: ID) =>
    db().bookings.getByApplication(applicationId),

  /** Which slot times remain open on a given Thursday. */
  async availableSlots(dateISO: string): Promise<SlotTime[]> {
    if (!isThursday(dateISO)) return [];
    const taken = await db().bookings.listByDate(dateISO);
    const takenTimes = new Set(taken.map((b) => b.time));
    return PRESENTATION_SLOT_TIMES.filter((t) => !takenTimes.has(t));
  },

  /** Book a slot, enforcing the Thursday + availability rules. */
  async book(
    data: Omit<Partial<PresentationBooking>, "id" | "status">,
  ): Promise<PresentationBooking> {
    if (!data.date || !isThursday(data.date)) {
      throw new Error("Presentations can only be booked on Thursdays.");
    }
    const open = await this.availableSlots(data.date);
    if (!data.time || !open.includes(data.time as SlotTime)) {
      throw new Error("Selected slot is no longer available.");
    }
    return db().bookings.create({ ...data, status: "CONFIRMED" });
  },
};
