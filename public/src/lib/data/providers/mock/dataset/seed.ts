/**
 * Realistic sample data for the mock provider (Revision 1.1 lifecycle).
 *
 * Business rule reflected here: registration is lightweight and immediately
 * creates BOTH a Supplier record and an Application record. The same records
 * are then advanced through the lifecycle:
 *   REGISTERED -> SCREENING -> PRESENTATION_BOOKED -> PRESENTED ->
 *   INTERNAL_ASSESSMENT -> DECISION -> DOCUMENT_UPLOAD ->
 *   DOCUMENT_VERIFICATION -> AVL_APPROVED  (or REJECTED)
 *
 * Documents are only collected AFTER a "Qualified" decision. No component
 * imports this file directly — the mock provider loads it and the service
 * layer reads the provider.
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
import { CONTRACTOR_TYPE_ID, PRODUCT_TYPE_ID, SERVICE_TYPE_ID } from "./config";

const audit = (createdAt: string, updatedAt = createdAt) => ({
  createdAt,
  updatedAt,
  createdById: null,
  updatedById: null,
});

/* ------------------------------------------------------------------ */
/* Users                                                               */
/* ------------------------------------------------------------------ */
export const users: User[] = [
  { id: "usr-sup-1", email: "contact@sunnivasolar.co.th", name: "Anong Prasert", role: "SUPPLIER", supplierId: "sup-1", avatarUrl: null, isActive: true, ...audit("2025-11-02T08:00:00.000Z") },
  { id: "usr-sup-4", email: "bd@greenvolt.co.th", name: "Kittipong Sae-lim", role: "SUPPLIER", supplierId: "sup-4", avatarUrl: null, isActive: true, ...audit("2026-06-10T08:00:00.000Z") },
  { id: "usr-sup-11", email: "sales@inverpro.co.th", name: "Manop Chaiyo", role: "SUPPLIER", supplierId: "sup-11", avatarUrl: null, isActive: true, ...audit("2026-07-18T08:00:00.000Z") },
  { id: "usr-sup-13", email: "info@inspectco.co.th", name: "Ratana Suk", role: "SUPPLIER", supplierId: "sup-13", avatarUrl: null, isActive: true, ...audit("2026-07-01T08:00:00.000Z") },
  { id: "usr-admin", email: "admin@epc-procurement.co.th", name: "Procurement Admin", role: "ADMIN", supplierId: null, avatarUrl: null, isActive: true, ...audit("2025-01-05T08:00:00.000Z") },
  { id: "usr-procurement", email: "procurement@epc-procurement.co.th", name: "Warisara Chai", role: "PROCUREMENT", supplierId: null, avatarUrl: null, isActive: true, ...audit("2025-01-05T08:00:00.000Z") },
  { id: "usr-engineering", email: "engineering@epc-procurement.co.th", name: "Somchai Ratanakul", role: "ENGINEERING_REVIEWER", supplierId: null, avatarUrl: null, isActive: true, ...audit("2025-01-05T08:00:00.000Z") },
  { id: "usr-hse", email: "hse@epc-procurement.co.th", name: "Pichaya Wong", role: "HSE_REVIEWER", supplierId: null, avatarUrl: null, isActive: true, ...audit("2025-01-05T08:00:00.000Z") },
  { id: "usr-finance", email: "finance@epc-procurement.co.th", name: "Natthapong Lek", role: "FINANCE", supplierId: null, avatarUrl: null, isActive: true, ...audit("2025-01-05T08:00:00.000Z") },
];

/* ------------------------------------------------------------------ */
/* Suppliers                                                           */
/* ------------------------------------------------------------------ */
const addr = (id: string, line1: string, district: string, province: string, postalCode: string) => ({
  id, type: "REGISTERED" as const, line1, district, province, postalCode, country: "Thailand",
});
const primary = (id: string, name: string, position: string, phone: string, email: string) => ({
  id, type: "PRIMARY" as const, name, position, phone, email,
});

