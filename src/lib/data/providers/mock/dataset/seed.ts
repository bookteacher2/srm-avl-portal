/**
 * Realistic sample data for the mock provider.
 *
 * Everything here is plausible EPC procurement data (Thai Solar/EV contractors)
 * so the UI behaves like a real portal. No component imports this directly —
 * the mock provider loads it, the service layer reads the provider.
 */
import type {
  Application,
  AvlRecord,
  Evaluation,
  Notification,
  PerformanceEvaluation,
  PresentationBooking,
  Project,
  Supplier,
  SupplierDocument,
  User,
} from "@/types";
import { CONTRACTOR_TYPE_ID } from "./config";

const audit = (createdAt: string, updatedAt = createdAt) => ({
  createdAt,
  updatedAt,
  createdById: null,
  updatedById: null,
});

/* ------------------------------------------------------------------ */
/* Users — one supplier login per demo supplier + internal staff       */
/* ------------------------------------------------------------------ */

export const users: User[] = [
  {
    id: "usr-sup-1",
    email: "contact@sunnivasolar.co.th",
    name: "Anong Prasert",
    role: "SUPPLIER",
    supplierId: "sup-1",
    avatarUrl: null,
    isActive: true,
    ...audit("2025-11-02T08:00:00.000Z"),
  },
  {
    id: "usr-sup-4",
    email: "bd@greenvolt.co.th",
    name: "Kittipong Sae-lim",
    role: "SUPPLIER",
    supplierId: "sup-4",
    avatarUrl: null,
    isActive: true,
    ...audit("2026-06-10T08:00:00.000Z"),
  },
  {
    id: "usr-admin",
    email: "admin@epc-procurement.co.th",
    name: "Procurement Admin",
    role: "ADMIN",
    supplierId: null,
    avatarUrl: null,
    isActive: true,
    ...audit("2025-01-05T08:00:00.000Z"),
  },
  {
    id: "usr-procurement",
    email: "procurement@epc-procurement.co.th",
    name: "Warisara Chai",
    role: "PROCUREMENT",
    supplierId: null,
    avatarUrl: null,
    isActive: true,
    ...audit("2025-01-05T08:00:00.000Z"),
  },
  {
    id: "usr-engineering",
    email: "engineering@epc-procurement.co.th",
    name: "Somchai Ratanakul",
    role: "ENGINEERING_REVIEWER",
    supplierId: null,
    avatarUrl: null,
    isActive: true,
    ...audit("2025-01-05T08:00:00.000Z"),
  },
  {
    id: "usr-hse",
    email: "hse@epc-procurement.co.th",
    name: "Pichaya Wong",
    role: "HSE_REVIEWER",
    supplierId: null,
    avatarUrl: null,
    isActive: true,
    ...audit("2025-01-05T08:00:00.000Z"),
  },
  {
    id: "usr-finance",
    email: "finance@epc-procurement.co.th",
    name: "Natthapong Lek",
    role: "FINANCE",
    supplierId: null,
    avatarUrl: null,
    isActive: true,
    ...audit("2025-01-05T08:00:00.000Z"),
  },
];

/* ------------------------------------------------------------------ */
/* Suppliers                                                           */
/* ------------------------------------------------------------------ */

