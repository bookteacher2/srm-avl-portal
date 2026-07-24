import {
  LayoutDashboard,
  FileText,
  Upload,
  CalendarClock,
  BadgeCheck,
  Building2,
  Users,
  ClipboardCheck,
  Star,
  type LucideIcon,
} from "lucide-react";
import type { UserRole } from "@/types";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const supplierNav: NavItem[] = [
  { label: "Dashboard", href: "/supplier/dashboard", icon: LayoutDashboard },
  { label: "Application Status", href: "/supplier/application", icon: FileText },
  { label: "Documents", href: "/supplier/documents", icon: Upload },
  { label: "Presentation", href: "/supplier/presentation", icon: CalendarClock },
  { label: "AVL Status", href: "/supplier/avl", icon: BadgeCheck },
  { label: "Company Profile", href: "/supplier/profile", icon: Building2 },
];

export const adminNav: NavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Applications", href: "/admin/applications", icon: FileText },
  { label: "Suppliers", href: "/admin/suppliers", icon: Users },
  { label: "Evaluation", href: "/admin/evaluation", icon: ClipboardCheck },
  { label: "Performance", href: "/admin/performance", icon: Star },
];

/** Roles that belong to the internal (admin) console. */
export const INTERNAL_ROLES: UserRole[] = [
  "PROCUREMENT",
  "ENGINEERING_REVIEWER",
  "HSE_REVIEWER",
  "FINANCE",
  "ADMIN",
];

export function navForRole(role: UserRole): NavItem[] {
  return role === "SUPPLIER" ? supplierNav : adminNav;
}

export function homeForRole(role: UserRole): string {
  return role === "SUPPLIER" ? "/supplier/dashboard" : "/admin/dashboard";
}
