"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppSidebar } from "./app-sidebar";
import { AppTopbar } from "./app-topbar";
import { useAuth } from "@/providers/auth-provider";
import { INTERNAL_ROLES, adminNav, supplierNav } from "@/config/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import type { UserRole } from "@/types";

interface AppShellProps {
  area: "supplier" | "admin";
  title: string;
  children: React.ReactNode;
}

/**
 * Client-side auth + role guard and chrome for the authenticated areas.
 * When Auth.js lands, this guard is replaced by `middleware.ts` + server
 * session checks; the page components below stay identical.
 */
export function AppShell({ area, title, children }: AppShellProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  const allowed = (role: UserRole) =>
    area === "supplier" ? role === "SUPPLIER" : INTERNAL_ROLES.includes(role);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
    } else if (!allowed(user.role)) {
      router.replace(user.role === "SUPPLIER" ? "/supplier/dashboard" : "/admin/dashboard");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading]);

  if (loading || !user || !allowed(user.role)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Skeleton className="h-8 w-40" />
      </div>
    );
  }

  const items = area === "supplier" ? supplierNav : adminNav;

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar items={items} />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppTopbar title={title} items={items} />
        <main className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