export const suppliers: Supplier[] = [
  {
    id: "sup-1",
    vendorCode: "V-2025-0007",
    companyName: "Sunniva Solar Engineering Co., Ltd.",
    supplierTypeId: CONTRACTOR_TYPE_ID,
    taxId: "0105558012345",
    registrationNumber: "0105558012345",
    yearEstablished: 2015,
    website: "https://sunnivasolar.co.th",
    registeredCapital: 50_000_000,
    employeeCount: 145,
    businessDescription:
      "Turnkey Solar EPC contractor delivering rooftop and ground-mount PV systems for industrial and utility clients across Thailand.",
    addresses: [
      {
        id: "addr-1",
        type: "REGISTERED",
        line1: "88/12 Bangna-Trad Road, Bang Kaeo",
        district: "Bang Phli",
        province: "Samut Prakan",
        postalCode: "10540",
        country: "Thailand",
      },
    ],
    contacts: [
      { id: "c-1", type: "PRIMARY", name: "Anong Prasert", position: "Business Development Director", phone: "+66 2 750 1200", email: "contact@sunnivasolar.co.th" },
      { id: "c-2", type: "FINANCE", name: "Sudarat Meesap", position: "Finance Manager", phone: "+66 2 750 1205", email: "finance@sunnivasolar.co.th" },
    ],
    categoryIds: ["cat-solar-epc", "cat-electrical", "cat-commissioning"],
    serviceAreaIds: ["area-nationwide"],
    avlStatus: "ACTIVE",
    vendorTier: "STRATEGIC",
    currentScore: 92,
    blacklistFlag: false,
    remarks: "Preferred solar EPC partner for utility-scale projects.",
    ...audit("2025-11-02T08:00:00.000Z", "2026-01-20T08:00:00.000Z"),
  },
  {
    id: "sup-2",
    vendorCode: "V-2025-0012",
    companyName: "Voltway EV Infrastructure Co., Ltd.",
    supplierTypeId: CONTRACTOR_TYPE_ID,
    taxId: "0105559098765",
    registrationNumber: "0105559098765",
    yearEstablished: 2018,
    website: "https://voltway.co.th",
    registeredCapital: 20_000_000,
    employeeCount: 62,
    businessDescription:
      "Specialist EV charger installation contractor for AC and DC fast-charging stations, including civil and electrical works.",
    addresses: [
      {
        id: "addr-2",
        type: "REGISTERED",
        line1: "191 Ratchadaphisek Road, Din Daeng",
        district: "Din Daeng",
        province: "Bangkok",
        postalCode: "10400",
        country: "Thailand",
      },
    ],
    contacts: [
      { id: "c-3", type: "PRIMARY", name: "Thanawat Boon", position: "Managing Director", phone: "+66 2 245 8800", email: "info@voltway.co.th" },
    ],
    categoryIds: ["cat-ev", "cat-electrical", "cat-civil"],
    serviceAreaIds: ["area-bangkok", "area-central", "area-east"],
    avlStatus: "ACTIVE",
    vendorTier: "APPROVED",
    currentScore: 84,
    blacklistFlag: false,
    remarks: null,
    ...audit("2025-12-01T08:00:00.000Z", "2026-02-11T08:00:00.000Z"),
  },
  {
    id: "sup-3",
    vendorCode: "V-2026-0003",
    companyName: "Thanakit Civil & Electrical Co., Ltd.",
    supplierTypeId: CONTRACTOR_TYPE_ID,
    taxId: "0105560011223",
    registrationNumber: "0105560011223",
    yearEstablished: 2012,
    website: null,
    registeredCapital: 15_000_000,
    employeeCount: 88,
    businessDescription:
      "Civil and electrical works contractor supporting solar farm foundations, substations, and site infrastructure.",
    addresses: [
      {
        id: "addr-3",
        type: "REGISTERED",
        line1: "45 Mittraphap Road, Nai Muang",
        district: "Mueang",
        province: "Nakhon Ratchasima",
        postalCode: "30000",
        country: "Thailand",
      },
    ],
    contacts: [
      { id: "c-4", type: "PRIMARY", name: "Prayut Thanakit", position: "Project Director", phone: "+66 44 245 100", email: "office@thanakit.co.th" },
    ],
    categoryIds: ["cat-civil", "cat-electrical"],
    serviceAreaIds: ["area-northeast", "area-central"],
    avlStatus: "CONDITIONAL",
    vendorTier: "CONDITIONAL",
    currentScore: 72,
    blacklistFlag: false,
    remarks: "Conditional pending updated ISO 45001 certification.",
    ...audit("2026-02-15T08:00:00.000Z", "2026-04-02T08:00:00.000Z"),
  },
  {
    id: "sup-4",
    vendorCode: "V-2026-0018",
    companyName: "GreenVolt Power Systems Co., Ltd.",
    supplierTypeId: CONTRACTOR_TYPE_ID,
    taxId: "0105561033445",
    registrationNumber: "0105561033445",
    yearEstablished: 2020,
    website: "https://greenvolt.co.th",
    registeredCapital: 10_000_000,
    employeeCount: 34,
    businessDescription:
      "Growing solar and EV installation contractor focused on commercial rooftop systems and destination charging.",
    addresses: [
      {
        id: "addr-4",
        type: "REGISTERED",
        line1: "302/5 Chang Klan Road",
        district: "Mueang",
        province: "Chiang Mai",
        postalCode: "50100",
        country: "Thailand",
      },
    ],
    contacts: [
      { id: "c-5", type: "PRIMARY", name: "Kittipong Sae-lim", position: "Co-Founder", phone: "+66 53 210 900", email: "bd@greenvolt.co.th" },
    ],
    categoryIds: ["cat-solar-epc", "cat-ev"],
    serviceAreaIds: ["area-north"],
    avlStatus: "SUSPENDED",
    vendorTier: "NONE",
    currentScore: null,
    blacklistFlag: false,
    remarks: null,
    ...audit("2026-06-10T08:00:00.000Z", "2026-07-14T08:00:00.000Z"),
  },
  {
    id: "sup-5",
    vendorCode: "V-2026-0021",
    companyName: "Siam Renewable Contractors Co., Ltd.",
    supplierTypeId: CONTRACTOR_TYPE_ID,
    taxId: "0105562055667",
    registrationNumber: "0105562055667",
    yearEstablished: 2016,
    website: null,
    registeredCapital: 25_000_000,
    employeeCount: 110,
    businessDescription:
      "Mechanical and O&M contractor for renewable energy plants, including preventive and corrective maintenance.",
    addresses: [
      {
        id: "addr-5",
        type: "REGISTERED",
        line1: "12 Utapao Road, Ban Chang",
        district: "Ban Chang",
        province: "Rayong",
        postalCode: "21130",
        country: "Thailand",
      },
    ],
    contacts: [
      { id: "c-6", type: "PRIMARY", name: "Rungroj Saeng", position: "Operations Manager", phone: "+66 38 601 400", email: "ops@siamrenewable.co.th" },
    ],
    categoryIds: ["cat-mechanical", "cat-om", "cat-maintenance"],
    serviceAreaIds: ["area-east", "area-central"],
    avlStatus: "SUSPENDED",
    vendorTier: "NONE",
    currentScore: null,
    blacklistFlag: false,
    remarks: null,
    ...audit("2026-07-05T08:00:00.000Z"),
  },
  {
    id: "sup-6",
    vendorCode: "V-2026-0009",
    companyName: "EcoCharge Solutions Co., Ltd.",
    supplierTypeId: CONTRACTOR_TYPE_ID,
    taxId: "0105560077889",
    registrationNumber: "0105560077889",
    yearEstablished: 2021,
    website: null,
    registeredCapital: 5_000_000,
    employeeCount: 18,
    businessDescription:
      "EV charger installation start-up focused on residential and small commercial AC chargers.",
    addresses: [
      {
        id: "addr-6",
        type: "REGISTERED",
        line1: "77 Phuket Road, Talat Yai",
        district: "Mueang",
        province: "Phuket",
        postalCode: "83000",
        country: "Thailand",
      },
    ],
    contacts: [
      { id: "c-7", type: "PRIMARY", name: "Naruedol Chan", position: "Founder", phone: "+66 76 210 300", email: "hello@ecocharge.co.th" },
    ],
    categoryIds: ["cat-ev"],
    serviceAreaIds: ["area-south"],
    avlStatus: "EXPIRED",
    vendorTier: "NONE",
    currentScore: 58,
    blacklistFlag: false,
    remarks: "Did not meet minimum technical capability threshold in 2026 cycle.",
    ...audit("2026-03-20T08:00:00.000Z", "2026-05-30T08:00:00.000Z"),
  },
  {
    id: "sup-7",
    vendorCode: "V-2026-0002",
    companyName: "Northern Grid Mechanical Co., Ltd.",
    supplierTypeId: CONTRACTOR_TYPE_ID,
    taxId: "0505558022110",
    registrationNumber: "0505558022110",
    yearEstablished: 2011,
    website: "https://northerngrid.co.th",
    registeredCapital: 30_000_000,
    employeeCount: 96,
    businessDescription:
      "Mechanical and commissioning contractor for substations, inverter stations, and balance-of-plant works.",
    addresses: [
      {
        id: "addr-7",
        type: "REGISTERED",
        line1: "55 Superhighway Road, Chang Phueak",
        district: "Mueang",
        province: "Chiang Mai",
        postalCode: "50300",
        country: "Thailand",
      },
    ],
    contacts: [
      { id: "c-8", type: "PRIMARY", name: "Wichai Somboon", position: "General Manager", phone: "+66 53 400 700", email: "gm@northerngrid.co.th" },
    ],
    categoryIds: ["cat-mechanical", "cat-commissioning", "cat-electrical"],
    serviceAreaIds: ["area-north", "area-northeast"],
    avlStatus: "ACTIVE",
    vendorTier: "APPROVED",
    currentScore: 81,
    blacklistFlag: false,
    remarks: null,
    ...audit("2026-01-28T08:00:00.000Z", "2026-02-20T08:00:00.000Z"),
  },
  {
    id: "sup-8",
    vendorCode: "V-2026-0014",
    companyName: "Andaman Solar Solutions Co., Ltd.",
    supplierTypeId: CONTRACTOR_TYPE_ID,
    taxId: "0835559044556",
    registrationNumber: "0835559044556",
    yearEstablished: 2019,
    website: null,
    registeredCapital: 8_000_000,
    employeeCount: 41,
    businessDescription:
      "Rooftop Solar EPC contractor serving resorts and commercial buildings across the Andaman coast.",
    addresses: [
      {
        id: "addr-8",
        type: "REGISTERED",
        line1: "120 Thepkrasattri Road, Ratsada",
        district: "Mueang",
        province: "Phuket",
        postalCode: "83000",
        country: "Thailand",
      },
    ],
    contacts: [
      { id: "c-9", type: "PRIMARY", name: "Suchada Panit", position: "Director", phone: "+66 76 500 220", email: "info@andamansolar.co.th" },
    ],
    categoryIds: ["cat-solar-epc", "cat-electrical"],
    serviceAreaIds: ["area-south"],
    avlStatus: "CONDITIONAL",
    vendorTier: "CONDITIONAL",
    currentScore: 68,
    blacklistFlag: false,
    remarks: "Conditional pending stronger project references.",
    ...audit("2026-04-12T08:00:00.000Z", "2026-05-18T08:00:00.000Z"),
  },
  {
    id: "sup-9",
    vendorCode: "V-2026-0025",
    companyName: "Isan PowerWorks Co., Ltd.",
    supplierTypeId: CONTRACTOR_TYPE_ID,
    taxId: "0305560066778",
    registrationNumber: "0305560066778",
    yearEstablished: 2014,
    website: null,
    registeredCapital: 18_000_000,
    employeeCount: 73,
    businessDescription:
      "Civil and electrical EPC contractor for ground-mount solar farms across the northeastern region.",
    addresses: [
      {
        id: "addr-9",
        type: "REGISTERED",
        line1: "88 Chaiyaphum Road, Nai Mueang",
        district: "Mueang",
        province: "Ubon Ratchathani",
        postalCode: "34000",
        country: "Thailand",
      },
    ],
    contacts: [
      { id: "c-10", type: "PRIMARY", name: "Decha Ket", position: "Managing Director", phone: "+66 45 300 900", email: "office@isanpowerworks.co.th" },
    ],
    categoryIds: ["cat-civil", "cat-electrical", "cat-solar-epc"],
    serviceAreaIds: ["area-northeast"],
    avlStatus: "SUSPENDED",
    vendorTier: "NONE",
    currentScore: null,
    blacklistFlag: false,
    remarks: null,
    ...audit("2026-05-20T08:00:00.000Z"),
  },
];

