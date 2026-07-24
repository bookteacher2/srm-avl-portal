/**
 * Service layer barrel — the public API for the UI.
 *
 * Components import ONLY from here (or the individual service files). They must
 * never import a repository, provider, or the mock dataset directly. This is
 * what lets the backend change (Prisma, SharePoint, Excel, MSSQL, REST, SAP)
 * without touching a single component.
 */
export { applicationService } from "./application.service";
export { authService } from "./auth.service";
export { avlService } from "./avl.service";
export { bookingService } from "./booking.service";
export { configService } from "./config.service";
export { dashboardService } from "./dashboard.service";
export { documentService } from "./document.service";
export { evaluationService } from "./evaluation.service";
export { notificationService } from "./notification.service";
export { performanceService } from "./performance.service";
export { supplierService } from "./supplier.service";

export type { AdminDashboard, SupplierDashboard, ExpiringDocument } from "./dashboard.service";
