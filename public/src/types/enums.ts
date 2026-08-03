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

/**
 * Ordered lifecycle stages for the Application Status timeline (Revision 1.1).
 *
 * Registration is lightweight: a Supplier + Application record is created at
 * REGISTERED with only company details, contacts, categories and the Company
 * Profile. The committee presentation happens BEFORE the full document set is
 * requested — documents are only collected once a supplier is QUALIFIED.
 */
export type ApplicationStage =
  | "REGISTERED" // account + basic company info + category submitted
  | "SCREENING" // light eligibility screening by Procurement
  | "PRESENTATION_BOOKED" // Thursday presentation booked
  | "PRESENTED" // presentation delivered
  | "INTERNAL_ASSESSMENT" // committee internal assessment
  | "DECISION" // reject / more info / qualified
  | "DOCUMENT_UPLOAD" // qualified supplier uploads required documents
  | "DOCUMENT_VERIFICATION" // procurement verifies documents
  | "AVL_APPROVED" // added to Approved Vendor List / Supplier Master
  | "REJECTED";

export type ApplicationStatus =
  | "DRAFT"
  | "IN_PROGRESS"
  | "MORE_INFO" // committee requested more information
  | "QUALIFIED" // passed presentation; documents now required
  | "APPROVED" // on the AVL
  | "REJECTED"
  | "WITHDRAWN"
  | "ON_HOLD";

/** Outcome of the committee decision step. */
export type DecisionOutcome = "PENDING" | "REJECT" | "MORE_INFO" | "QUALIFIED";

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