/* ------------------------------------------------------------------ */
/* Applications (with stage timeline + reviews)                        */
/* ------------------------------------------------------------------ */

export const applications: Application[] = [
  {
    id: "app-1",
    referenceCode: "APP-2025-0087",
    supplierId: "sup-1",
    cycle: "INITIAL",
    currentStage: "APPROVED",
    status: "APPROVED",
    submittedAt: "2025-11-05T08:00:00.000Z",
    decisionAt: "2026-01-18T08:00:00.000Z",
    stageEvents: [
      { id: "se-1", stage: "SUBMITTED", status: "COMPLETED", occurredAt: "2025-11-05T08:00:00.000Z" },
      { id: "se-2", stage: "DOCUMENT_REVIEW", status: "COMPLETED", occurredAt: "2025-11-20T08:00:00.000Z" },
      { id: "se-3", stage: "TECHNICAL_REVIEW", status: "COMPLETED", occurredAt: "2025-12-08T08:00:00.000Z" },
      { id: "se-4", stage: "COMMERCIAL_REVIEW", status: "COMPLETED", occurredAt: "2025-12-18T08:00:00.000Z" },
      { id: "se-5", stage: "PRESENTATION_SCHEDULED", status: "COMPLETED", occurredAt: "2026-01-08T08:00:00.000Z" },
      { id: "se-6", stage: "COMMITTEE_EVALUATION", status: "COMPLETED", occurredAt: "2026-01-15T08:00:00.000Z" },
      { id: "se-7", stage: "APPROVED", status: "COMPLETED", occurredAt: "2026-01-18T08:00:00.000Z" },
    ],
    reviews: [
      { id: "rv-1", type: "DOCUMENT", reviewerRole: "PROCUREMENT", decision: "PASS", reviewerId: "usr-procurement", reviewedAt: "2025-11-20T08:00:00.000Z", comment: "All mandatory documents verified." },
      { id: "rv-2", type: "TECHNICAL", reviewerRole: "ENGINEERING_REVIEWER", decision: "PASS", reviewerId: "usr-engineering", reviewedAt: "2025-12-08T08:00:00.000Z", comment: "Strong utility-scale track record." },
      { id: "rv-3", type: "HSE", reviewerRole: "HSE_REVIEWER", decision: "PASS", reviewerId: "usr-hse", reviewedAt: "2025-12-10T08:00:00.000Z", comment: "ISO 45001 in place." },
      { id: "rv-4", type: "FINANCE", reviewerRole: "FINANCE", decision: "PASS", reviewerId: "usr-finance", reviewedAt: "2025-12-18T08:00:00.000Z", comment: "Healthy balance sheet." },
    ],
    ...audit("2025-11-05T08:00:00.000Z", "2026-01-18T08:00:00.000Z"),
  },
  {
    id: "app-4",
    referenceCode: "APP-2026-0142",
    supplierId: "sup-4",
    cycle: "INITIAL",
    currentStage: "PRESENTATION_SCHEDULED",
    status: "IN_PROGRESS",
    submittedAt: "2026-06-18T08:00:00.000Z",
    decisionAt: null,
    stageEvents: [
      { id: "se-41", stage: "SUBMITTED", status: "COMPLETED", occurredAt: "2026-06-18T08:00:00.000Z" },
      { id: "se-42", stage: "DOCUMENT_REVIEW", status: "COMPLETED", occurredAt: "2026-06-29T08:00:00.000Z" },
      { id: "se-43", stage: "TECHNICAL_REVIEW", status: "COMPLETED", occurredAt: "2026-07-08T08:00:00.000Z" },
      { id: "se-44", stage: "COMMERCIAL_REVIEW", status: "IN_PROGRESS", occurredAt: null },
      { id: "se-45", stage: "PRESENTATION_SCHEDULED", status: "IN_PROGRESS", occurredAt: "2026-07-16T08:00:00.000Z" },
      { id: "se-46", stage: "COMMITTEE_EVALUATION", status: "PENDING", occurredAt: null },
      { id: "se-47", stage: "APPROVED", status: "PENDING", occurredAt: null },
    ],
    reviews: [
      { id: "rv-41", type: "DOCUMENT", reviewerRole: "PROCUREMENT", decision: "PASS", reviewerId: "usr-procurement", reviewedAt: "2026-06-29T08:00:00.000Z", comment: "Documents complete." },
      { id: "rv-42", type: "TECHNICAL", reviewerRole: "ENGINEERING_REVIEWER", decision: "CONDITIONAL", reviewerId: "usr-engineering", reviewedAt: "2026-07-08T08:00:00.000Z", comment: "Limited utility-scale experience; recommend conditional." },
      { id: "rv-43", type: "COMMERCIAL", reviewerRole: "PROCUREMENT", decision: "PENDING", reviewerId: null, reviewedAt: null, comment: null },
      { id: "rv-44", type: "FINANCE", reviewerRole: "FINANCE", decision: "PENDING", reviewerId: null, reviewedAt: null, comment: null },
    ],
    ...audit("2026-06-18T08:00:00.000Z", "2026-07-16T08:00:00.000Z"),
  },
  {
    id: "app-5",
    referenceCode: "APP-2026-0155",
    supplierId: "sup-5",
    cycle: "INITIAL",
    currentStage: "DOCUMENT_REVIEW",
    status: "IN_PROGRESS",
    submittedAt: "2026-07-10T08:00:00.000Z",
    decisionAt: null,
    stageEvents: [
      { id: "se-51", stage: "SUBMITTED", status: "COMPLETED", occurredAt: "2026-07-10T08:00:00.000Z" },
      { id: "se-52", stage: "DOCUMENT_REVIEW", status: "IN_PROGRESS", occurredAt: null },
      { id: "se-53", stage: "TECHNICAL_REVIEW", status: "PENDING", occurredAt: null },
      { id: "se-54", stage: "COMMERCIAL_REVIEW", status: "PENDING", occurredAt: null },
      { id: "se-55", stage: "PRESENTATION_SCHEDULED", status: "PENDING", occurredAt: null },
      { id: "se-56", stage: "COMMITTEE_EVALUATION", status: "PENDING", occurredAt: null },
      { id: "se-57", stage: "APPROVED", status: "PENDING", occurredAt: null },
    ],
    reviews: [
      { id: "rv-51", type: "DOCUMENT", reviewerRole: "PROCUREMENT", decision: "PENDING", reviewerId: null, reviewedAt: null, comment: null },
    ],
    ...audit("2026-07-10T08:00:00.000Z"),
  },
  {
    id: "app-6",
    referenceCode: "APP-2026-0061",
    supplierId: "sup-6",
    cycle: "INITIAL",
    currentStage: "REJECTED",
    status: "REJECTED",
    submittedAt: "2026-03-22T08:00:00.000Z",
    decisionAt: "2026-05-28T08:00:00.000Z",
    stageEvents: [
      { id: "se-61", stage: "SUBMITTED", status: "COMPLETED", occurredAt: "2026-03-22T08:00:00.000Z" },
      { id: "se-62", stage: "DOCUMENT_REVIEW", status: "COMPLETED", occurredAt: "2026-04-05T08:00:00.000Z" },
      { id: "se-63", stage: "TECHNICAL_REVIEW", status: "COMPLETED", occurredAt: "2026-04-25T08:00:00.000Z" },
      { id: "se-64", stage: "COMMERCIAL_REVIEW", status: "COMPLETED", occurredAt: "2026-05-06T08:00:00.000Z" },
      { id: "se-65", stage: "PRESENTATION_SCHEDULED", status: "COMPLETED", occurredAt: "2026-05-14T08:00:00.000Z" },
      { id: "se-66", stage: "COMMITTEE_EVALUATION", status: "COMPLETED", occurredAt: "2026-05-27T08:00:00.000Z" },
      { id: "se-67", stage: "REJECTED", status: "REJECTED", occurredAt: "2026-05-28T08:00:00.000Z", note: "Total weighted score below minimum threshold." },
    ],
    reviews: [
      { id: "rv-61", type: "DOCUMENT", reviewerRole: "PROCUREMENT", decision: "PASS", reviewerId: "usr-procurement", reviewedAt: "2026-04-05T08:00:00.000Z", comment: null },
      { id: "rv-62", type: "TECHNICAL", reviewerRole: "ENGINEERING_REVIEWER", decision: "FAIL", reviewerId: "usr-engineering", reviewedAt: "2026-04-25T08:00:00.000Z", comment: "Insufficient DC fast-charging experience." },
    ],
    ...audit("2026-03-22T08:00:00.000Z", "2026-05-28T08:00:00.000Z"),
  },
  {
    id: "app-7",
    referenceCode: "APP-2026-0033",
    supplierId: "sup-7",
    cycle: "INITIAL",
    currentStage: "APPROVED",
    status: "APPROVED",
    submittedAt: "2026-02-02T08:00:00.000Z",
    decisionAt: "2026-02-18T08:00:00.000Z",
    stageEvents: [
      { id: "se-71", stage: "SUBMITTED", status: "COMPLETED", occurredAt: "2026-02-02T08:00:00.000Z" },
      { id: "se-72", stage: "DOCUMENT_REVIEW", status: "COMPLETED", occurredAt: "2026-02-06T08:00:00.000Z" },
      { id: "se-73", stage: "TECHNICAL_REVIEW", status: "COMPLETED", occurredAt: "2026-02-10T08:00:00.000Z" },
      { id: "se-74", stage: "COMMERCIAL_REVIEW", status: "COMPLETED", occurredAt: "2026-02-12T08:00:00.000Z" },
      { id: "se-75", stage: "PRESENTATION_SCHEDULED", status: "COMPLETED", occurredAt: "2026-02-15T08:00:00.000Z" },
      { id: "se-76", stage: "COMMITTEE_EVALUATION", status: "COMPLETED", occurredAt: "2026-02-17T08:00:00.000Z" },
      { id: "se-77", stage: "APPROVED", status: "COMPLETED", occurredAt: "2026-02-18T08:00:00.000Z" },
    ],
    reviews: [
      { id: "rv-71", type: "DOCUMENT", reviewerRole: "PROCUREMENT", decision: "PASS", reviewerId: "usr-procurement", reviewedAt: "2026-02-06T08:00:00.000Z", comment: null },
      { id: "rv-72", type: "TECHNICAL", reviewerRole: "ENGINEERING_REVIEWER", decision: "PASS", reviewerId: "usr-engineering", reviewedAt: "2026-02-10T08:00:00.000Z", comment: "Strong commissioning capability." },
    ],
    ...audit("2026-02-02T08:00:00.000Z", "2026-02-18T08:00:00.000Z"),
  },
  {
    id: "app-8",
    referenceCode: "APP-2026-0110",
    supplierId: "sup-8",
    cycle: "INITIAL",
    currentStage: "COMMITTEE_EVALUATION",
    status: "IN_PROGRESS",
    submittedAt: "2026-04-15T08:00:00.000Z",
    decisionAt: null,
    stageEvents: [
      { id: "se-81", stage: "SUBMITTED", status: "COMPLETED", occurredAt: "2026-04-15T08:00:00.000Z" },
      { id: "se-82", stage: "DOCUMENT_REVIEW", status: "COMPLETED", occurredAt: "2026-04-22T08:00:00.000Z" },
      { id: "se-83", stage: "TECHNICAL_REVIEW", status: "COMPLETED", occurredAt: "2026-05-02T08:00:00.000Z" },
      { id: "se-84", stage: "COMMERCIAL_REVIEW", status: "COMPLETED", occurredAt: "2026-05-08T08:00:00.000Z" },
      { id: "se-85", stage: "PRESENTATION_SCHEDULED", status: "COMPLETED", occurredAt: "2026-05-14T08:00:00.000Z" },
      { id: "se-86", stage: "COMMITTEE_EVALUATION", status: "IN_PROGRESS", occurredAt: null },
      { id: "se-87", stage: "APPROVED", status: "PENDING", occurredAt: null },
    ],
    reviews: [
      { id: "rv-81", type: "DOCUMENT", reviewerRole: "PROCUREMENT", decision: "PASS", reviewerId: "usr-procurement", reviewedAt: "2026-04-22T08:00:00.000Z", comment: null },
      { id: "rv-82", type: "TECHNICAL", reviewerRole: "ENGINEERING_REVIEWER", decision: "CONDITIONAL", reviewerId: "usr-engineering", reviewedAt: "2026-05-02T08:00:00.000Z", comment: "Solid rooftop delivery; limited large-scale references." },
    ],
    ...audit("2026-04-15T08:00:00.000Z", "2026-05-14T08:00:00.000Z"),
  },
  {
    id: "app-9",
    referenceCode: "APP-2026-0128",
    supplierId: "sup-9",
    cycle: "INITIAL",
    currentStage: "TECHNICAL_REVIEW",
    status: "IN_PROGRESS",
    submittedAt: "2026-05-22T08:00:00.000Z",
    decisionAt: null,
    stageEvents: [
      { id: "se-91", stage: "SUBMITTED", status: "COMPLETED", occurredAt: "2026-05-22T08:00:00.000Z" },
      { id: "se-92", stage: "DOCUMENT_REVIEW", status: "COMPLETED", occurredAt: "2026-05-30T08:00:00.000Z" },
      { id: "se-93", stage: "TECHNICAL_REVIEW", status: "IN_PROGRESS", occurredAt: null },
      { id: "se-94", stage: "COMMERCIAL_REVIEW", status: "PENDING", occurredAt: null },
      { id: "se-95", stage: "PRESENTATION_SCHEDULED", status: "PENDING", occurredAt: null },
      { id: "se-96", stage: "COMMITTEE_EVALUATION", status: "PENDING", occurredAt: null },
      { id: "se-97", stage: "APPROVED", status: "PENDING", occurredAt: null },
    ],
    reviews: [
      { id: "rv-91", type: "DOCUMENT", reviewerRole: "PROCUREMENT", decision: "PASS", reviewerId: "usr-procurement", reviewedAt: "2026-05-30T08:00:00.000Z", comment: null },
      { id: "rv-92", type: "TECHNICAL", reviewerRole: "ENGINEERING_REVIEWER", decision: "PENDING", reviewerId: null, reviewedAt: null, comment: null },
    ],
    ...audit("2026-05-22T08:00:00.000Z"),
  },
];

