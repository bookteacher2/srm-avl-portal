/** Presentation booking rules: Thursdays only, fixed slot times. */

export const PRESENTATION_SLOT_TIMES = [
  "09:00",
  "10:00",
  "11:00",
  "13:00",
  "14:00",
  "15:00",
] as const;

export type SlotTime = (typeof PRESENTATION_SLOT_TIMES)[number];

/** True when the given ISO date falls on a Thursday. */
export function isThursday(dateISO: string): boolean {
  return new Date(`${dateISO}T00:00:00`).getDay() === 4;
}

/** Next `count` Thursdays (ISO date strings) from a reference date, exclusive. */
export function upcomingThursdays(from = new Date(), count = 8): string[] {
  const result: string[] = [];
  const d = new Date(from);
  d.setHours(0, 0, 0, 0);
  while (result.length < count) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() === 4) result.push(d.toISOString().slice(0, 10));
  }
  return result;
}