export const suppliers: Supplier[] = [
  {
    id: "sup-1", vendorCode: "V-2025-0007", companyName: "Sunniva Solar Engineering Co., Ltd.",
    supplierTypeId: CONTRACTOR_TYPE_ID, taxId: "0105558012345", registrationNumber: "0105558012345",
    yearEstablished: 2015, website: "https://sunnivasolar.co.th", registeredCapital: 50_000_000, employeeCount: 145,
    businessDescription: "Turnkey Solar EPC contractor delivering rooftop and ground-mount PV systems for industrial and utility clients across Thailand.",
    addresses: [addr("addr-1", "88/12 Bangna-Trad Road, Bang Kaeo", "Bang Phli", "Samut Prakan", "10540")],
    contacts: [primary("c-1", "Anong Prasert", "Business Development Director", "+66 2 750 1200", "contact@sunnivasolar.co.th")],
    categoryIds: ["cat-solar-epc", "cat-electrical", "cat-commissioning"], serviceAreaIds: ["area-nationwide"],
    avlStatus: "ACTIVE", vendorTier: "STRATEGIC", currentScore: 92, blacklistFlag: false,
    remarks: "Preferred solar EPC partner for utility-scale projects.",
    ...audit("2025-11-02T08:00:00.000Z", "2026-01-20T08:00:00.000Z"),
  },
  {
    id: "sup-3", vendorCode: "V-2026-0003", companyName: "Thanakit Civil & Electrical Co., Ltd.",
    supplierTypeId: CONTRACTOR_TYPE_ID, taxId: "0105560011223", registrationNumber: "0105560011223",
    yearEstablished: 2012, website: null, registeredCapital: 15_000_000, employeeCount: 88,
    businessDescription: "Civil and electrical works contractor supporting solar farm foundations, substations, and site infrastructure.",
    addresses: [addr("addr-3", "45 Mittraphap Road, Nai Muang", "Mueang", "Nakhon Ratchasima", "30000")],
    contacts: [primary("c-4", "Prayut Thanakit", "Project Director", "+66 44 245 100", "office@thanakit.co.th")],
    categoryIds: ["cat-civil", "cat-electrical"], serviceAreaIds: ["area-northeast", "area-central"],
    avlStatus: "SUSPENDED", vendorTier: "NONE", currentScore: null, blacklistFlag: false,
    remarks: "Committee requested additional project references before qualification.",
    ...audit("2026-06-15T08:00:00.000Z", "2026-07-20T08:00:00.000Z"),
  },
  {
    id: "sup-4", vendorCode: "V-2026-0018", companyName: "GreenVolt Power Systems Co., Ltd.",
    supplierTypeId: CONTRACTOR_TYPE_ID, taxId: "0105561033445", registrationNumber: "0105561033445",
    yearEstablished: 2020, website: "https://greenvolt.co.th", registeredCapital: 10_000_000, employeeCount: 34,
    businessDescription: "Growing solar and EV installation contractor focused on commercial rooftop systems and destination charging.",
    addresses: [addr("addr-4", "302/5 Chang Klan Road", "Mueang", "Chiang Mai", "50100")],
    contacts: [primary("c-5", "Kittipong Sae-lim", "Co-Founder", "+66 53 210 900", "bd@greenvolt.co.th")],
    categoryIds: ["cat-solar-epc", "cat-ev"], serviceAreaIds: ["area-north"],
    avlStatus: "SUSPENDED", vendorTier: "NONE", currentScore: null, blacklistFlag: false,
    remarks: "Qualified at presentation; currently uploading required documents.",
    ...audit("2026-06-10T08:00:00.000Z", "2026-07-22T08:00:00.000Z"),
  },
  {
    id: "sup-5", vendorCode: "V-2026-0021", companyName: "Siam Renewable Contractors Co., Ltd.",
    supplierTypeId: CONTRACTOR_TYPE_ID, taxId: "0105562055667", registrationNumber: "0105562055667",
    yearEstablished: 2016, website: null, registeredCapital: 25_000_000, employeeCount: 110,
    businessDescription: "Mechanical and O&M contractor for renewable energy plants, including preventive and corrective maintenance.",
    addresses: [addr("addr-5", "12 Utapao Road, Ban Chang", "Ban Chang", "Rayong", "21130")],
    contacts: [primary("c-6", "Rungroj Saeng", "Operations Manager", "+66 38 601 400", "ops@siamrenewable.co.th")],
    categoryIds: ["cat-mechanical", "cat-om", "cat-maintenance"], serviceAreaIds: ["area-east", "area-central"],
    avlStatus: "SUSPENDED", vendorTier: "NONE", currentScore: null, blacklistFlag: false, remarks: null,
    ...audit("2026-07-14T08:00:00.000Z"),
  },
  {
    id: "sup-6", vendorCode: "V-2026-0009", companyName: "EcoCharge Solutions Co., Ltd.",
    supplierTypeId: CONTRACTOR_TYPE_ID, taxId: "0105560077889", registrationNumber: "0105560077889",
    yearEstablished: 2021, website: null, registeredCapital: 5_000_000, employeeCount: 18,
    businessDescription: "EV charger installation start-up focused on residential and small commercial AC chargers.",
    addresses: [addr("addr-6", "77 Phuket Road, Talat Yai", "Mueang", "Phuket", "83000")],
    contacts: [primary("c-7", "Naruedol Chan", "Founder", "+66 76 210 300", "hello@ecocharge.co.th")],
    categoryIds: ["cat-ev"], serviceAreaIds: ["area-south"],
    avlStatus: "SUSPENDED", vendorTier: "NONE", currentScore: null, blacklistFlag: false,
    remarks: "Did not meet minimum technical capability at presentation.",
    ...audit("2026-05-20T08:00:00.000Z", "2026-06-28T08:00:00.000Z"),
  },
  {
    id: "sup-10", vendorCode: "V-2025-0031", companyName: "SolarTech Products (Thailand) Co., Ltd.",
    supplierTypeId: PRODUCT_TYPE_ID, taxId: "0105557099001", registrationNumber: "0105557099001",
    yearEstablished: 2014, website: "https://solartech.co.th", registeredCapital: 80_000_000, employeeCount: 60,
    businessDescription: "Authorised distributor of tier-1 PV modules, inverters and mounting systems.",
    addresses: [addr("addr-10", "9 Rama III Road, Chong Nonsi", "Yan Nawa", "Bangkok", "10120")],
    contacts: [primary("c-10", "Suphakorn Wong", "Sales Director", "+66 2 294 5000", "sales@solartech.co.th")],
    categoryIds: ["cat-pv-modules", "cat-inverters", "cat-mounting"], serviceAreaIds: ["area-nationwide"],
    avlStatus: "ACTIVE", vendorTier: "APPROVED", currentScore: 86, blacklistFlag: false, remarks: null,
    ...audit("2025-12-01T08:00:00.000Z", "2026-02-14T08:00:00.000Z"),
  },
  {
    id: "sup-11", vendorCode: "V-2026-0027", companyName: "InverPro Distribution Co., Ltd.",
    supplierTypeId: PRODUCT_TYPE_ID, taxId: "0105563088776", registrationNumber: "0105563088776",
    yearEstablished: 2019, website: null, registeredCapital: 12_000_000, employeeCount: 22,
    businessDescription: "Distributor of string and hybrid inverters and EV charging hardware.",
    addresses: [addr("addr-11", "120 Vibhavadi Rangsit Road", "Chatuchak", "Bangkok", "10900")],
    contacts: [primary("c-11", "Manop Chaiyo", "Managing Director", "+66 2 511 8800", "sales@inverpro.co.th")],
    categoryIds: ["cat-inverters", "cat-ev-chargers"], serviceAreaIds: ["area-bangkok", "area-central"],
    avlStatus: "SUSPENDED", vendorTier: "NONE", currentScore: null, blacklistFlag: false,
    remarks: "New registration undergoing eligibility screening.",
    ...audit("2026-07-18T08:00:00.000Z"),
  },
  {
    id: "sup-12", vendorCode: "V-2025-0044", companyName: "GridServe Consulting Co., Ltd.",
    supplierTypeId: SERVICE_TYPE_ID, taxId: "0105556077665", registrationNumber: "0105556077665",
    yearEstablished: 2013, website: "https://gridserve.co.th", registeredCapital: 6_000_000, employeeCount: 28,
    businessDescription: "Engineering consultancy for grid connection studies, PV design and independent engineering.",
    addresses: [addr("addr-12", "23 Sukhumvit 24", "Khlong Toei", "Bangkok", "10110")],
    contacts: [primary("c-12", "Dr. Sarawut Meng", "Principal Engineer", "+66 2 260 7700", "contact@gridserve.co.th")],
    categoryIds: ["cat-eng-consult", "cat-survey-design", "cat-testing"], serviceAreaIds: ["area-nationwide"],
    avlStatus: "ACTIVE", vendorTier: "STRATEGIC", currentScore: 90, blacklistFlag: false, remarks: null,
    ...audit("2025-10-15T08:00:00.000Z", "2026-01-10T08:00:00.000Z"),
  },
  {
    id: "sup-13", vendorCode: "V-2026-0030", companyName: "InspectCo Testing & Inspection Co., Ltd.",
    supplierTypeId: SERVICE_TYPE_ID, taxId: "0105562066554", registrationNumber: "0105562066554",
    yearEstablished: 2017, website: null, registeredCapital: 4_000_000, employeeCount: 19,
    businessDescription: "Independent testing, commissioning support and thermographic inspection services.",
    addresses: [addr("addr-13", "88 Bangna-Trad km.8", "Bang Phli", "Samut Prakan", "10540")],
    contacts: [primary("c-13", "Ratana Suk", "Director", "+66 2 316 4400", "info@inspectco.co.th")],
    categoryIds: ["cat-testing", "cat-om-service"], serviceAreaIds: ["area-central", "area-east"],
    avlStatus: "SUSPENDED", vendorTier: "NONE", currentScore: null, blacklistFlag: false,
    remarks: "Qualified; documents submitted and under verification.",
    ...audit("2026-07-01T08:00:00.000Z", "2026-07-24T08:00:00.000Z"),
  },
];

