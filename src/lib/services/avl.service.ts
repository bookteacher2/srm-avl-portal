/** Approved Vendor List service. */
import { getProvider } from "@/lib/data/providers";
import type { AvlRecord, ID, QueryOptions } from "@/types";

const db = () => getProvider();

export const avlService = {
  list: (options?: QueryOptions) => db().avl.list(options),
  getCurrentForSupplier: (supplierId: ID) => db().avl.getCurrentForSupplier(supplierId),
  create: (data: Omit<Partial<AvlRecord>, "id">) => db().avl.create(data),
};
