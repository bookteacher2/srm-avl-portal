/**
 * Mock authentication service.
 *
 * Deliberately shaped like a future Auth.js credentials flow: `authenticate`
 * returns a `SessionUser`. When Auth.js is wired, only this file changes —
 * the AuthProvider and UI keep consuming `SessionUser`.
 */
import { getProvider } from "@/lib/data/providers";
import type { SessionUser, User } from "@/types";

const db = () => getProvider();

function toSession(user: User): SessionUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    supplierId: user.supplierId ?? null,
    avatarUrl: user.avatarUrl ?? null,
  };
}

export const authService = {
  /** Mock sign-in by email (no password check in the frontend-only phase). */
  async authenticate(email: string): Promise<SessionUser | null> {
    const user = await db().users.getByEmail(email);
    if (!user || !user.isActive) return null;
    return toSession(user);
  },

  async getUserById(id: string): Promise<SessionUser | null> {
    const user = await db().users.getById(id);
    return user ? toSession(user) : null;
  },

  /** Quick-login accounts surfaced on the login screen for demoing roles. */
  async demoAccounts(): Promise<SessionUser[]> {
    const { items } = await db().users.list({ pageSize: 50 });
    return items.map(toSession);
  },
};
