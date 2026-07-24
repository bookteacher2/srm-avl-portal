import type {
  AddressType,
  ApplicationCycle,
  ApplicationStage,
  ApplicationStatus,
  AvlStatus,
  BookingStatus,
  ContactType,
  DocumentSection,
  DocumentStatus,
  EvaluationRecommendation,
  NotificationType,
  ReviewDecision,
  ReviewType,
  SupplierTypeCode,
  SupplierTypeStatus,
  UserRole,
  VendorTier,
} from "./enums";

/**
 * Audit fields carried by every persisted entity. Dates are ISO-8601 strings
 * so the shape is identical whether it comes from Prisma, SharePoint, Excel,
 * SQL Server, a REST API, or SAP.
 */
export interface AuditFields {
  createdAt: string;
  updatedAt: string;
  createdById?: string | null;
  updatedById?: string | null;
}

export type ID = string;

/* ------------------------------------------------------------------ */
/* Configuration / reference data (drives dynamic forms & scoring)    */
/* ------------------------------------------------------------------ */

export interface SupplierType {
  id: ID;
  code: SupplierTypeCode;
  label: string;
  description: string;
  status: SupplierTypeStatus;
  sortOrder: number;
}

export interface Category {
  id: ID;
  supplierTypeId: ID;
  key: string;
  label: string;
  sortOrder: number;
  isActive: boolean;
}

export interface ServiceArea {
  id: ID;
  key: string;
  label: string;
  sortOrder: number;
}

export interface DocumentRequirement {
  id: ID;
  supplierTypeId: ID;
  section: DocumentSection;
  docKey: string;
  label: string;
  description: string;
  isMandatory: boolean;
  hasExpiry: boolean;
  sortOrder: number;
}

export interface EvaluationCriterion {
  id: ID;
  supplierTypeId: ID;
  key: string;
  label: string;
  weightPercent: number; // sums to 100 across a supplier type
  sortOrder: number;
}

export interface ComplianceItem {
  id: ID;
  supplierTypeId: ID;
  key: string;
  label: string;
  sortOrder: number;
}

export interface PerformanceCriterion {
  id: ID;
  key: string;
  label: string;
  weightPercent: number; // sums to 100
  sortOrder: number;
}

/* ------------------------------------------------------------------ */
/* Identity & access                                                   */
/* ------------------------------------------------------------------ */

export interface User extends AuditFields {
  id: ID;
  email: string;
  name: string;
  role: UserRole;
  supplierId?: ID | null; // set for SUPPLIER users
  avatarUrl?: string | null;
  isActive: boolean;
}

/** Lightweight session shape the UI consumes (mirrors a future Auth.js session). */
export interface SessionUser {
  id: ID;
  name: string;
  email: string;
  role: UserRole;
  supplierId?: ID | null;
  avatarUrl?: string | null;
}

/* ------------------------------------------------------------------ */
/* Supplier organisation                                               */
/* ------------------------------------------------------------------ */

export interface Contact {
  id: ID;
  type: ContactType;
  name: string;
  position: string;
  phone: string;
  email: string;
}

export interface Address {
  id: ID;
  type: AddressType;
  line1: string;
  district?: string;
  province: string;
  postalCode: string;
  country: string;
}

export interface Supplier extends AuditFields {
  id: ID;
  vendorCode: string; // human-readable business key, e.g. "V-2026-0007"
  companyName: string;
  supplierTypeId: ID;
  taxId: string;
  registrationNumber: string;
  yearEstablished: number;
  website?: string | null;
  registeredCapital?: number | null;
  employeeCount?: number | null;
  businessDescription: string;
  addresses: Address[];
  contacts: Contact[];
  categoryIds: ID[];
  serviceAreaIds: ID[];
  avlStatus: AvlStatus;
  vendorTier: VendorTier;
  currentScore?: number | null;
  blacklistFlag: boolean;
  remarks?: string | null;
}

/* ------------------------------------------------------------------ */
/* Documents (with versioning)                                         */
/* ------------------------------------------------------------------ */

