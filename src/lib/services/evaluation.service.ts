/** Two-stage AVL evaluation service. */
import { getProvider } from "@/lib/data/providers";
import {
  computeWeightedScore,
  mapRecommendation,
  mapVendorTier,
  stageOnePassed,
} from "@/lib/domain/scoring";
import type {
  EvaluationComplianceResult,
  EvaluationScoreLine,
  ID,
  SupplierType,
} from "@/types";

const db = () => getProvider();

export const evaluationService = {
  getByApplication: (applicationId: ID) =>
    db().evaluations.getByApplication(applicationId),

  /**
   * Compute a live evaluation preview from raw inputs, without persisting.
   * Used by the evaluation UI to show score + recommendation in real time.
   */
  async preview(supplierTypeId: ID, scores: EvaluationScoreLine[]) {
    const criteria = await db().config.listEvaluationCriteria(supplierTypeId);
    const totalScore = computeWeightedScore(scores, criteria);
    const recommendation = mapRecommendation(totalScore);
    return { totalScore, recommendation, vendorTier: mapVendorTier(recommendation) };
  },

  stageOnePassed(results: EvaluationComplianceResult[]) {
    return stageOnePassed(results);
  },

  /** Persist a committee evaluation (stage-one gate applied). */
  async submit(input: {
    applicationId: ID;
    supplierId: ID;
    supplierType: SupplierType;
    evaluatorId?: ID;
    complianceResults: EvaluationComplianceResult[];
    scores: EvaluationScoreLine[];
    note?: string;
  }) {
    const passed = stageOnePassed(input.complianceResults);
    const criteria = await db().config.listEvaluationCriteria(input.supplierType.id);
    const totalScore = passed ? computeWeightedScore(input.scores, criteria) : 0;
    const recommendation = passed ? mapRecommendation(totalScore) : "REJECTED";

    return db().evaluations.create({
      applicationId: input.applicationId,
      supplierId: input.supplierId,
      evaluatorId: input.evaluatorId ?? null,
      stageOnePassed: passed,
      complianceResults: input.complianceResults,
      scores: input.scores,
      totalScore,
      recommendation,
      evaluatedAt: new Date().toISOString(),
      note: input.note ?? null,
    });
  },
};
