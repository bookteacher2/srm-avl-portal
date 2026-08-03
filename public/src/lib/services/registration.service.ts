/**
 * Registration service.
 *
 * Core business rule (Revision 1.1): a single registration action immediately
 * creates BOTH a Supplier record and an Application record, and the same
 * records are advanced through the rest of the lifecycle. Registration is
 * lightweight — only company details, contacts, categories and the Company
 * Profile are captured. All other documents are collected later, after the
 * committee presentation and a "Qualified" decision.
 */
import { getProvider } from "@/lib/data/providers";
import type { Application, Supplier } from "@/types";
import type { RegistrationInput } from "@/lib/validation/registration";

const db = () => getProvider();

function code(prefix: string): string {
  const year = new Date().getFullYear();
  const n = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${year}-${n}`;
}

export interface RegistrationResult {
  supplier: Supplier;
  application: Application;
}

export const registrationService = {
  /**
   * Register a new supplier. Creates the Supplier + Application atomically
   * (from the UI's perspective) and returns both, including their IDs.
   */
  async register(input: RegistrationInput): Promise<RegistrationResult> {
    const provider = db();
    const now = new Date().toISOString();

    const contacts = [
      {
        id: "c-primary",
        type: "PRIMARY" as const,
        name: input.primaryContactName,
        position: input.primaryContactPosition,
        phone: input.primaryContactPhone,
        email: input.primaryContactEmail,
      },
      ...(input.financeSameAsPrimary
        ? []
        : [
            {
              id: "c-finance",
              type: "FINANCE" as const,
              name: input.financeContactName ?? "",
              position: input.financeContactPosition ?? "",
              phone: input.financeContactPhone ?? "",
              email: input.financeContactEmail ?? "",
            },
          ]),
    ];

    // 1) Create the Supplier record.
    const supplier = await provider.suppliers.create({
      vendorCode: code("V"),
      companyName: input.companyName,
      supplierTypeId: input.supplierTypeId,
      taxId: input.taxId,
      registrationNumber: input.registrationNumber,
      yearEstablished: input.yearEstablished,
      website: input.website || null,
      registeredCapital: input.registeredCapital ?? null,
      employeeCount: input.employeeCount ?? null,
      businessDescription: input.businessDescription,
      addresses: [
        {
          id: "addr-registered",
          type: "REGISTERED",
          line1: input.registeredAddress,
          province: "",
          postalCode: "",
          country: "Thailand",
        },
      ],
      contacts,
      categoryIds: input.categoryIds,
      serviceAreaIds: input.serviceAreaIds,
      avlStatus: "SUSPENDED",
      vendorTier: "NONE",
      currentScore: null,
      blacklistFlag: false,
    });

    // 2) Create the Application record linked to the Supplier.
    const application = await provider.applications.create({
      referenceCode: code("APP"),
      supplierId: supplier.id,
      cycle: "INITIAL",
      currentStage: "REGISTERED",
      status: "IN_PROGRESS",
      submittedAt: now,
      decisionAt: null,
      stageEvents: [
        { id: "se-registered", stage: "REGISTERED", status: "COMPLETED", occurredAt: now },
        { id: "se-screening", stage: "SCREENING", status: "IN_PROGRESS", occurredAt: null },
      ],
      reviews: [],
    });

    return { supplier, application };
  },
};