/* ------------------------------------------------------------------ */
/* Presentation bookings (Thursdays only)                              */
/* ------------------------------------------------------------------ */

export const bookings: PresentationBooking[] = [
  {
    id: "bk-4",
    applicationId: "app-4",
    supplierId: "sup-4",
    date: "2026-07-30", // Thursday
    time: "10:00",
    status: "CONFIRMED",
    location: "Procurement Meeting Room 3, Head Office",
    meetingLink: "https://meet.example.com/greenvolt-avl",
    ...audit("2026-07-16T08:00:00.000Z"),
  },
];

/* ------------------------------------------------------------------ */
/* Evaluations                                                         */
/* ------------------------------------------------------------------ */

const allComplyPass = [
  { itemId: "comp-registration", passed: true },
  { itemId: "comp-vat", passed: true },
  { itemId: "comp-bank", passed: true },
  { itemId: "comp-licenses", passed: true },
  { itemId: "comp-profile", passed: true },
];

export const evaluations: Evaluation[] = [
  {
    id: "ev-1",
    applicationId: "app-1",
    supplierId: "sup-1",
    evaluatorId: "usr-procurement",
    stageOnePassed: true,
    complianceResults: allComplyPass,
    scores: [
      { criterionId: "eval-company", score: 90 },
      { criterionId: "eval-technical", score: 94 },
      { criterionId: "eval-experience", score: 92 },
      { criterionId: "eval-hse", score: 90 },
      { criterionId: "eval-presentation", score: 88 },
    ],
    totalScore: 92,
    recommendation: "STRATEGIC",
    evaluatedAt: "2026-01-15T08:00:00.000Z",
    note: "Excellent utility-scale delivery record. Recommend Strategic tier.",
    ...audit("2026-01-15T08:00:00.000Z"),
  },
  {
    id: "ev-6",
    applicationId: "app-6",
    supplierId: "sup-6",
    evaluatorId: "usr-procurement",
    stageOnePassed: true,
    complianceResults: allComplyPass,
    scores: [
      { criterionId: "eval-company", score: 60 },
      { criterionId: "eval-technical", score: 52 },
      { criterionId: "eval-experience", score: 55 },
      { criterionId: "eval-hse", score: 65 },
      { criterionId: "eval-presentation", score: 70 },
    ],
    totalScore: 58,
    recommendation: "REJECTED",
    evaluatedAt: "2026-05-27T08:00:00.000Z",
    note: "Below minimum threshold on technical capability and experience.",
    ...audit("2026-05-27T08:00:00.000Z"),
  },
];

