/**
 * Presentation mapping for domain enums: human labels + badge variants.
 * Single source so no component hardcodes a status string or colour.
 */
import type {
  AvlStatus,
  DocumentStatus,
  EvaluationRecommendation,
  ReviewDecision,
  UserRole,
  VendorTier,
} from "@/types";

type BadgeVariant =
  | "default"
  | "secondary"
  | "success"
  | "warning"
  | "destructive"
  | "muted"
  | "outline";

export const ROLE_LABELS: Record<UserRole, string> = {
  SUPPLIER: "Supplier",
  PROCUREMENT: "Procurement",
  ENGINEERING_REVIEWER: "Engineering Reviewer",
  HSE_REVIEWER: "HSE Reviewer",
  FINANCE: "Finance",
  ADMIN: "Administrator",
};

export const AVL_STATUS: Record<AvlStatus, { label: string; variant: BadgeVariant }> = {
  ACTIVE: { label: "Active", variant: "success" },
  CONDITIONAL: { label: "Conditional", variant: "warning" },
  SUSPENDED: { label: "Suspended", variant: "muted" },
  EXPIRED: { label: "Expired", variant: "destructive" },
  BLACKLISTED: { label: "Blacklisted", variant: "destructive" },
};

export const VENDOR_TIER: Record<VendorTier, { label: string; variant: BadgeVariant }> = {
  STRATEGIC: { label: "Strategic Vendor", variant: "default" },
  APPROVED: { label: "Approved Vendor", variant: "success" },
  CONDITIONAL: { label: "Conditional Vendor", variant: "warning" },
  NONE: { label: "Not Listed", variant: "muted" },
};

export const DOCUMENT_STATUS: Record<DocumentStatus, { label: string; variant: BadgeVariant }> = {
  NOT_UPLOADED: { label: "Not Uploaded", variant: "muted" },
  UPLOADED: { label: "Uploaded", variant: "secondary" },
  UNDER_REVIEW: { label: "Under Review", variant: "default" },
  VERIFIED: { label: "Verified", variant: "success" },
  REJECTED: { label: "Rejected", variant: "destructive" },
  EXPIRED: { label: "Expired", variant: "destructive" },
};

export const RECOMMENDATION: Record<
  EvaluationRecommendation,
  { label: string; variant: BadgeVariant }
> = {
  STRATEGIC: { label: "Strategic Vendor", variant: "default" },
  APPROVED: { label: "Approved", variant: "success" },
  CONDITIONAL: { label: "Conditional", variant: "warning" },
  REJECTED: { label: "Rejected", variant: "destructive" },
};

export const REVIEW_DECISION: Record<ReviewDecision, { label: string; variant: BadgeVariant }> = {
  PENDING: { label: "Pending", variant: "muted" },
  PASS: { label: "Pass", variant: "success" },
  FAIL: { label: "Fail", variant: "destructive" },
  CONDITIONAL: { label: "Conditional", variant: "warning" },
};

export const APPLICATION_STATUS_VARIANT: Record<string, BadgeVariant> = {
  DRAFT: "muted",
  IN_PROGRESS: "default",
  ON_HOLD: "warning",
  APPROVED: "success",
  REJECTED: "destructive",
  WITHDRAWN: "muted",
};

export function monthLabel(ym: string): string {
  const [y, m] = ym.split("-").map(Number);
  if (!y || !m) return ym;
  return new Date(y, m - 1, 1).toLocaleString("en-US", { month: "short", year: "2-digit" });
}
