/** Document expiry rules: warn 90 days before expiry. */
import type { SupplierDocument } from "@/types";
import { daysUntil } from "@/lib/utils";

export const EXPIRY_WARNING_DAYS = 90;

export type ExpiryState = "OK" | "EXPIRING_SOON" | "EXPIRED" | "NONE";

export function expiryState(expiryDate?: string | null): ExpiryState {
  if (!expiryDate) return "NONE";
  const days = daysUntil(expiryDate);
  if (days === null) return "NONE";
  if (days < 0) return "EXPIRED";
  if (days <= EXPIRY_WARNING_DAYS) return "EXPIRING_SOON";
  return "OK";
}

/** Documents that are expired or within the warning window. */
export function expiringDocuments(docs: SupplierDocument[]): SupplierDocument[] {
  return docs.filter((d) => {
    const state = expiryState(d.expiryDate);
    return state === "EXPIRING_SOON" || state === "EXPIRED";
  });
}
