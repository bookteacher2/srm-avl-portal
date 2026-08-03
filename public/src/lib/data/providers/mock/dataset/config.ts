/**
 * Reference / configuration data.
 *
 * Single source of the dynamic dimensions of the system: supplier types,
 * business categories, service areas, document requirements, evaluation
 * criteria, compliance checklist, and performance criteria.
 *
 * Revision 1.1: all three supplier types (Contractor, Product Supplier,
 * Service Provider) are LIVE and driven purely by this configuration. Each
 * type carries its own categories, documents and evaluation criteria — adding
 * or changing a type is a data change here, not a code change.
 */
import type {
  Category,
  ComplianceItem,
  DocumentRequirement,
  EvaluationCriterion,
  PerformanceCriterion,
  ServiceArea,
  SupplierType,
} from "@/types";

export const CONTRACTOR_TYPE_ID = "st-contractor";
export const PRODUCT_TYPE_ID = "st-product";
export const SERVICE_TYPE_ID = "st-service";

export const supplierTypes: SupplierType[] = [
  {
    id: CONTRACTOR_TYPE_ID,
    code: "CONTRACTOR",
    label: "Contractor",
    description:
      "EPC and installation contractors for Solar and EV infrastructure projects.",
    status: "LIVE",
    sortOrder: 1,
  },
  {
    id: PRODUCT_TYPE_ID,
    code: "PRODUCT",
    label: "Product Supplier",
    description:
      "Manufacturers and distributors of equipment and materials (panels, inverters, chargers, cabling).",
    status: "LIVE",
    sortOrder: 2,
  },
  {
    id: SERVICE_TYPE_ID,
    code: "SERVICE",
    label: "Service Provider",
    description:
      "Professional and support services (engineering consultancy, logistics, testing, training).",
    status: "LIVE",
    sortOrder: 3,
  },
];

/* ---- Categories per supplier type --------------------------------- */
type CatSeed = [id: string, key: string, label: string];

function buildCats(typeId: string, seeds: CatSeed[]): Category[] {
  return seeds.map(([id, key, label], i) => ({
    id,
    supplierTypeId: typeId,
    key,
    label,
    sortOrder: i + 1,
    isActive: true,
  }));
}

export const categories: Category[] = [
  ...buildCats(CONTRACTOR_TYPE_ID, [
    ["cat-solar-epc", "SOLAR_EPC", "Solar EPC"],
    ["cat-electrical", "ELECTRICAL", "Electrical"],
    ["cat-civil", "CIVIL", "Civil"],
    ["cat-mechanical", "MECHANICAL", "Mechanical"],
    ["cat-commissioning", "COMMISSIONING", "Commissioning"],
    ["cat-maintenance", "MAINTENANCE", "Maintenance"],
    ["cat-om", "OM", "O&M"],
    ["cat-ev", "EV_INSTALLATION", "EV Installation"],
  ]),
  ...buildCats(PRODUCT_TYPE_ID, [
    ["cat-pv-modules", "PV_MODULES", "Solar PV Modules"],
    ["cat-inverters", "INVERTERS", "Inverters"],
    ["cat-ev-chargers", "EV_CHARGERS", "EV Chargers (AC/DC)"],
    ["cat-batteries", "BATTERIES", "Batteries & Storage"],
    ["cat-cabling", "CABLING", "Cabling & Electrical Accessories"],
    ["cat-mounting", "MOUNTING", "Mounting Structures"],
  ]),
  ...buildCats(SERVICE_TYPE_ID, [
    ["cat-eng-consult", "ENG_CONSULT", "Engineering Consultancy"],
    ["cat-survey-design", "SURVEY_DESIGN", "Survey & Design"],
    ["cat-testing", "TESTING", "Testing & Inspection"],
    ["cat-logistics", "LOGISTICS", "Logistics & Transport"],
    ["cat-om-service", "OM_SERVICE", "O&M Services"],
    ["cat-training", "TRAINING", "Training & Certification"],
  ]),
];

export const serviceAreas: ServiceArea[] = [
  ["area-bangkok", "BANGKOK", "Bangkok"],
  ["area-central", "CENTRAL", "Central"],
  ["area-north", "NORTH", "North"],
  ["area-south", "SOUTH", "South"],
  ["area-east", "EAST", "East"],
  ["area-west", "WEST", "West"],
  ["area-northeast", "NORTHEAST", "Northeast"],
  ["area-nationwide", "NATIONWIDE", "Nationwide"],
].map(([id, key, label], i) => ({
  id: id!,
  key: key!,
  label: label!,
  sortOrder: i + 1,
}));

/* ---- Document requirements per supplier type ---------------------- */
type ReqSeed = [
  docKey: string,
  label: string,
  description: string,
  mandatory: boolean,
  hasExpiry: boolean,
];

// Shared registration/legal core, requested at the DOCUMENT_UPLOAD stage
// (after a supplier is Qualified) — the Company Profile is the only document
// collected up front at registration.
const coreMandatory: ReqSeed[] = [
  ["company_registration", "Company Registration Certificate", "DBD company registration certificate.", true, false],
  ["vat_certificate", "VAT Certificate", "Por Por 20 VAT registration certificate.", true, false],
  ["company_affidavit", "Company Affidavit", "Affidavit issued within the last 6 months.", true, false],
  ["company_profile", "Company Profile", "Company profile / capability statement (collected at registration).", true, false],
  ["signatory_id", "Authorized Signatory ID", "National ID or passport of the authorised signatory.", true, false],
  ["bank_certificate", "Bank Certificate", "Bank account confirmation letter for payments.", true, false],
];

