/** Application lifecycle helpers (ordering, labels, progress). */
import type { ApplicationStage } from "@/types";

/** Canonical ordered stages for the status timeline. */
export const APPLICATION_STAGES: ApplicationStage[] = [
  "SUBMITTED",
  "DOCUMENT_REVIEW",
  "TECHNICAL_REVIEW",
  "COMMERCIAL_REVIEW",
  "PRESENTATION_SCHEDULED",
  "COMMITTEE_EVALUATION",
  "APPROVED",
];

export const STAGE_LABELS: Record<ApplicationStage, string> = {
  SUBMITTED: "Submitted",
  DOCUMENT_REVIEW: "Document Review",
  TECHNICAL_REVIEW: "Technical Review",
  COMMERCIAL_REVIEW: "Commercial Review",
  PRESENTATION_SCHEDULED: "Presentation Scheduled",
  COMMITTEE_EVALUATION: "Committee Evaluation",
  APPROVED: "Approved Vendor",
  REJECTED: "Rejected",
};

/** 0–100 progress based on the current stage index. */
export function stageProgress(current: ApplicationStage): number {
  if (current === "REJECTED") return 100;
  const idx = APPLICATION_STAGES.indexOf(current);
  if (idx < 0) return 0;
  return Math.round(((idx + 1) / APPLICATION_STAGES.length) * 100);
}
