import { z } from "zod";

/** Zod schema for supplier registration — shared by the form and (later) the API. */
export const registrationSchema = z
  .object({
    // Step 1 — Company
    companyName: z.string().min(2, "Company name is required"),
    taxId: z.string().regex(/^\d{13}$/, "Tax ID must be 13 digits"),
    registrationNumber: z.string().min(5, "Registration number is required"),
    yearEstablished: z
      .number({ invalid_type_error: "Enter a year" })
      .int()
      .gte(1950, "Enter a valid year")
      .lte(new Date().getFullYear(), "Year cannot be in the future"),
    registeredAddress: z.string().min(5, "Registered address is required"),
    operatingAddress: z.string().optional(),
    website: z.string().url("Enter a valid URL").optional().or(z.literal("")),
    registeredCapital: z.number().nonnegative().optional(),
    employeeCount: z.number().int().nonnegative().optional(),
    businessDescription: z.string().min(20, "Please add at least 20 characters"),

    // Step 2 — Contacts
    primaryContactName: z.string().min(2, "Contact name is required"),
    primaryContactPosition: z.string().min(2, "Position is required"),
    primaryContactPhone: z.string().min(6, "Phone is required"),
    primaryContactEmail: z.string().email("Enter a valid email"),

    financeSameAsPrimary: z.boolean(),
    financeContactName: z.string().optional(),
    financeContactPosition: z.string().optional(),
    financeContactPhone: z.string().optional(),
    financeContactEmail: z.string().email("Enter a valid email").optional().or(z.literal("")),

    // Step 3 — Supplier type & business scope
    supplierTypeId: z.string().min(1, "Select a supplier type"),
    categoryIds: z.array(z.string()).min(1, "Select at least one category"),
    serviceAreaIds: z.array(z.string()).min(1, "Select at least one service area"),
  })
  .refine(
    (d) =>
      d.financeSameAsPrimary ||
      (d.financeContactName && d.financeContactEmail && d.financeContactPhone && d.financeContactPosition),
    {
      message: "Complete the finance contact or tick “same as primary”.",
      path: ["financeContactName"],
    },
  );

export type RegistrationInput = z.infer<typeof registrationSchema>;

/** Fields validated at each wizard step (for step-scoped validation). */
export const STEP_FIELDS: (keyof RegistrationInput)[][] = [
  [
    "companyName",
    "taxId",
    "registrationNumber",
    "yearEstablished",
    "registeredAddress",
    "businessDescription",
  ],
  [
    "primaryContactName",
    "primaryContactPosition",
    "primaryContactPhone",
    "primaryContactEmail",
    "financeSameAsPrimary",
  ],
  ["supplierTypeId", "categoryIds", "serviceAreaIds"],
];