/* ------------------------------------------------------------------ */
/* Applications (one per supplier, sharing the supplier's lifecycle)   */
/* ------------------------------------------------------------------ */
type Ev = { id: string; stage: import("@/types").ApplicationStage; status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "REJECTED"; occurredAt?: string | null; note?: string | null };

// Build stage events: `done` stages COMPLETED with a date, the `current`
// stage IN_PROGRESS, the rest PENDING. Keeps the timeline consistent.
const ALL_STAGES: import("@/types").ApplicationStage[] = [
  "REGISTERED", "SCREENING", "PRESENTATION_BOOKED", "PRESENTED",
  "INTERNAL_ASSESSMENT", "DECISION", "DOCUMENT_UPLOAD", "DOCUMENT_VERIFICATION", "AVL_APPROVED",
];
function events(prefix: string, currentIndex: number, dates: Record<number, string>, rejected = false): Ev[] {
  return ALL_STAGES.map((stage, i) => {
    let status: Ev["status"] = "PENDING";
    if (i < currentIndex) status = "COMPLETED";
    else if (i === currentIndex) status = rejected ? "REJECTED" : "IN_PROGRESS";
    return { id: `${prefix}-se${i}`, stage, status, occurredAt: dates[i] ?? null };
  });
}

export const applications: Application[] = [
  {
    id: "app-1", referenceCode: "APP-2025-0087", supplierId: "sup-1", cycle: "INITIAL",
    currentStage: "AVL_APPROVED", status: "APPROVED", decisionOutcome: "QUALIFIED",
    submittedAt: "2025-11-05T08:00:00.000Z", decisionAt: "2026-01-18T08:00:00.000Z",
    stageEvents: events("a1", 8, { 0: "2025-11-05T08:00:00.000Z", 1: "2025-11-12T08:00:00.000Z", 2: "2025-12-01T08:00:00.000Z", 3: "2025-12-11T08:00:00.000Z", 4: "2025-12-20T08:00:00.000Z", 5: "2025-12-22T08:00:00.000Z", 6: "2026-01-05T08:00:00.000Z", 7: "2026-01-14T08:00:00.000Z", 8: "2026-01-18T08:00:00.000Z" }),
    reviews: [
      { id: "a1-r1", type: "TECHNICAL", reviewerRole: "ENGINEERING_REVIEWER", decision: "PASS", reviewerId: "usr-engineering", reviewedAt: "2025-12-20T08:00:00.000Z", comment: "Strong utility-scale track record." },
      { id: "a1-r2", type: "HSE", reviewerRole: "HSE_REVIEWER", decision: "PASS", reviewerId: "usr-hse", reviewedAt: "2025-12-21T08:00:00.000Z", comment: "ISO 45001 in place." },
      { id: "a1-r3", type: "DOCUMENT", reviewerRole: "PROCUREMENT", decision: "PASS", reviewerId: "usr-procurement", reviewedAt: "2026-01-14T08:00:00.000Z", comment: "All documents verified." },
    ],
    ...audit("2025-11-05T08:00:00.000Z", "2026-01-18T08:00:00.000Z"),
  },
  {
    id: "app-3", referenceCode: "APP-2026-0140", supplierId: "sup-3", cycle: "INITIAL",
    currentStage: "DECISION", status: "MORE_INFO", decisionOutcome: "MORE_INFO",
    submittedAt: "2026-06-15T08:00:00.000Z", decisionAt: "2026-07-20T08:00:00.000Z",
    stageEvents: events("a3", 5, { 0: "2026-06-15T08:00:00.000Z", 1: "2026-06-22T08:00:00.000Z", 2: "2026-07-02T08:00:00.000Z", 3: "2026-07-16T08:00:00.000Z", 4: "2026-07-18T08:00:00.000Z", 5: "2026-07-20T08:00:00.000Z" }),
    reviews: [
      { id: "a3-r1", type: "TECHNICAL", reviewerRole: "ENGINEERING_REVIEWER", decision: "CONDITIONAL", reviewerId: "usr-engineering", reviewedAt: "2026-07-18T08:00:00.000Z", comment: "Additional civil references required." },
    ],
    ...audit("2026-06-15T08:00:00.000Z", "2026-07-20T08:00:00.000Z"),
  },
  {
    id: "app-4", referenceCode: "APP-2026-0142", supplierId: "sup-4", cycle: "INITIAL",
    currentStage: "DOCUMENT_UPLOAD", status: "QUALIFIED", decisionOutcome: "QUALIFIED",
    submittedAt: "2026-06-18T08:00:00.000Z", decisionAt: "2026-07-16T08:00:00.000Z",
    stageEvents: events("a4", 6, { 0: "2026-06-18T08:00:00.000Z", 1: "2026-06-25T08:00:00.000Z", 2: "2026-07-02T08:00:00.000Z", 3: "2026-07-09T08:00:00.000Z", 4: "2026-07-14T08:00:00.000Z", 5: "2026-07-16T08:00:00.000Z" }),
    reviews: [
      { id: "a4-r1", type: "TECHNICAL", reviewerRole: "ENGINEERING_REVIEWER", decision: "PASS", reviewerId: "usr-engineering", reviewedAt: "2026-07-14T08:00:00.000Z", comment: "Qualified; proceed to document collection." },
    ],
    ...audit("2026-06-18T08:00:00.000Z", "2026-07-22T08:00:00.000Z"),
  },
  {
    id: "app-5", referenceCode: "APP-2026-0155", supplierId: "sup-5", cycle: "INITIAL",
    currentStage: "PRESENTATION_BOOKED", status: "IN_PROGRESS",
    submittedAt: "2026-07-14T08:00:00.000Z", decisionAt: null,
    stageEvents: events("a5", 2, { 0: "2026-07-14T08:00:00.000Z", 1: "2026-07-18T08:00:00.000Z", 2: "2026-07-22T08:00:00.000Z" }),
    reviews: [],
    ...audit("2026-07-14T08:00:00.000Z"),
  },
  {
    id: "app-6", referenceCode: "APP-2026-0061", supplierId: "sup-6", cycle: "INITIAL",
    currentStage: "REJECTED", status: "REJECTED", decisionOutcome: "REJECT",
    submittedAt: "2026-05-20T08:00:00.000Z", decisionAt: "2026-06-28T08:00:00.000Z",
    stageEvents: (() => { const e = events("a6", 5, { 0: "2026-05-20T08:00:00.000Z", 1: "2026-05-28T08:00:00.000Z", 2: "2026-06-10T08:00:00.000Z", 3: "2026-06-20T08:00:00.000Z", 4: "2026-06-26T08:00:00.000Z" }); e[5] = { id: "a6-se5", stage: "DECISION", status: "REJECTED", occurredAt: "2026-06-28T08:00:00.000Z", note: "Insufficient technical capability." }; return e; })(),
    reviews: [
      { id: "a6-r1", type: "TECHNICAL", reviewerRole: "ENGINEERING_REVIEWER", decision: "FAIL", reviewerId: "usr-engineering", reviewedAt: "2026-06-26T08:00:00.000Z", comment: "Insufficient DC fast-charging experience." },
    ],
    ...audit("2026-05-20T08:00:00.000Z", "2026-06-28T08:00:00.000Z"),
  },
  {
    id: "app-10", referenceCode: "APP-2025-0120", supplierId: "sup-10", cycle: "INITIAL",
    currentStage: "AVL_APPROVED", status: "APPROVED", decisionOutcome: "QUALIFIED",
    submittedAt: "2025-12-01T08:00:00.000Z", decisionAt: "2026-02-12T08:00:00.000Z",
    stageEvents: events("a10", 8, { 0: "2025-12-01T08:00:00.000Z", 1: "2025-12-08T08:00:00.000Z", 2: "2025-12-18T08:00:00.000Z", 3: "2026-01-08T08:00:00.000Z", 4: "2026-01-20T08:00:00.000Z", 5: "2026-01-22T08:00:00.000Z", 6: "2026-02-02T08:00:00.000Z", 7: "2026-02-10T08:00:00.000Z", 8: "2026-02-12T08:00:00.000Z" }),
    reviews: [
      { id: "a10-r1", type: "TECHNICAL", reviewerRole: "ENGINEERING_REVIEWER", decision: "PASS", reviewerId: "usr-engineering", reviewedAt: "2026-01-20T08:00:00.000Z", comment: "Tier-1 product portfolio; strong warranties." },
    ],
    ...audit("2025-12-01T08:00:00.000Z", "2026-02-12T08:00:00.000Z"),
  },
  {
    id: "app-11", referenceCode: "APP-2026-0160", supplierId: "sup-11", cycle: "INITIAL",
    currentStage: "SCREENING", status: "IN_PROGRESS",
    submittedAt: "2026-07-18T08:00:00.000Z", decisionAt: null,
    stageEvents: events("a11", 1, { 0: "2026-07-18T08:00:00.000Z" }),
    reviews: [],
    ...audit("2026-07-18T08:00:00.000Z"),
  },
  {
    id: "app-12", referenceCode: "APP-2025-0101", supplierId: "sup-12", cycle: "INITIAL",
    currentStage: "AVL_APPROVED", status: "APPROVED", decisionOutcome: "QUALIFIED",
    submittedAt: "2025-10-15T08:00:00.000Z", decisionAt: "2026-01-08T08:00:00.000Z",
    stageEvents: events("a12", 8, { 0: "2025-10-15T08:00:00.000Z", 1: "2025-10-22T08:00:00.000Z", 2: "2025-11-06T08:00:00.000Z", 3: "2025-11-20T08:00:00.000Z", 4: "2025-12-10T08:00:00.000Z", 5: "2025-12-14T08:00:00.000Z", 6: "2025-12-22T08:00:00.000Z", 7: "2026-01-06T08:00:00.000Z", 8: "2026-01-08T08:00:00.000Z" }),
    reviews: [
      { id: "a12-r1", type: "TECHNICAL", reviewerRole: "ENGINEERING_REVIEWER", decision: "PASS", reviewerId: "usr-engineering", reviewedAt: "2025-12-10T08:00:00.000Z", comment: "Highly experienced independent engineer." },
    ],
    ...audit("2025-10-15T08:00:00.000Z", "2026-01-08T08:00:00.000Z"),
  },
  {
    id: "app-13", referenceCode: "APP-2026-0150", supplierId: "sup-13", cycle: "INITIAL",
    currentStage: "DOCUMENT_VERIFICATION", status: "QUALIFIED", decisionOutcome: "QUALIFIED",
    submittedAt: "2026-07-01T08:00:00.000Z", decisionAt: "2026-07-18T08:00:00.000Z",
    stageEvents: events("a13", 7, { 0: "2026-07-01T08:00:00.000Z", 1: "2026-07-05T08:00:00.000Z", 2: "2026-07-09T08:00:00.000Z", 3: "2026-07-16T08:00:00.000Z", 4: "2026-07-17T08:00:00.000Z", 5: "2026-07-18T08:00:00.000Z", 6: "2026-07-22T08:00:00.000Z", 7: "2026-07-24T08:00:00.000Z" }),
    reviews: [
      { id: "a13-r1", type: "TECHNICAL", reviewerRole: "ENGINEERING_REVIEWER", decision: "PASS", reviewerId: "usr-engineering", reviewedAt: "2026-07-17T08:00:00.000Z", comment: "Accredited testing capability." },
    ],
    ...audit("2026-07-01T08:00:00.000Z", "2026-07-24T08:00:00.000Z"),
  },
];