/* ------------------------------------------------------------------ */
/* AVL records                                                         */
/* ------------------------------------------------------------------ */

export const avlRecords: AvlRecord[] = [
  {
    id: "avl-1",
    supplierId: "sup-1",
    applicationId: "app-1",
    vendorTier: "STRATEGIC",
    score: 92,
    status: "ACTIVE",
    approvalDate: "2026-01-18",
    expiryDate: "2027-01-18",
    cycle: "INITIAL",
    ...audit("2026-01-18T08:00:00.000Z"),
  },
  {
    id: "avl-2",
    supplierId: "sup-2",
    applicationId: null,
    vendorTier: "APPROVED",
    score: 84,
    status: "ACTIVE",
    approvalDate: "2026-02-10",
    expiryDate: "2027-02-10",
    cycle: "INITIAL",
    ...audit("2026-02-10T08:00:00.000Z"),
  },
  {
    id: "avl-3",
    supplierId: "sup-3",
    applicationId: null,
    vendorTier: "CONDITIONAL",
    score: 72,
    status: "CONDITIONAL",
    approvalDate: "2026-04-01",
    expiryDate: "2026-10-01",
    cycle: "INITIAL",
    ...audit("2026-04-01T08:00:00.000Z"),
  },
  {
    id: "avl-7",
    supplierId: "sup-7",
    applicationId: "app-7",
    vendorTier: "APPROVED",
    score: 81,
    status: "ACTIVE",
    approvalDate: "2026-02-18",
    expiryDate: "2027-02-18",
    cycle: "INITIAL",
    ...audit("2026-02-18T08:00:00.000Z"),
  },
];

