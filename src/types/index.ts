export * from "./enums";
export * from "./domain";

/** Generic paginated result shape returned by list repositories. */
export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

/** Common list query options honoured by every repository provider. */
export interface QueryOptions {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortDir?: "asc" | "desc";
  filters?: Record<string, string | number | boolean | undefined>;
}