/* ------------------------------------------------------------------ */
/* Presentation bookings (Thursdays only)                              */
/* ------------------------------------------------------------------ */
export const bookings: PresentationBooking[] = [
  {
    id: "bk-5", applicationId: "app-5", supplierId: "sup-5", date: "2026-07-30", time: "10:00",
    status: "CONFIRMED", location: "Procurement Meeting Room 3, Head Office", meetingLink: "https://meet.example.com/siam-renewable",
    ...audit("2026-07-18T08:00:00.000Z"),
  },
];

/* ------------------------------------------------------------------ */
/* Evaluations (historical summary; scores computed live in the UI)    */
/* ------------------------------------------------------------------ */
export const evaluations: Evaluation[] = [
  { id: "ev-1", applicationId: "app-1", supplierId: "sup-1", evaluatorId: "usr-procurement", stageOnePassed: true, complianceResults: [], scores: [], totalScore: 92, recommendation: "STRATEGIC", evaluatedAt: "2025-12-22T08:00:00.000Z", note: "Excellent utility-scale delivery record.", ...audit("2025-12-22T08:00:00.000Z") },
  { id: "ev-10", applicationId: "app-10", supplierId: "sup-10", evaluatorId: "usr-procurement", stageOnePassed: true, complianceResults: [], scores: [], totalScore: 86, recommendation: "APPROVED", evaluatedAt: "2026-01-22T08:00:00.000Z", note: "Reliable tier-1 product supplier.", ...audit("2026-01-22T08:00:00.000Z") },
  { id: "ev-12", applicationId: "app-12", supplierId: "sup-12", evaluatorId: "usr-procurement", stageOnePassed: true, complianceResults: [], scores: [], totalScore: 90, recommendation: "STRATEGIC", evaluatedAt: "2025-12-14T08:00:00.000Z", note: "Trusted independent engineering partner.", ...audit("2025-12-14T08:00:00.000Z") },
  { id: "ev-6", applicationId: "app-6", supplierId: "sup-6", evaluatorId: "usr-procurement", stageOnePassed: true, complianceResults: [], scores: [], totalScore: 58, recommendation: "REJECTED", evaluatedAt: "2026-06-26T08:00:00.000Z", note: "Below minimum technical threshold.", ...audit("2026-06-26T08:00:00.000Z") },
];

