/** Application workflow service. */
import { getProvider } from "@/lib/data/providers";
import { stageProgress } from "@/lib/domain/application";
import type { Application, ID, QueryOptions } from "@/types";

const db = () => getProvider();

export const applicationService = {
  list: (options?: QueryOptions) => db().applications.list(options),
  getById: (id: ID) => db().applications.getById(id),
  listBySupplier: (supplierId: ID) => db().applications.listBySupplier(supplierId),

  /** Most recent application for a supplier (by submittedAt/createdAt). */
  async currentForSupplier(supplierId: ID): Promise<Application | null> {
    const apps = await db().applications.listBySupplier(supplierId);
    if (!apps.length) return null;
    return apps.sort((a, b) =>
      (b.submittedAt ?? b.createdAt).localeCompare(a.submittedAt ?? a.createdAt),
    )[0]!;
  },

  progress: (app: Application) => stageProgress(app.currentStage),

  update: (id: ID, data: Partial<Application>) => db().applications.update(id, data),
};
