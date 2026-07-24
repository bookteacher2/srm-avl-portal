/** Supplier document service (status + expiry). */
import { getProvider } from "@/lib/data/providers";
import { expiringDocuments, expiryState } from "@/lib/domain/documents";
import type { ID, SupplierDocument } from "@/types";

const db = () => getProvider();

export const documentService = {
  listBySupplier: (supplierId: ID) => db().documents.listBySupplier(supplierId),

  async expiringForSupplier(supplierId: ID): Promise<SupplierDocument[]> {
    const docs = await db().documents.listBySupplier(supplierId);
    return expiringDocuments(docs);
  },

  expiryState,

  update: (id: ID, data: Partial<SupplierDocument>) => db().documents.update(id, data),
  create: (data: Omit<Partial<SupplierDocument>, "id">) => db().documents.create(data),
};
