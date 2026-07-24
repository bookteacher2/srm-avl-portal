/**
 * Repository contracts.
 *
 * These interfaces are the ONLY thing the service layer depends on. Any data
 * source — the in-memory mock, PostgreSQL/Prisma, SharePoint Lists, Excel on
 * OneDrive, SQL Server, a REST API, or SAP/ERP — becomes a drop-in provider by
 * implementing `DataProvider`. UI components never import a provider or these
 * contracts directly; they call the service layer, which calls a provider.
 */
import type {
  Application,
  AvlRecord,
  Category,
  ComplianceItem,
  DocumentRequirement,
  Evaluation,
  EvaluationCriterion,
  ID,
  Notification,
  PerformanceCriterion,
  PerformanceEvaluation,
  PresentationBooking,
  Project,
  ServiceArea,
  Supplier,
  SupplierDocument,
  SupplierType,
  User,
} from "@/types";
import type { Paginated, QueryOptions } from "@/types";

/** Read operations shared by all collection repositories. */
export interface ReadRepository<T> {
  getById(id: ID): Promise<T | null>;
  list(options?: QueryOptions): Promise<Paginated<T>>;
}

/** Full CRUD repository. Create/update take partial payloads. */
export interface CrudRepository<T> extends ReadRepository<T> {
  create(data: Omit<Partial<T>, "id">): Promise<T>;
  update(id: ID, data: Partial<T>): Promise<T>;
  remove(id: ID): Promise<void>; // soft delete in real providers
}

/* ---- Reference / configuration repositories (read-mostly) ---------- */

export interface ConfigRepository {
  listSupplierTypes(): Promise<SupplierType[]>;
  listCategories(supplierTypeId?: ID): Promise<Category[]>;
  listServiceAreas(): Promise<ServiceArea[]>;
  listDocumentRequirements(supplierTypeId: ID): Promise<DocumentRequirement[]>;
  listEvaluationCriteria(supplierTypeId: ID): Promise<EvaluationCriterion[]>;
  listComplianceItems(supplierTypeId: ID): Promise<ComplianceItem[]>;
  listPerformanceCriteria(): Promise<PerformanceCriterion[]>;
}

/* ---- Aggregate repositories --------------------------------------- */

export interface SupplierRepository extends CrudRepository<Supplier> {
  getByVendorCode(vendorCode: string): Promise<Supplier | null>;
}

export interface UserRepository extends CrudRepository<User> {
  getByEmail(email: string): Promise<User | null>;
}

export interface ApplicationRepository extends CrudRepository<Application> {
  listBySupplier(supplierId: ID): Promise<Application[]>;
}

export interface DocumentRepository extends CrudRepository<SupplierDocument> {
  listBySupplier(supplierId: ID): Promise<SupplierDocument[]>;
}

export interface BookingRepository extends CrudRepository<PresentationBooking> {
  listByDate(dateISO: string): Promise<PresentationBooking[]>;
  getByApplication(applicationId: ID): Promise<PresentationBooking | null>;
}

export interface EvaluationRepository extends CrudRepository<Evaluation> {
  getByApplication(applicationId: ID): Promise<Evaluation | null>;
}

export interface AvlRepository extends CrudRepository<AvlRecord> {
  getCurrentForSupplier(supplierId: ID): Promise<AvlRecord | null>;
}

export interface PerformanceRepository
  extends CrudRepository<PerformanceEvaluation> {
  listBySupplier(supplierId: ID): Promise<PerformanceEvaluation[]>;
}

export interface ProjectRepository extends CrudRepository<Project> {
  listBySupplier(supplierId: ID): Promise<Project[]>;
}

export interface NotificationRepository extends CrudRepository<Notification> {
  listByUser(userId: ID): Promise<Notification[]>;
  markRead(id: ID): Promise<void>;
}

/**
 * The full set of repositories a data source must expose.
 * Implement this interface to add a new backend.
 */
export interface DataProvider {
  readonly name: string;
  config: ConfigRepository;
  users: UserRepository;
  suppliers: SupplierRepository;
  applications: ApplicationRepository;
  documents: DocumentRepository;
  bookings: BookingRepository;
  evaluations: EvaluationRepository;
  avl: AvlRepository;
  performance: PerformanceRepository;
  projects: ProjectRepository;
  notifications: NotificationRepository;
}
