/** Application workflow service. */
import { getProvider } from "@/lib/data/providers";
import { stageProgress } from "@/lib/domain/application";
import type { Application, ApplicationStage, DecisionOutcome, ID, QueryOptions } from "@/types";

const db = () => getProvider();

// Mark a stage event within an application and return the updated events array.
function setStageEvent(
  app: Application,
  stage: ApplicationStage,
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "REJECTED",
  occurredAt: string,
  note?: string,
) {
  return app.stageEvents.map((e) =>
    e.stage === stage ? { ...e, status, occurredAt, note: note ?? e.note } : e,
  );
}

export const applicationService = {
  list: (options?: QueryOptions) => db().applications.list(options),
  getById: (id: ID) => db().applications.getById(id),
  listBySupplier: (supplierId: ID) => db().applications.listBySupplier(supplierId),

  /** Public lookup by reference code (used by the public status tracker). */
  async getByReference(referenceCode: string): Promise<Application | null> {
    const ref = referenceCode.trim().toUpperCase();
    if (!ref) return null;
    const { items } = await db().applications.list({ pageSize: 1000 });
    return items.find((a) => a.referenceCode.toUpperCase() === ref) ?? null;
  },

  /** Most recent application for a supplier (by submittedAt/createdAt). */
  async currentForSupplier(supplierId: ID): Promise<Application | null> {
    const apps = await db().applications.listBySupplier(supplierId);
    if (!apps.length) return null;
    return apps.sort((a, b) =>
      (b.submittedAt ?? b.createdAt).localeCompare(a.submittedAt ?? a.createdAt),
    )[0]!;
  },

  progress: (app: Application) => stageProgress(app.currentStage),

  update: (id: ID, data: Partial<Application>) => db().applications.update(id, data),

  /**
   * Record the committee decision at the DECISION gate.
   * Business rules:
   *  - QUALIFIED  -> advance to DOCUMENT_UPLOAD (documents now requested).
   *  - MORE_INFO  -> stay at DECISION; supplier must provide more information.
   *  - REJECT     -> application ends as REJECTED.
   */
  async recordDecision(applicationId: ID, outcome: DecisionOutcome, note?: string): Promise<Application> {
    const app = await db().applications.getById(applicationId);
    if (!app) throw new Error("Application not found");
    const now = new Date().toISOString();

    let events = setStageEvent(
      app,
      "DECISION",
      outcome === "MORE_INFO" ? "IN_PROGRESS" : "COMPLETED",
      now,
      note,
    );
    let currentStage: ApplicationStage = app.currentStage;
    let status = app.status;

    if (outcome === "QUALIFIED") {
      currentStage = "DOCUMENT_UPLOAD";
      status = "QUALIFIED";
      events = events.map((e) =>
        e.stage === "DOCUMENT_UPLOAD" ? { ...e, status: "IN_PROGRESS" as const } : e,
      );
    } else if (outcome === "REJECT") {
      currentStage = "REJECTED";
      status = "REJECTED";
    } else if (outcome === "MORE_INFO") {
      currentStage = "DECISION";
      status = "MORE_INFO";
    }

    return db().applications.update(applicationId, {
      decisionOutcome: outcome,
      currentStage,
      status,
      decisionAt: now,
      stageEvents: events,
    });
  },

  /** Generic stage advance (used for verification -> AVL approval). */
  async advanceStage(applicationId: ID, toStage: ApplicationStage, note?: string): Promise<Application> {
    const app = await db().applications.getById(applicationId);
    if (!app) throw new Error("Application not found");
    const now = new Date().toISOString();
    const events = setStageEvent(app, toStage, "IN_PROGRESS", now, note);
    return db().applications.update(applicationId, { currentStage: toStage, stageEvents: events });
  },
};