/* ------------------------------------------------------------------ */
/* AVL records                                                         */
/* ------------------------------------------------------------------ */
export const avlRecords: AvlRecord[] = [
  { id: "avl-1", supplierId: "sup-1", applicationId: "app-1", vendorTier: "STRATEGIC", score: 92, status: "ACTIVE", approvalDate: "2026-01-18", expiryDate: "2027-01-18", cycle: "INITIAL", ...audit("2026-01-18T08:00:00.000Z") },
  { id: "avl-10", supplierId: "sup-10", applicationId: "app-10", vendorTier: "APPROVED", score: 86, status: "ACTIVE", approvalDate: "2026-02-12", expiryDate: "2027-02-12", cycle: "INITIAL", ...audit("2026-02-12T08:00:00.000Z") },
  { id: "avl-12", supplierId: "sup-12", applicationId: "app-12", vendorTier: "STRATEGIC", score: 90, status: "ACTIVE", approvalDate: "2026-01-08", expiryDate: "2027-01-08", cycle: "INITIAL", ...audit("2026-01-08T08:00:00.000Z") },
];

/* ------------------------------------------------------------------ */
/* Projects + performance evaluations                                  */
/* ------------------------------------------------------------------ */
export const projects: Project[] = [
  { id: "prj-1", code: "PRJ-SOLAR-RAYONG-01", name: "Rayong 8MW Ground-Mount Solar Farm", supplierId: "sup-1" },
  { id: "prj-2", code: "PRJ-SOLAR-AYUTTHAYA-02", name: "Ayutthaya Factory Rooftop 3.2MW", supplierId: "sup-1" },
  { id: "prj-12", code: "PRJ-IE-GRID-05", name: "Independent Engineering - 20MW Grid Study", supplierId: "sup-12" },
];

