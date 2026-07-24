"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Logo } from "@/components/shared/logo";
import { useAsync } from "@/hooks/use-async";
import { configService, supplierService } from "@/lib/services";
import { registrationSchema, STEP_FIELDS, type RegistrationInput } from "@/lib/validation/registration";
import { cn } from "@/lib/utils";

const STEPS = ["Company Information", "Contacts", "Business Scope", "Review & Submit"];

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const { data: types } = useAsync(() => configService.liveSupplierTypes(), []);
  const contractorTypeId = types?.[0]?.id;
  const { data: categories } = useAsync(
    () => (contractorTypeId ? configService.categories(contractorTypeId) : Promise.resolve([])),
    [contractorTypeId],
  );
  const { data: areas } = useAsync(() => configService.serviceAreas(), []);

  const form = useForm<RegistrationInput>({
    resolver: zodResolver(registrationSchema),
    mode: "onTouched",
    defaultValues: {
      financeSameAsPrimary: true,
      categoryIds: [],
      serviceAreaIds: [],
    },
  });

  const { register, handleSubmit, watch, setValue, trigger, formState } = form;
  const values = watch();

  async function next() {
    const fields = STEP_FIELDS[step];
    const valid = fields ? await trigger(fields) : true;
    if (valid) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function toggleArrayValue(key: "categoryIds" | "serviceAreaIds", id: string) {
    const current = values[key] ?? [];
    setValue(key, current.includes(id) ? current.filter((x) => x !== id) : [...current, id], {
      shouldValidate: true,
    });
  }

  async function onSubmit(data: RegistrationInput) {
    if (!contractorTypeId) return;
    setSubmitting(true);
    await supplierService.create({
      companyName: data.companyName,
      supplierTypeId: contractorTypeId,
      taxId: data.taxId,
      registrationNumber: data.registrationNumber,
      yearEstablished: data.yearEstablished,
      website: data.website || null,
      registeredCapital: data.registeredCapital ?? null,
      employeeCount: data.employeeCount ?? null,
      businessDescription: data.businessDescription,
      categoryIds: data.categoryIds,
      serviceAreaIds: data.serviceAreaIds,
      avlStatus: "SUSPENDED",
      vendorTier: "NONE",
      blacklistFlag: false,
    });
    setSubmitting(false);
    toast.success("Registration submitted", {
      description: "Our procurement team will review your application.",
    });
    router.push("/login");
  }

  return (
    <div className="container max-w-3xl py-12">
      <div className="mb-8 flex flex-col items-center text-center">
        <Logo className="mb-4" />
        <h1 className="text-2xl font-semibold tracking-tight">Supplier Registration</h1>
        <p className="text-sm text-muted-foreground">Contractor onboarding · Solar EPC & EV Infrastructure</p>
      </div>

      {/* Stepper */}
      <div className="mb-8 grid grid-cols-4 gap-2">
        {STEPS.map((label, i) => (
          <div key={label} className="flex flex-col items-center gap-2">
            <div
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-colors",
                i < step
                  ? "bg-success text-success-foreground"
                  : i === step
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground",
              )}
            >
              {i < step ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            <span className="text-center text-xs text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {step === 0 && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Company Name" required error={formState.errors.companyName?.message}>
                      <Input {...register("companyName")} placeholder="e.g. Sunniva Solar Engineering Co., Ltd." />
                    </Field>
                    <Field label="Tax ID" required error={formState.errors.taxId?.message}>
                      <Input {...register("taxId")} placeholder="13-digit tax ID" />
                    </Field>
                    <Field label="Registration Number" required error={formState.errors.registrationNumber?.message}>
                      <Input {...register("registrationNumber")} />
                    </Field>
                    <Field label="Year Established" required error={formState.errors.yearEstablished?.message}>
                      <Input type="number" {...register("yearEstablished", { valueAsNumber: true })} placeholder="2015" />
                    </Field>
                    <Field label="Registered Capital (THB)" error={formState.errors.registeredCapital?.message}>
                      <Input type="number" {...register("registeredCapital", { valueAsNumber: true })} />
                    </Field>
                    <Field label="Number of Employees" error={formState.errors.employeeCount?.message}>
                      <Input type="number" {...register("employeeCount", { valueAsNumber: true })} />
                    </Field>
                    <Field label="Company Website" error={formState.errors.website?.message} className="sm:col-span-2">
                      <Input {...register("website")} placeholder="https://" />
                    </Field>
                    <Field label="Registered Address" required error={formState.errors.registeredAddress?.message} className="sm:col-span-2">
                      <Input {...register("registeredAddress")} />
                    </Field>
                    <Field label="Business Description" required error={formState.errors.businessDescription?.message} className="sm:col-span-2">
                      <Textarea {...register("businessDescription")} rows={3} />
                    </Field>
                  </div>
                )}

                {step === 1 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="mb-3 text-sm font-semibold">Primary Contact</h3>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="Contact Name" required error={formState.errors.primaryContactName?.message}>
                          <Input {...register("primaryContactName")} />
                        </Field>
                        <Field label="Position" required error={formState.errors.primaryContactPosition?.message}>
                          <Input {...register("primaryContactPosition")} />
                        </Field>
                        <Field label="Phone" required error={formState.errors.primaryContactPhone?.message}>
                          <Input {...register("primaryContactPhone")} />
                        </Field>
                        <Field label="Email" required error={formState.errors.primaryContactEmail?.message}>
                          <Input type="email" {...register("primaryContactEmail")} />
                        </Field>
                      </div>
                    </div>
                    <label className="flex items-center gap-2 text-sm">
                      <Checkbox
                        checked={values.financeSameAsPrimary}
                        onCheckedChange={(v) => setValue("financeSameAsPrimary", Boolean(v))}
                      />
                      Finance contact is the same as primary contact
                    </label>
                    {!values.financeSameAsPrimary && (
                      <div>
                        <h3 className="mb-3 text-sm font-semibold">Finance Contact</h3>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <Field label="Contact Name" required error={formState.errors.financeContactName?.message}>
                            <Input {...register("financeContactName")} />
                          </Field>
                          <Field label="Position" required>
                            <Input {...register("financeContactPosition")} />
                          </Field>
                          <Field label="Phone" required>
                            <Input {...register("financeContactPhone")} />
                          </Field>
                          <Field label="Email" required error={formState.errors.financeContactEmail?.message}>
                            <Input type="email" {...register("financeContactEmail")} />
                          </Field>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="mb-1 text-sm font-semibold">Business Categories</h3>
                      <p className="mb-3 text-xs text-muted-foreground">Select all that apply.</p>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {(categories ?? []).map((c) => (
                          <CheckOption
                            key={c.id}
                            label={c.label}
                            checked={values.categoryIds?.includes(c.id)}
                            onToggle={() => toggleArrayValue("categoryIds", c.id)}
                          />
                        ))}
                      </div>
                      {formState.errors.categoryIds ? (
                        <p className="mt-2 text-xs text-destructive">{formState.errors.categoryIds.message}</p>
                      ) : null}
                    </div>
                    <div>
                      <h3 className="mb-1 text-sm font-semibold">Service Areas</h3>
                      <p className="mb-3 text-xs text-muted-foreground">Where can you deliver?</p>
                      <div className="grid gap-2 sm:grid-cols-3">
                        {(areas ?? []).map((a) => (
                          <CheckOption
                            key={a.id}
                            label={a.label}
                            checked={values.serviceAreaIds?.includes(a.id)}
                            onToggle={() => toggleArrayValue("serviceAreaIds", a.id)}
                          />
                        ))}
                      </div>
                      {formState.errors.serviceAreaIds ? (
                        <p className="mt-2 text-xs text-destructive">{formState.errors.serviceAreaIds.message}</p>
                      ) : null}
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold">Review your details</h3>
                    <dl className="grid gap-3 rounded-xl border border-border p-4 text-sm sm:grid-cols-2">
                      <ReviewRow k="Company" v={values.companyName} />
                      <ReviewRow k="Tax ID" v={values.taxId} />
                      <ReviewRow k="Established" v={String(values.yearEstablished ?? "")} />
                      <ReviewRow k="Primary contact" v={values.primaryContactName} />
                      <ReviewRow k="Email" v={values.primaryContactEmail} />
                      <ReviewRow
                        k="Categories"
                        v={(categories ?? [])
                          .filter((c) => values.categoryIds?.includes(c.id))
                          .map((c) => c.label)
                          .join(", ")}
                      />
                      <ReviewRow
                        k="Service areas"
                        v={(areas ?? [])
                          .filter((a) => values.serviceAreaIds?.includes(a.id))
                          .map((a) => a.label)
                          .join(", ")}
                      />
                    </dl>
                    <p className="text-xs text-muted-foreground">
                      By submitting you confirm the information is accurate. Mandatory documents
                      are uploaded after your account is approved.
                    </p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 flex items-center justify-between">
              <Button type="button" variant="ghost" onClick={() => setStep((s) => Math.max(s - 1, 0))} disabled={step === 0}>
                <ArrowLeft className="h-4 w-4" /> Back
              </Button>
              {step < STEPS.length - 1 ? (
                <Button type="button" onClick={next}>
                  Continue <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" disabled={submitting}>
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                  Submit Registration
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function Field({
  label,
  required,
  error,
  children,
  className,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label>
        {label} {required ? <span className="text-destructive">*</span> : null}
      </Label>
      {children}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}

function CheckOption({
  label,
  checked,
  onToggle,
}: {
  label: string;
  checked?: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "flex items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors",
        checked ? "border-primary bg-primary/5" : "border-border hover:bg-muted",
      )}
    >
      <Checkbox checked={checked} className="pointer-events-none" />
      {label}
    </button>
  );
}

function ReviewRow({ k, v }: { k: string; v?: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{k}</dt>
      <dd className="font-medium">{v || "—"}</dd>
    </div>
  );
}
