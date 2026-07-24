/** Supplier organisation service. */
import { getProvider } from "@/lib/data/providers";
import type { ID, QueryOptions, Supplier } from "@/types";

const db = () => getProvider();

export const supplierService = {
  list: (options?: QueryOptions) => db().suppliers.list(options),
  getById: (id: ID) => db().suppliers.getById(id),
  getByVendorCode: (code: string) => db().suppliers.getByVendorCode(code),
  create: (data: Omit<Partial<Supplier>, "id">) => db().suppliers.create(data),
  update: (id: ID, data: Partial<Supplier>) => db().suppliers.update(id, data),
};