const perfScores = (safety: number, quality: number, schedule: number, comms: number, docs: number, commercial: number) => [
  { criterionId: "perf-safety", score: safety }, { criterionId: "perf-quality", score: quality },
  { criterionId: "perf-schedule", score: schedule }, { criterionId: "perf-communication", score: comms },
  { criterionId: "perf-documentation", score: docs }, { criterionId: "perf-commercial", score: commercial },
];

export const performanceEvaluations: PerformanceEvaluation[] = [
  { id: "pe-1", supplierId: "sup-1", projectId: "prj-1", projectName: "Rayong 8MW Ground-Mount Solar Farm", evaluatorId: "usr-procurement", evaluationDate: "2026-05-30", scores: perfScores(95, 92, 88, 90, 85, 90), weightedTotal: 91.2, comment: "Delivered ahead of schedule with zero lost-time incidents.", ...audit("2026-05-30T08:00:00.000Z") },
  { id: "pe-2", supplierId: "sup-1", projectId: "prj-2", projectName: "Ayutthaya Factory Rooftop 3.2MW", evaluatorId: "usr-engineering", evaluationDate: "2026-06-28", scores: perfScores(90, 94, 82, 88, 90, 86), weightedTotal: 88.7, comment: "High workmanship quality; minor weather-related slippage.", ...audit("2026-06-28T08:00:00.000Z") },
  { id: "pe-12", supplierId: "sup-12", projectId: "prj-12", projectName: "Independent Engineering - 20MW Grid Study", evaluatorId: "usr-procurement", evaluationDate: "2026-06-10", scores: perfScores(92, 90, 90, 92, 94, 88), weightedTotal: 90.9, comment: "Thorough, on-time engineering deliverables.", ...audit("2026-06-10T08:00:00.000Z") },
];

