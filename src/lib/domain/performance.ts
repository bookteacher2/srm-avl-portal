/** Post-project performance scoring (weighted, 0–100). */
import type { PerformanceCriterion, PerformanceScoreLine } from "@/types";

export function computePerformanceScore(
  scores: PerformanceScoreLine[],
  criteria: PerformanceCriterion[],
): number {
  const weightById = new Map(criteria.map((c) => [c.id, c.weightPercent]));
  const total = scores.reduce((sum, line) => {
    const weight = weightById.get(line.criterionId) ?? 0;
    return sum + (line.score * weight) / 100;
  }, 0);
  return Math.round(total * 10) / 10;
}

/** Simple average of a supplier's historical weighted totals. */
export function averagePerformance(weightedTotals: number[]): number | null {
  if (!weightedTotals.length) return null;
  const avg = weightedTotals.reduce((s, v) => s + v, 0) / weightedTotals.length;
  return Math.round(avg * 10) / 10;
}
