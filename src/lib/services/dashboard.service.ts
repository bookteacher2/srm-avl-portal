/**
 * Dashboard aggregation service.
 * Composes multiple repositories into the shapes the dashboard UIs consume,
 * so pages never assemble cross-entity data themselves.
 */
import { getProvider } from "@/lib/data/providers";
import { expiringDocuments } from "@/lib/domain/documents";
import { averagePerformance } from "@/lib/domain/performance";
import type {
  Application,
  AvlRecord,
  ID,
  Notification,
  PresentationBooking,
  Supplier,
  SupplierDocument,
} from "@/types";

const db = () => getProvider();

export interface ExpiringDocument {
  document: SupplierDocument;
  label: string;
}

export interface SupplierDashboard {
  supplier: Supplier | null;
  application: Application | null;
  booking: PresentationBooking | null;
  avl: AvlRecord | null;
  expiringDocuments: ExpiringDocument[];
  latestPerformance: number | null;
  notifications: Notification[];
}

export interface AdminDashboard {
  stats: {
    applications: number;
    pendingReview: number;
    approvedVendors: number;
    conditionalVendors: number;
    rejectedVendors: number;
    upcomingPresentations: number;
    documentsExpiringSoon: number;
  };
  applicationsByMonth: { month: string; count: number }[];
  categoryDistribution: { category: string; count: number }[];
  approvalRate: number; // 0–100
}

export const dashboardService = {
  async forSupplier(supplierId: ID, userId?: ID): Promise<SupplierDashboard> {
    const provider = db();
    const [supplier, apps, docs, avl, perf, notifs] = await Promise.all([
      provider.suppliers.getById(supplierId),
      provider.applications.listBySupplier(supplierId),
      provider.documents.listBySupplier(supplierId),
      provider.avl.getCurrentForSupplier(supplierId),
      provider.performance.listBySupplier(supplierId),
      userId ? provider.notifications.listByUser(userId) : Promise.resolve([] as Notification[]),
    ]);

    const application =
      apps.sort((a, b) =>
        (b.submittedAt ?? b.createdAt).localeCompare(a.submittedAt ?? a.createdAt),
      )[0] ?? null;

    const booking = application
      ? await provider.bookings.getByApplication(application.id)
      : null;

    // Resolve friendly labels for expiring documents.
    const requirements = supplier
      ? await provider.config.listDocumentRequirements(supplier.supplierTypeId)
      : [];
    const labelByReq = new Map(requirements.map((r) => [r.id, r.label]));

    return {
      supplier,
      application,
      booking,
      avl,
      expiringDocuments: expiringDocuments(docs).map((document) => ({
        document,
        label: labelByReq.get(document.requirementId) ?? "Document",
      })),
      latestPerformance: averagePerformance(perf.map((p) => p.weightedTotal)),
      notifications: notifs.sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    };
  },

  async forAdmin(): Promise<AdminDashboard> {
    const provider = db();
    const [{ items: apps }, { items: suppliers }, { items: avl }, { items: bookings }] =
      await Promise.all([
        provider.applications.list({ pageSize: 500 }),
        provider.suppliers.list({ pageSize: 500 }),
        provider.avl.list({ pageSize: 500 }),
        provider.bookings.list({ pageSize: 500 }),
      ]);

    const categories = await provider.config.listCategories();
    const catLabel = new Map(categories.map((c) => [c.id, c.label]));

    const pendingReview = apps.filter((a) => a.status === "IN_PROGRESS").length;
    const approved = suppliers.filter((s) => s.vendorTier === "STRATEGIC" || s.vendorTier === "APPROVED").length;
    const conditional = suppliers.filter((s) => s.vendorTier === "CONDITIONAL").length;
    const rejected = apps.filter((a) => a.status === "REJECTED").length;

    const decided = apps.filter((a) => a.status === "APPROVED" || a.status === "REJECTED");
    const approvalRate = decided.length
      ? Math.round((decided.filter((a) => a.status === "APPROVED").length / decided.length) * 100)
      : 0;

    // Applications by month (last 6 months present in data)
    const byMonth = new Map<string, number>();
    for (const a of apps) {
      const key = (a.submittedAt ?? a.createdAt).slice(0, 7);
      byMonth.set(key, (byMonth.get(key) ?? 0) + 1);
    }
    const applicationsByMonth = [...byMonth.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, count]) => ({ month, count }));

    // Category distribution across suppliers
    const catCounts = new Map<string, number>();
    for (const s of suppliers) {
      for (const cid of s.categoryIds) {
        const label = catLabel.get(cid) ?? cid;
        catCounts.set(label, (catCounts.get(label) ?? 0) + 1);
      }
    }
    const categoryDistribution = [...catCounts.entries()]
      .sort(([, a], [, b]) => b - a)
      .map(([category, count]) => ({ category, count }));

    const documentsExpiringSoon = (
      await Promise.all(
        suppliers.map((s) => provider.documents.listBySupplier(s.id)),
      )
    )
      .flat()
      .filter((d) => {
        if (!d.expiryDate) return false;
        const days = (new Date(d.expiryDate).getTime() - Date.now()) / 86_400_000;
        return days <= 90;
      }).length;

    return {
      stats: {
        applications: apps.length,
        pendingReview,
        approvedVendors: approved,
        conditionalVendors: conditional,
        rejectedVendors: rejected,
        upcomingPresentations: bookings.filter((b) => b.status === "CONFIRMED").length,
        documentsExpiringSoon,
      },
      applicationsByMonth,
      categoryDistribution,
      approvalRate,
    };
  },
};