/* ------------------------------------------------------------------ */
/* Documents (collected after qualification)                           */
/* ------------------------------------------------------------------ */
const ver = (fileName: string, uploadedAt: string, by: string) => ({
  id: `dv-${fileName}`, version: 1, fileName, storageKey: `mock/${fileName}`, mimeType: "application/pdf",
  sizeBytes: 482_133, uploadedAt, uploadedById: by, isCurrent: true,
});

export const documents: SupplierDocument[] = [
  // sup-1 (approved contractor) - verified set incl. an expiring insurance cert
  { id: "doc-1", supplierId: "sup-1", requirementId: "req-st-contractor-company_registration", status: "VERIFIED", issueDate: "2025-09-01", expiryDate: null, note: null, versions: [ver("company-registration.pdf", "2026-01-05T08:00:00.000Z", "usr-sup-1")], ...audit("2026-01-05T08:00:00.000Z") },
  { id: "doc-2", supplierId: "sup-1", requirementId: "req-st-contractor-insurance_certificate", status: "VERIFIED", issueDate: "2025-10-10", expiryDate: "2026-09-30", note: null, versions: [ver("insurance.pdf", "2026-01-05T08:00:00.000Z", "usr-sup-1")], ...audit("2026-01-05T08:00:00.000Z") },
  { id: "doc-3", supplierId: "sup-1", requirementId: "req-st-contractor-iso45001", status: "VERIFIED", issueDate: "2024-06-01", expiryDate: "2027-06-01", note: null, versions: [ver("iso-45001.pdf", "2026-01-05T08:00:00.000Z", "usr-sup-1")], ...audit("2026-01-05T08:00:00.000Z") },
  // sup-4 (qualified contractor, uploading now)
  { id: "doc-4", supplierId: "sup-4", requirementId: "req-st-contractor-company_registration", status: "UPLOADED", issueDate: "2026-05-01", expiryDate: null, note: null, versions: [ver("greenvolt-registration.pdf", "2026-07-20T08:00:00.000Z", "usr-sup-4")], ...audit("2026-07-20T08:00:00.000Z") },
  { id: "doc-5", supplierId: "sup-4", requirementId: "req-st-contractor-iso9001", status: "UNDER_REVIEW", issueDate: "2025-03-01", expiryDate: "2026-08-31", note: "Awaiting verification of certificate scope.", versions: [ver("greenvolt-iso9001.pdf", "2026-07-21T08:00:00.000Z", "usr-sup-4")], ...audit("2026-07-21T08:00:00.000Z") },
  // sup-13 (service, under verification)
  { id: "doc-13a", supplierId: "sup-13", requirementId: "req-st-service-company_registration", status: "UNDER_REVIEW", issueDate: "2026-06-01", expiryDate: null, note: null, versions: [ver("inspectco-registration.pdf", "2026-07-22T08:00:00.000Z", "usr-sup-13")], ...audit("2026-07-22T08:00:00.000Z") },
  { id: "doc-13b", supplierId: "sup-13", requirementId: "req-st-service-professional_license", status: "UNDER_REVIEW", issueDate: "2025-01-15", expiryDate: "2026-11-30", note: null, versions: [ver("inspectco-license.pdf", "2026-07-22T08:00:00.000Z", "usr-sup-13")], ...audit("2026-07-22T08:00:00.000Z") },
];