/* ------------------------------------------------------------------ */
/* Projects + performance evaluations                                  */
/* ------------------------------------------------------------------ */

export const projects: Project[] = [
  { id: "prj-1", code: "PRJ-SOLAR-RAYONG-01", name: "Rayong 8MW Ground-Mount Solar Farm", supplierId: "sup-1" },
  { id: "prj-2", code: "PRJ-SOLAR-AYUTTHAYA-02", name: "Ayutthaya Factory Rooftop 3.2MW", supplierId: "sup-1" },
  { id: "prj-3", code: "PRJ-EV-BKK-DC-05", name: "Bangkok Expressway DC Fast-Charging Hub", supplierId: "sup-2" },
];

export const performanceEvaluations: PerformanceEvaluation[] = [
  {
    id: "pe-1",
    supplierId: "sup-1",
    projectId: "prj-1",
    projectName: "Rayong 8MW Ground-Mount Solar Farm",
    evaluatorId: "usr-procurement",
    evaluationDate: "2026-05-30",
    scores: [
      { criterionId: "perf-safety", score: 95 },
      { criterionId: "perf-quality", score: 92 },
      { criterionId: "perf-schedule", score: 88 },
      { criterionId: "perf-communication", score: 90 },
      { criterionId: "perf-documentation", score: 85 },
      { criterionId: "perf-commercial", score: 90 },
    ],
    weightedTotal: 91.2,
    comment: "Delivered ahead of schedule with zero lost-time incidents.",
    ...audit("2026-05-30T08:00:00.000Z"),
  },
  {
    id: "pe-2",
    supplierId: "sup-1",
    projectId: "prj-2",
    projectName: "Ayutthaya Factory Rooftop 3.2MW",
    evaluatorId: "usr-engineering",
    evaluationDate: "2026-06-28",
    scores: [
      { criterionId: "perf-safety", score: 90 },
      { criterionId: "perf-quality", score: 94 },
      { criterionId: "perf-schedule", score: 82 },
      { criterionId: "perf-communication", score: 88 },
      { criterionId: "perf-documentation", score: 90 },
      { criterionId: "perf-commercial", score: 86 },
    ],
    weightedTotal: 88.7,
    comment: "High workmanship quality; minor schedule slippage due to weather.",
    ...audit("2026-06-28T08:00:00.000Z"),
  },
  {
    id: "pe-3",
    supplierId: "sup-2",
    projectId: "prj-3",
    projectName: "Bangkok Expressway DC Fast-Charging Hub",
    evaluatorId: "usr-procurement",
    evaluationDate: "2026-06-15",
    scores: [
      { criterionId: "perf-safety", score: 85 },
      { criterionId: "perf-quality", score: 84 },
      { criterionId: "perf-schedule", score: 80 },
      { criterionId: "perf-communication", score: 82 },
      { criterionId: "perf-documentation", score: 78 },
      { criterionId: "perf-commercial", score: 84 },
    ],
    weightedTotal: 82.7,
    comment: "Solid delivery; documentation handover could be improved.",
    ...audit("2026-06-15T08:00:00.000Z"),
  },
];

