/**
 * Reference / configuration data.
 *
 * This is the single source of the dynamic dimensions of the system:
 * supplier types, business categories, service areas, document requirements,
 * evaluation criteria, compliance checklist, and performance criteria.
 *
 * Version 1 ships CONTRACTOR live; PRODUCT and SERVICE are seeded as
 * COMING_SOON so the app is already multi-type by configuration — no code
 * changes needed to switch them on.
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
    status: "COMING_SOON",
    sortOrder: 2,
  },
  {
    id: SERVICE_TYPE_ID,
    code: "SERVICE",
    label: "Service Provider",
    description:
      "Professional and support services (engineering consultancy, logistics, testing).",
    status: "COMING_SOON",
    sortOrder: 3,
  },
];

export const categories: Category[] = [
  ["cat-solar-epc", "SOLAR_EPC", "Solar EPC"],
  ["cat-electrical", "ELECTRICAL", "Electrical"],
  ["cat-civil", "CIVIL", "Civil"],
  ["cat-mechanical", "MECHANICAL", "Mechanical"],
  ["cat-commissioning", "COMMISSIONING", "Commissioning"],
  ["cat-maintenance", "MAINTENANCE", "Maintenance"],
  ["cat-om", "OM", "O&M"],
  ["cat-ev", "EV_INSTALLATION", "EV Installation"],
].map(([id, key, label], i) => ({
  id: id!,
  supplierTypeId: CONTRACTOR_TYPE_ID,
  key: key!,
  label: label!,
  sortOrder: i + 1,
  isActive: true,
}));

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

type ReqSeed = [
  docKey: string,
  label: string,
  description: string,
  mandatory: boolean,
  hasExpiry: boolean,
];

const mandatoryReqs: ReqSeed[] = [
  ["company_registration", "Company Registration Certificate", "DBD company registration certificate (หนังสือรับรองบริษัท).", true, false],
  ["vat_certificate", "VAT Certificate", "Por Por 20 VAT registration certificate.", true, false],
  ["company_affidavit", "Company Affidavit", "Affidavit issued within the last 6 months.", true, false],
  ["company_profile", "Company Profile", "Company profile / capability statement (PDF).", true, false],
  ["signatory_id", "Authorized Signatory ID", "National ID or passport of the authorised signatory.", true, false],
  ["bank_certificate", "Bank Certificate", "Bank account confirmation letter for payments.", true, false],
];

const avlReqs: ReqSeed[] = [
  ["financial_statements", "Financial Statements", "Audited financials for the last 3 years.", false, false],
  ["engineering_license", "Engineering License", "Construction/engineering business licence.", false, true],
  ["pe_license", "Professional Engineer License", "Professional Engineer (กว.) licence.", false, true],
  ["safety_policy", "Safety Policy", "Corporate HSE / safety policy document.", false, false],
  ["org_chart", "Organization Chart", "Current organisation structure.", false, false],
  ["insurance_certificate", "Insurance Certificate", "Public liability / works insurance.", false, true],
  ["iso9001", "ISO 9001", "Quality management certification.", false, true],
  ["iso45001", "ISO 45001", "Occupational health & safety certification.", false, true],
  ["iso14001", "ISO 14001", "Environmental management certification.", false, true],
];

const supportingReqs: ReqSeed[] = [
  ["project_reference_list", "Project Reference List", "List of relevant completed projects.", false, false],
  ["completion_certificates", "Completion Certificates", "Owner-issued completion certificates.", false, false],
  ["reference_letters", "Reference Letters", "Client reference / recommendation letters.", false, false],
  ["equipment_list", "Equipment List", "Owned tools, plant and equipment.", false, false],
  ["awards", "Awards", "Industry awards and recognitions.", false, false],
  ["project_photos", "Completed Project Photos", "Photographs of completed installations.", false, false],
];

function buildReqs(
  seeds: ReqSeed[],
  section: DocumentRequirement["section"],
  offset: number,
): DocumentRequirement[] {
  return seeds.map(([docKey, label, description, isMandatory, hasExpiry], i) => ({
    id: `req-${docKey}`,
    supplierTypeId: CONTRACTOR_TYPE_ID,
    section,
    docKey,
    label,
    description,
    isMandatory,
    hasExpiry,
    sortOrder: offset + i + 1,
  }));
}

export const documentRequirements: DocumentRequirement[] = [
  ...buildReqs(mandatoryReqs, "MANDATORY", 0),
  ...buildReqs(avlReqs, "AVL_EVALUATION", 100),
  ...buildReqs(supportingReqs, "SUPPORTING", 200),
];

export const evaluationCriteria: EvaluationCriterion[] = [
  ["eval-company", "COMPANY_COMPLIANCE", "Company & Compliance", 20],
  ["eval-technical", "TECHNICAL", "Technical Capability", 30],
  ["eval-experience", "EXPERIENCE", "Project Experience", 25],
  ["eval-hse", "HSE_QUALITY", "HSE & Quality", 15],
  ["eval-presentation", "PRESENTATION_COMMERCIAL", "Presentation & Commercial", 10],
].map(([id, key, label, weightPercent], i) => ({
  id: id as string,
  supplierTypeId: CONTRACTOR_TYPE_ID,
  key: key as string,
  label: label as string,
  weightPercent: weightPercent as number,
  sortOrder: i + 1,
}));

export const complianceItems: ComplianceItem[] = [
  ["comp-registration", "COMPANY_REGISTRATION", "Company Registration"],
  ["comp-vat", "VAT", "VAT"],
  ["comp-bank", "BANK_CERTIFICATE", "Bank Certificate"],
  ["comp-licenses", "REQUIRED_LICENSES", "Required Licenses"],
  ["comp-profile", "COMPANY_PROFILE", "Company Profile"],
].map(([id, key, label], i) => ({
  id: id!,
  supplierTypeId: CONTRACTOR_TYPE_ID,
  key: key!,
  label: label!,
  sortOrder: i + 1,
}));

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