/* ------------------------------------------------------------------ */
/* Notifications                                                       */
/* ------------------------------------------------------------------ */
export const notifications: Notification[] = [
  { id: "ntf-1", userId: "usr-sup-4", type: "ACTION_REQUIRED", title: "Documents required", body: "You are qualified. Please upload the required documents to proceed to AVL approval.", href: "/supplier/documents", read: false, createdAt: "2026-07-16T08:00:00.000Z" },
  { id: "ntf-2", userId: "usr-sup-4", type: "SUCCESS", title: "Qualified at presentation", body: "Congratulations - the committee has qualified GreenVolt. Next step: document upload.", href: "/supplier/application", read: true, createdAt: "2026-07-16T08:00:00.000Z" },
  { id: "ntf-3", userId: "usr-sup-11", type: "INFO", title: "Application received", body: "Your registration is under eligibility screening. You will be invited to book a Thursday presentation shortly.", href: "/supplier/application", read: false, createdAt: "2026-07-18T08:00:00.000Z" },
  { id: "ntf-4", userId: "usr-sup-13", type: "INFO", title: "Documents under verification", body: "Your documents were received and are being verified by Procurement.", href: "/supplier/documents", read: false, createdAt: "2026-07-22T08:00:00.000Z" },
  { id: "ntf-5", userId: "usr-sup-1", type: "SUCCESS", title: "Approved as Strategic Vendor", body: "Sunniva Solar is now an approved Strategic vendor on the AVL.", href: "/supplier/avl", read: true, createdAt: "2026-01-18T08:00:00.000Z" },
];
