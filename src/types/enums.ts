/**
 * Domain enumerations.
 *
 * These are string-literal unions rather than TypeScript `enum`s so they
 * serialize cleanly across any data source (JSON, SQL, SharePoint, OData)
 * and remain extensible — a new supplier type or status is a new string,
 * not a code change in the persistence layer.
 */

export type SupplierTypeCode = "CONTRACTOR" | "PRODUCT" | "SERVICE";
export type SupplierTypeStatus = "LIVE" | "COMING_SOON" | "RETIRED";

export type UserRole =
  | "SUPPLIER"
  | "PROCUREMENT"
  | "ENGINEERING_REVIEWER"
  | "HSE_REVIEWER"
  | "FINANCE"
  | "ADMIN";

export type ContactType = "PRIMARY" | "FINANCE" | "TECHNICAL";
export type AddressType = "REGISTERED" | "OPERATING" | "BILLING";

export type DocumentSection = "MANDATORY" | "AVL_EVALUATION" | "SUPPORTING";
export type DocumentStatus =
  | "NOT_UPLOADED"
  | "UPLOADED"
  | "UNDER_REVIEW"
  | "VERIFIED"
  | "REJECTED"
  | "EXPIRED";

export type ApplicationCycle = "INITIAL" | "RENEWAL";

/** Ordered lifecycle stages for the Application Status timeline. */
export type ApplicationStage =
  | "SUBMITTED"
  | "DOCUMENT_REVIEW"
  | "TECHNICAL_REVIEW"
  | "COMMERCIAL_REVIEW"
  | "PRESENTATION_SCHEDULED"
  | "COMMITTEE_EVALUATION"
  | "APPROVED"
  | "REJECTED";

export type ApplicationStatus =
  | "DRAFT"
  | "IN_PROGRESS"
  | "ON_HOLD"
  | "APPROVED"
  | "REJECTED"
  | "WITHDRAWN";

export type ReviewType =
  | "DOCUMENT"
  | "TECHNICAL"
  | "COMMERCIAL"
  | "HSE"
  | "FINANCE";
export type ReviewDecision = "PENDING" | "PASS" | "FAIL" | "CONDITIONAL";

export type BookingStatus = "CONFIRMED" | "COMPLETED" | "CANCELLED" | "NO_SHOW";

export type EvaluationRecommendation =
  | "STRATEGIC"
  | "APPROVED"
  | "CONDITIONAL"
  | "REJECTED";

export type AvlStatus =
  | "ACTIVE"
  | "CONDITIONAL"
  | "SUSPENDED"
  | "EXPIRED"
  | "BLACKLISTED";

export type VendorTier = "STRATEGIC" | "APPROVED" | "CONDITIONAL" | "NONE";

export type NotificationType = "INFO" | "ACTION_REQUIRED" | "WARNING" | "SUCCESS";
