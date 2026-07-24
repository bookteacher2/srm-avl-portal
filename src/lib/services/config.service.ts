/** Reference-data service: supplier types, categories, requirements, criteria. */
import { getProvider } from "@/lib/data/providers";
import type { ID } from "@/types";

const db = () => getProvider();

export const configService = {
  supplierTypes: () => db().config.listSupplierTypes(),
  liveSupplierTypes: async () =>
    (await db().config.listSupplierTypes()).filter((t) => t.status === "LIVE"),
  categories: (supplierTypeId?: ID) => db().config.listCategories(supplierTypeId),
  serviceAreas: () => db().config.listServiceAreas(),
  documentRequirements: (supplierTypeId: ID) =>
    db().config.listDocumentRequirements(supplierTypeId),
  evaluationCriteria: (supplierTypeId: ID) =>
    db().config.listEvaluationCriteria(supplierTypeId),
  complianceItems: (supplierTypeId: ID) =>
    db().config.listComplianceItems(supplierTypeId),
  performanceCriteria: () => db().config.listPerformanceCriteria(),
};
