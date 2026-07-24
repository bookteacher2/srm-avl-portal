/**
 * AVL evaluation scoring rules (pure functions — no I/O).
 * These encode the governance logic from the PRD and are unit-testable.
 */
import type {
  EvaluationCriterion,
  EvaluationRecommendation,
  EvaluationScoreLine,
  VendorTier,
} from "@/types";

/** Weighted total (0–100) from per-criterion scores and their weights. */
export function computeWeightedScore(
  scores: EvaluationScoreLine[],
  criteria: EvaluationCriterion[],
): number {
  const weightById = new Map(criteria.map((c) => [c.id, c.weightPercent]));
  const total = scores.reduce((sum, line) => {
    const weight = weightById.get(line.criterionId) ?? 0;
    return sum + (line.score * weight) / 100;
  }, 0);
  return Math.round(total * 10) / 10;
}

/** Approval logic: 90+ Strategic, 80–89 Approved, 65–79 Conditional, else Rejected. */
export function mapRecommendation(total: number): EvaluationRecommendation {
  if (total >= 90) return "STRATEGIC";
  if (total >= 80) return "APPROVED";
  if (total >= 65) return "CONDITIONAL";
  return "REJECTED";
}

/** Vendor tier mirrors the recommendation band. */
export function mapVendorTier(recommendation: EvaluationRecommendation): VendorTier {
  switch (recommendation) {
    case "STRATEGIC":
      return "STRATEGIC";
    case "APPROVED":
      return "APPROVED";
    case "CONDITIONAL":
      return "CONDITIONAL";
    default:
      return "NONE";
  }
}

/** Stage-one gate: every mandatory compliance item must pass. */
export function stageOnePassed(results: { passed: boolean }[]): boolean {
  return results.length > 0 && results.every((r) => r.passed);
}

/** Validates that criteria weights sum to 100 (guardrail for config). */
export function weightsAreValid(criteria: { weightPercent: number }[]): boolean {
  return criteria.reduce((s, c) => s + c.weightPercent, 0) === 100;
}
