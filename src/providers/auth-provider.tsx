"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { authService } from "@/lib/services";
import type { SessionUser } from "@/types";

const STORAGE_KEY = "srm.session";

interface AuthContextValue {
  user: SessionUser | null;
  loading: boolean;
  signIn: (email: string) => Promise<SessionUser | null>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Client-side session store. Persists a `SessionUser` to localStorage so the
 * demo behaves like a logged-in app across reloads. When Auth.js is wired,
 * this provider is swapped for `<SessionProvider>` and `useAuth` reads the
 * real session — no page changes required.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw) as SessionUser);
    } catch {
      /* ignore */
    }
    setLoading(false);
  }, []);

  const signIn = useCallback(async (email: string) => {
    const session = await authService.authenticate(email);
    if (session) {
      setUser(session);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    }
    return session;
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = useMemo(
    () => ({ user, loading, signIn, signOut }),
    [user, loading, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
