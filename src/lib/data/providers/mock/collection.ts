/**
 * Generic in-memory collection used by the mock provider.
 *
 * Provides CRUD + list (search / sort / paginate) semantics that mirror what a
 * real database or API would offer, so the service layer and UI are written
 * exactly as they will be against a live backend.
 */
import type { Paginated, QueryOptions } from "@/types";
import { withLatency } from "../../latency";

let counter = 0;
const genId = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${counter++}`;

export class MockCollection<T extends { id: string }> {
  private items: T[];

  constructor(
    seed: T[],
    private readonly idPrefix: string,
    /** Fields searched by the `search` query option. */
    private readonly searchableFields: (keyof T)[] = [],
  ) {
    // Deep clone so mutations never leak back into the seed module.
    this.items = structuredClone(seed);
  }

  async getById(id: string): Promise<T | null> {
    return withLatency(this.items.find((i) => i.id === id) ?? null);
  }

  async findOne(predicate: (item: T) => boolean): Promise<T | null> {
    return withLatency(this.items.find(predicate) ?? null);
  }

  async findMany(predicate: (item: T) => boolean): Promise<T[]> {
    return withLatency(this.items.filter(predicate));
  }

  async list(options: QueryOptions = {}): Promise<Paginated<T>> {
    const { page = 1, pageSize = 20, search, sortBy, sortDir = "asc", filters } = options;
    let rows = [...this.items];

    if (search && this.searchableFields.length) {
      const q = search.toLowerCase();
      rows = rows.filter((row) =>
        this.searchableFields.some((f) =>
          String(row[f] ?? "").toLowerCase().includes(q),
        ),
      );
    }

    if (filters) {
      for (const [key, value] of Object.entries(filters)) {
        if (value === undefined || value === "") continue;
        rows = rows.filter((row) => (row as Record<string, unknown>)[key] === value);
      }
    }

    if (sortBy) {
      rows.sort((a, b) => {
        const av = (a as Record<string, unknown>)[sortBy];
        const bv = (b as Record<string, unknown>)[sortBy];
        if (av === bv) return 0;
        const dir = sortDir === "asc" ? 1 : -1;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return ((av as any) > (bv as any) ? 1 : -1) * dir;
      });
    }

    const total = rows.length;
    const start = (page - 1) * pageSize;
    const paged = rows.slice(start, start + pageSize);
    return withLatency({ items: paged, total, page, pageSize });
  }

  async create(data: Omit<Partial<T>, "id">): Promise<T> {
    const now = new Date().toISOString();
    const entity = {
      id: genId(this.idPrefix),
      createdAt: now,
      updatedAt: now,
      ...data,
    } as unknown as T;
    this.items.unshift(entity);
    return withLatency(entity);
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    const idx = this.items.findIndex((i) => i.id === id);
    const existing = idx === -1 ? undefined : this.items[idx];
    if (!existing) throw new Error(`${this.idPrefix} ${id} not found`);
    const updated = {
      ...existing,
      ...data,
      id,
      updatedAt: new Date().toISOString(),
    } as T;
    this.items[idx] = updated;
    return withLatency(updated);
  }

  async remove(id: string): Promise<void> {
    this.items = this.items.filter((i) => i.id !== id);
    await withLatency(null);
  }

  /** Escape hatch for provider-specific queries. */
  all(): T[] {
    return this.items;
  }
}