/* ------------------------------------------------------------------ */
/* Documents (subset — Sunniva fully populated incl. expiring cert)    */
/* ------------------------------------------------------------------ */

const v = (fileName: string, uploadedAt: string) => ({
  id: `dv-${fileName}`,
  version: 1,
  fileName,
  storageKey: `mock/${fileName}`,
  mimeType: "application/pdf",
  sizeBytes: 482_133,
  uploadedAt,
  uploadedById: "usr-sup-1",
  isCurrent: true,
});

export const documents: SupplierDocument[] = [
  {
    id: "doc-1",
    supplierId: "sup-1",
    requirementId: "req-company_registration",
    status: "VERIFIED",
    issueDate: "2025-09-01",
    expiryDate: null,
    note: null,
    versions: [v("company-registration.pdf", "2025-11-05T08:00:00.000Z")],
    ...audit("2025-11-05T08:00:00.000Z"),
  },
  {
    id: "doc-2",
    supplierId: "sup-1",
    requirementId: "req-insurance_certificate",
    status: "VERIFIED",
    issueDate: "2025-10-10",
    expiryDate: "2026-09-30", // expiring within 90 days of 2026-07 -> warning
    note: null,
    versions: [v("public-liability-insurance.pdf", "2025-11-05T08:00:00.000Z")],
    ...audit("2025-11-05T08:00:00.000Z"),
  },
  {
    id: "doc-3",
    supplierId: "sup-1",
    requirementId: "req-iso45001",
    status: "VERIFIED",
    issueDate: "2024-06-01",
    expiryDate: "2027-06-01",
    note: null,
    versions: [v("iso-45001.pdf", "2025-11-05T08:00:00.000Z")],
    ...audit("2025-11-05T08:00:00.000Z"),
  },
  {
    id: "doc-4",
    supplierId: "sup-4",
    requirementId: "req-company_registration",
    status: "VERIFIED",
    issueDate: "2026-05-01",
    expiryDate: null,
    note: null,
    versions: [v("greenvolt-registration.pdf", "2026-06-18T08:00:00.000Z")],
    ...audit("2026-06-18T08:00:00.000Z"),
  },
  {
    id: "doc-5",
    supplierId: "sup-4",
    requirementId: "req-iso9001",
    status: "UNDER_REVIEW",
    issueDate: "2025-03-01",
    expiryDate: "2026-08-31", // expiring soon
    note: "Awaiting verification of certificate scope.",
    versions: [v("greenvolt-iso9001.pdf", "2026-06-18T08:00:00.000Z")],
    ...audit("2026-06-18T08:00:00.000Z"),
  },
];

/* ------------------------------------------------------------------ */
/* Notifications                                                       */
/* ------------------------------------------------------------------ */

export const notifications: Notification[] = [
  {
    id: "ntf-1",
    userId: "usr-sup-4",
    type: "ACTION_REQUIRED",
    title: "Presentation scheduled",
    body: "Your AVL presentation is confirmed for Thu 30 Jul 2026, 10:00.",
    href: "/supplier/presentation",
    read: false,
    createdAt: "2026-07-16T08:00:00.000Z",
  },
  {
    id: "ntf-2",
    userId: "usr-sup-4",
    type: "WARNING",
    title: "Document expiring soon",
    body: "Your ISO 9001 certificate expires on 31 Aug 2026. Please upload a renewal.",
    href: "/supplier/documents",
    read: false,
    createdAt: "2026-07-14T08:00:00.000Z",
  },
  {
    id: "ntf-3",
    userId: "usr-sup-1",
    type: "SUCCESS",
    title: "Approved as Strategic Vendor",
    body: "Congratulations — Sunniva Solar is now an approved Strategic vendor.",
    href: "/supplier/avl",
    read: true,
    createdAt: "2026-01-18T08:00:00.000Z",
  },
];
