/**
 * Mock data provider — default backend for the app.
 *
 * Implements the full `DataProvider` contract against in-memory collections
 * seeded with realistic sample data. Swapping to a real backend means writing
 * another module that implements the same contract (see providers/index.ts).
 */
import type {
  ApplicationRepository,
  AvlRepository,
  BookingRepository,
  ConfigRepository,
  DataProvider,
  DocumentRepository,
  EvaluationRepository,
  NotificationRepository,
  PerformanceRepository,
  ProjectRepository,
  SupplierRepository,
  UserRepository,
} from "../../contracts";
import { withLatency } from "../../latency";
import { MockCollection } from "./collection";
import {
  categories,
  complianceItems,
  documentRequirements,
  evaluationCriteria,
  performanceCriteria,
  serviceAreas,
  supplierTypes,
} from "./dataset/config";
import {
  applications,
  avlRecords,
  bookings,
  documents,
  evaluations,
  notifications,
  performanceEvaluations,
  projects,
  suppliers,
  users,
} from "./dataset/seed";

/* ---- Collections ---------------------------------------------------- */
const usersCol = new MockCollection(users, "usr", ["name", "email"]);
const suppliersCol = new MockCollection(suppliers, "sup", ["companyName", "vendorCode", "taxId"]);
const applicationsCol = new MockCollection(applications, "app", ["referenceCode"]);
const documentsCol = new MockCollection(documents, "doc", []);
const bookingsCol = new MockCollection(bookings, "bk", []);
const evaluationsCol = new MockCollection(evaluations, "ev", []);
const avlCol = new MockCollection(avlRecords, "avl", []);
const performanceCol = new MockCollection(performanceEvaluations, "pe", ["projectName"]);
const projectsCol = new MockCollection(projects, "prj", ["name", "code"]);
const notificationsCol = new MockCollection(notifications, "ntf", ["title"]);

/* ---- Config repository (read-only reference data) ------------------- */
const config: ConfigRepository = {
  listSupplierTypes: () => withLatency([...supplierTypes].sort((a, b) => a.sortOrder - b.sortOrder)),
  listCategories: (supplierTypeId) =>
    withLatency(categories.filter((c) => !supplierTypeId || c.supplierTypeId === supplierTypeId)),
  listServiceAreas: () => withLatency([...serviceAreas]),
  listDocumentRequirements: (supplierTypeId) =>
    withLatency(
      documentRequirements
        .filter((d) => d.supplierTypeId === supplierTypeId)
        .sort((a, b) => a.sortOrder - b.sortOrder),
    ),
  listEvaluationCriteria: (supplierTypeId) =>
    withLatency(evaluationCriteria.filter((c) => c.supplierTypeId === supplierTypeId)),
  listComplianceItems: (supplierTypeId) =>
    withLatency(complianceItems.filter((c) => c.supplierTypeId === supplierTypeId)),
  listPerformanceCriteria: () => withLatency([...performanceCriteria]),
};

/* ---- Aggregate repositories ---------------------------------------- */
const usersRepo: UserRepository = {
  getById: (id) => usersCol.getById(id),
  list: (o) => usersCol.list(o),
  create: (d) => usersCol.create(d),
  update: (id, d) => usersCol.update(id, d),
  remove: (id) => usersCol.remove(id),
  getByEmail: (email) => usersCol.findOne((u) => u.email.toLowerCase() === email.toLowerCase()),
};

const suppliersRepo: SupplierRepository = {
  getById: (id) => suppliersCol.getById(id),
  list: (o) => suppliersCol.list(o),
  create: (d) => suppliersCol.create(d),
  update: (id, d) => suppliersCol.update(id, d),
  remove: (id) => suppliersCol.remove(id),
  getByVendorCode: (code) => suppliersCol.findOne((s) => s.vendorCode === code),
};

const applicationsRepo: ApplicationRepository = {
  getById: (id) => applicationsCol.getById(id),
  list: (o) => applicationsCol.list(o),
  create: (d) => applicationsCol.create(d),
  update: (id, d) => applicationsCol.update(id, d),
  remove: (id) => applicationsCol.remove(id),
  listBySupplier: (supplierId) => applicationsCol.findMany((a) => a.supplierId === supplierId),
};

const documentsRepo: DocumentRepository = {
  getById: (id) => documentsCol.getById(id),
  list: (o) => documentsCol.list(o),
  create: (d) => documentsCol.create(d),
  update: (id, d) => documentsCol.update(id, d),
  remove: (id) => documentsCol.remove(id),
  listBySupplier: (supplierId) => documentsCol.findMany((d) => d.supplierId === supplierId),
};

const bookingsRepo: BookingRepository = {
  getById: (id) => bookingsCol.getById(id),
  list: (o) => bookingsCol.list(o),
  create: (d) => bookingsCol.create(d),
  update: (id, d) => bookingsCol.update(id, d),
  remove: (id) => bookingsCol.remove(id),
  listByDate: (dateISO) => bookingsCol.findMany((b) => b.date === dateISO),
  getByApplication: (applicationId) =>
    bookingsCol.findOne((b) => b.applicationId === applicationId),
};

const evaluationsRepo: EvaluationRepository = {
  getById: (id) => evaluationsCol.getById(id),
  list: (o) => evaluationsCol.list(o),
  create: (d) => evaluationsCol.create(d),
  update: (id, d) => evaluationsCol.update(id, d),
  remove: (id) => evaluationsCol.remove(id),
  getByApplication: (applicationId) =>
    evaluationsCol.findOne((e) => e.applicationId === applicationId),
};

const avlRepo: AvlRepository = {
  getById: (id) => avlCol.getById(id),
  list: (o) => avlCol.list(o),
  create: (d) => avlCol.create(d),
  update: (id, d) => avlCol.update(id, d),
  remove: (id) => avlCol.remove(id),
  getCurrentForSupplier: (supplierId) =>
    avlCol.findOne((a) => a.supplierId === supplierId),
};

const performanceRepo: PerformanceRepository = {
  getById: (id) => performanceCol.getById(id),
  list: (o) => performanceCol.list(o),
  create: (d) => performanceCol.create(d),
  update: (id, d) => performanceCol.update(id, d),
  remove: (id) => performanceCol.remove(id),
  listBySupplier: (supplierId) =>
    performanceCol.findMany((p) => p.supplierId === supplierId),
};

const projectsRepo: ProjectRepository = {
  getById: (id) => projectsCol.getById(id),
  list: (o) => projectsCol.list(o),
  create: (d) => projectsCol.create(d),
  update: (id, d) => projectsCol.update(id, d),
  remove: (id) => projectsCol.remove(id),
  listBySupplier: (supplierId) => projectsCol.findMany((p) => p.supplierId === supplierId),
};

const notificationsRepo: NotificationRepository = {
  getById: (id) => notificationsCol.getById(id),
  list: (o) => notificationsCol.list(o),
  create: (d) => notificationsCol.create(d),
  update: (id, d) => notificationsCol.update(id, d),
  remove: (id) => notificationsCol.remove(id),
  listByUser: (userId) => notificationsCol.findMany((n) => n.userId === userId),
  markRead: async (id) => {
    await notificationsCol.update(id, { read: true });
  },
};

export const mockProvider: DataProvider = {
  name: "mock",
  config,
  users: usersRepo,
  suppliers: suppliersRepo,
  applications: applicationsRepo,
  documents: documentsRepo,
  bookings: bookingsRepo,
  evaluations: evaluationsRepo,
  avl: avlRepo,
  performance: performanceRepo,
  projects: projectsRepo,
  notifications: notificationsRepo,
};
