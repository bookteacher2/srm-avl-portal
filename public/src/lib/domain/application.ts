/** Application lifecycle helpers (ordering, labels, progress). */
import type { ApplicationStage } from "@/types";

/**
 * Canonical ordered stages for the Application Status timeline (Revision 1.1).
 * Documents are collected AFTER the presentation and a "Qualified" decision.
 */
export const APPLICATION_STAGES: ApplicationStage[] = [
  "REGISTERED",
  "SCREENING",
  "PRESENTATION_BOOKED",
  "PRESENTED",
  "INTERNAL_ASSESSMENT",
  "DECISION",
  "DOCUMENT_UPLOAD",
  "DOCUMENT_VERIFICATION",
  "AVL_APPROVED",
];

export const STAGE_LABELS: Record<ApplicationStage, string> = {
  REGISTERED: "Registered",
  SCREENING: "Eligibility Screening",
  PRESENTATION_BOOKED: "Presentation Booked",
  PRESENTED: "Presentation Held",
  INTERNAL_ASSESSMENT: "Internal Assessment",
  DECISION: "Decision",
  DOCUMENT_UPLOAD: "Document Upload",
  DOCUMENT_VERIFICATION: "Document Verification",
  AVL_APPROVED: "AVL Approved",
  REJECTED: "Rejected",
};

/** Short helper text shown under each stage on the public tracker. */
export const STAGE_HINTS: Record<ApplicationStage, string> = {
  REGISTERED: "Account and basic company information submitted.",
  SCREENING: "Procurement performs a light eligibility screening.",
  PRESENTATION_BOOKED: "A Thursday committee presentation is scheduled.",
  PRESENTED: "The supplier has presented to the committee.",
  INTERNAL_ASSESSMENT: "The committee assesses capability and fit.",
  DECISION: "Outcome: Qualified, More Information, or Rejected.",
  DOCUMENT_UPLOAD: "Qualified suppliers upload the required documents.",
  DOCUMENT_VERIFICATION: "Procurement verifies the submitted documents.",
  AVL_APPROVED: "Listed on the Approved Vendor List and Supplier Master.",
  REJECTED: "Application was not approved at this time.",
};

/** 0–100 progress based on the current stage index. */
export function stageProgress(current: ApplicationStage): number {
  if (current === "REJECTED") return 100;
  const idx = APPLICATION_STAGES.indexOf(current);
  if (idx < 0) return 0;
  return Math.round(((idx + 1) / APPLICATION_STAGES.length) * 100);
}