const sharedSupporting: ReqSeed[] = [
  ["reference_list", "Reference / Track Record", "List of relevant clients or completed work.", false, false],
  ["reference_letters", "Reference Letters", "Client reference / recommendation letters.", false, false],
  ["awards", "Awards & Recognition", "Industry awards and recognitions.", false, false],
];

const avlByType: Record<string, ReqSeed[]> = {
  [CONTRACTOR_TYPE_ID]: [
    ["financial_statements", "Financial Statements", "Audited financials for the last 3 years.", false, false],
    ["engineering_license", "Engineering License", "Construction/engineering business licence.", false, true],
    ["pe_license", "Professional Engineer License", "Professional Engineer (PE) licence.", false, true],
    ["safety_policy", "Safety Policy", "Corporate HSE / safety policy document.", false, false],
    ["org_chart", "Organization Chart", "Current organisation structure.", false, false],
    ["insurance_certificate", "Insurance Certificate", "Public liability / works insurance.", false, true],
    ["iso9001", "ISO 9001", "Quality management certification.", false, true],
    ["iso45001", "ISO 45001", "Occupational health & safety certification.", false, true],
    ["iso14001", "ISO 14001", "Environmental management certification.", false, true],
    ["equipment_list", "Equipment List", "Owned tools, plant and equipment.", false, false],
  ],
  [PRODUCT_TYPE_ID]: [
    ["financial_statements", "Financial Statements", "Audited financials for the last 3 years.", false, false],
    ["product_catalogue", "Product Catalogue", "Catalogue with specifications and models.", false, false],
    ["distributor_cert", "Authorized Distributor Certificate", "Proof of authorised distribution (if applicable).", false, true],
    ["test_reports", "Test Reports / Standards", "IEC / TIS test reports and certifications.", false, true],
    ["warranty_policy", "Warranty Policy", "Product warranty terms and coverage.", false, false],
    ["iso9001", "ISO 9001", "Quality management certification.", false, true],
    ["insurance_certificate", "Product Liability Insurance", "Product liability insurance certificate.", false, true],
  ],
  [SERVICE_TYPE_ID]: [
    ["financial_statements", "Financial Statements", "Audited financials for the last 3 years.", false, false],
    ["professional_license", "Professional License", "Relevant professional / practising licences.", false, true],
    ["safety_policy", "Safety Policy", "Corporate HSE / safety policy document.", false, false],
    ["org_chart", "Organization Chart", "Current organisation structure and key personnel.", false, false],
    ["insurance_certificate", "Professional Indemnity Insurance", "Professional indemnity insurance certificate.", false, true],
    ["iso9001", "ISO 9001", "Quality management certification.", false, true],
  ],
};

function buildReqs(typeId: string, seeds: ReqSeed[], section: DocumentRequirement["section"], offset: number): DocumentRequirement[] {
  return seeds.map(([docKey, label, description, isMandatory, hasExpiry], i) => ({
    id: `req-${typeId}-${docKey}`,
    supplierTypeId: typeId,
    section,
    docKey,
    label,
    description,
    isMandatory,
    hasExpiry,
    sortOrder: offset + i + 1,
  }));
}

export const documentRequirements: DocumentRequirement[] = supplierTypes.flatMap((t) => [
  ...buildReqs(t.id, coreMandatory, "MANDATORY", 0),
  ...buildReqs(t.id, avlByType[t.id] ?? [], "AVL_EVALUATION", 100),
  ...buildReqs(t.id, sharedSupporting, "SUPPORTING", 200),
]);

/* ---- Evaluation criteria per type (same weighting model) ---------- */
type EvalSeed = [key: string, label: string, weight: number];
const evalSeeds: EvalSeed[] = [
  ["COMPANY_COMPLIANCE", "Company & Compliance", 20],
  ["TECHNICAL", "Technical Capability", 30],
  ["EXPERIENCE", "Experience & Track Record", 25],
  ["HSE_QUALITY", "HSE & Quality", 15],
  ["PRESENTATION_COMMERCIAL", "Presentation & Commercial", 10],
];

export const evaluationCriteria: EvaluationCriterion[] = supplierTypes.flatMap((t) =>
  evalSeeds.map(([key, label, weightPercent], i) => ({
    id: `eval-${t.id}-${key}`,
    supplierTypeId: t.id,
    key,
    label,
    weightPercent,
    sortOrder: i + 1,
  })),
);

/* ---- Stage-1 compliance items per type ---------------------------- */
type CompSeed = [key: string, label: string];
const compSeeds: CompSeed[] = [
  ["COMPANY_REGISTRATION", "Company Registration"],
  ["VAT", "VAT Registration"],
  ["BANK_CERTIFICATE", "Bank Certificate"],
  ["REQUIRED_LICENSES", "Required Licenses / Certifications"],
  ["COMPANY_PROFILE", "Company Profile"],
];

export const complianceItems: ComplianceItem[] = supplierTypes.flatMap((t) =>
  compSeeds.map(([key, label], i) => ({
    id: `comp-${t.id}-${key}`,
    supplierTypeId: t.id,
    key,
    label,
    sortOrder: i + 1,
  })),
);

/* ---- Performance criteria (global) -------------------------------- */
export const performanceCriteria: PerformanceCriterion[] = [
  ["perf-safety", "SAFETY", "Safety", 25],
  ["perf-quality", "QUALITY", "Quality", 25],
  ["perf-schedule", "SCHEDULE", "Schedule", 20],
  ["perf-communication", "COMMUNICATION", "Communication", 15],
  ["perf-documentation", "DOCUMENTATION", "Documentation", 5],
  ["perf-commercial", "COMMERCIAL", "Commercial", 10],
].map(([id, key, label, weightPercent], i) => ({
  id: id as string,
  key: key as string,
  label: label as string,
  weightPercent: weightPercent as number,
  sortOrder: i + 1,
}));
