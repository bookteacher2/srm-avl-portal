/** Simulated network latency for the mock provider, configurable via env. */
const DEFAULT_MS = 350;

export function mockLatencyMs(): number {
  const raw = process.env.NEXT_PUBLIC_MOCK_LATENCY_MS;
  const parsed = raw ? Number(raw) : DEFAULT_MS;
  return Number.isFinite(parsed) ? parsed : DEFAULT_MS;
}

/** Resolve after the configured latency, returning the given value. */
export function withLatency<T>(value: T): Promise<T> {
  const ms = mockLatencyMs();
  if (ms <= 0) return Promise.resolve(value);
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}