export interface DocumentVersion {
  id: ID;
  version: number;
  fileName: string;
  storageKey: string;
  mimeType: string;
  sizeBytes: number;
  uploadedAt: string;
  uploadedById?: string | null;
  isCurrent: boolean;
}

export interface SupplierDocument extends AuditFields {
  id: ID;
  supplierId: ID;
  requirementId: ID;
  status: DocumentStatus;
  issueDate?: string | null;
  expiryDate?: string | null;
  note?: string | null;
  versions: DocumentVersion[];
}

/* ------------------------------------------------------------------ */
/* Application workflow                                                 */
/* ------------------------------------------------------------------ */

export interface ApplicationStageEvent {
  id: ID;
  stage: ApplicationStage;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "REJECTED";
  occurredAt?: string | null;
  note?: string | null;
  actorId?: string | null;
}

export interface ApplicationReview {
  id: ID;
  type: ReviewType;
  reviewerRole: UserRole;
  decision: ReviewDecision;
  reviewerId?: string | null;
  reviewedAt?: string | null;
  comment?: string | null;
}

export interface Application extends AuditFields {
  id: ID;
  referenceCode: string; // e.g. "APP-2026-0142"
  supplierId: ID;
  cycle: ApplicationCycle;
  currentStage: ApplicationStage;
  status: ApplicationStatus;
  submittedAt?: string | null;
  decisionAt?: string | null;
  stageEvents: ApplicationStageEvent[];
  reviews: ApplicationReview[];
}

/* ------------------------------------------------------------------ */
/* Presentation booking                                                */
/* ------------------------------------------------------------------ */

export interface PresentationBooking extends AuditFields {
  id: ID;
  applicationId: ID;
  supplierId: ID;
  date: string; // ISO date (must be a Thursday — enforced by service)
  time: string; // "09:00" | "10:00" | "11:00" | "13:00" | "14:00" | "15:00"
  status: BookingStatus;
  location?: string | null;
  meetingLink?: string | null;
}

/* ------------------------------------------------------------------ */
/* Evaluation (two-stage)                                              */
/* ------------------------------------------------------------------ */

export interface EvaluationComplianceResult {
  itemId: ID;
  passed: boolean;
}

export interface EvaluationScoreLine {
  criterionId: ID;
  score: number; // 0–100 for that criterion
}

export interface Evaluation extends AuditFields {
  id: ID;
  applicationId: ID;
  supplierId: ID;
  evaluatorId?: string | null;
  stageOnePassed: boolean;
  complianceResults: EvaluationComplianceResult[];
  scores: EvaluationScoreLine[];
  totalScore: number; // weighted 0–100
  recommendation: EvaluationRecommendation;
  evaluatedAt?: string | null;
  note?: string | null;
}

/* ------------------------------------------------------------------ */
/* AVL record                                                          */
/* ------------------------------------------------------------------ */

export interface AvlRecord extends AuditFields {
  id: ID;
  supplierId: ID;
  applicationId?: ID | null;
  vendorTier: VendorTier;
  score: number;
  status: AvlStatus;
  approvalDate: string;
  expiryDate: string;
  cycle: ApplicationCycle;
}

/* ------------------------------------------------------------------ */
/* Performance evaluation (post-project, historical)                   */
/* ------------------------------------------------------------------ */

export interface Project {
  id: ID;
  code: string;
  name: string;
  supplierId: ID;
}

export interface PerformanceScoreLine {
  criterionId: ID;
  score: number;
}

export interface PerformanceEvaluation extends AuditFields {
  id: ID;
  supplierId: ID;
  projectId: ID;
  projectName: string;
  evaluatorId?: string | null;
  evaluationDate: string;
  scores: PerformanceScoreLine[];
  weightedTotal: number;
  comment?: string | null;
}

/* ------------------------------------------------------------------ */
/* Notifications                                                       */
/* ------------------------------------------------------------------ */

export interface Notification {
  id: ID;
  userId: ID;
  type: NotificationType;
  title: string;
  body: string;
  href?: string | null;
  read: boolean;
  createdAt: string;
}
