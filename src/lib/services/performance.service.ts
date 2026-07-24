/** Post-project performance evaluation service. */
import { getProvider } from "@/lib/data/providers";
import { averagePerformance, computePerformanceScore } from "@/lib/domain/performance";
import type { ID, PerformanceScoreLine } from "@/types";

const db = () => getProvider();

export const performanceService = {
  listBySupplier: (supplierId: ID) => db().performance.listBySupplier(supplierId),

  async averageForSupplier(supplierId: ID): Promise<number | null> {
    const evals = await db().performance.listBySupplier(supplierId);
    return averagePerformance(evals.map((e) => e.weightedTotal));
  },

  async preview(scores: PerformanceScoreLine[]) {
    const criteria = await db().config.listPerformanceCriteria();
    return computePerformanceScore(scores, criteria);
  },

  async record(input: {
    supplierId: ID;
    projectId: ID;
    projectName: string;
    evaluatorId?: ID;
    scores: PerformanceScoreLine[];
    comment?: string;
  }) {
    const criteria = await db().config.listPerformanceCriteria();
    const weightedTotal = computePerformanceScore(input.scores, criteria);
    return db().performance.create({
      supplierId: input.supplierId,
      projectId: input.projectId,
      projectName: input.projectName,
      evaluatorId: input.evaluatorId ?? null,
      evaluationDate: new Date().toISOString().slice(0, 10),
      scores: input.scores,
      weightedTotal,
      comment: input.comment ?? null,
    });
  },
};
