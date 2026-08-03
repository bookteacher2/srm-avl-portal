"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Info, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Logo } from "@/components/shared/logo";
import { useAsync } from "@/hooks/use-async";
import { configService, registrationService, type RegistrationResult } from "@/lib/services";
import { registrationSchema, STEP_FIELDS, type RegistrationInput } from "@/lib/validation/registration";
import { cn } from "@/lib/utils";

const STEPS = ["Company Information", "Contacts", "Category & Scope", "Review & Submit"];

export default function RegisterPage() {
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<RegistrationResult | null>(null);

  const { data: types } = useAsync(() => configService.liveSupplierTypes(), []);
  const { data: areas } = useAsync(() => configService.serviceAreas(), []);

  const form = useForm<RegistrationInput>({
    resolver: zodResolver(registrationSchema),
    mode: "onTouched",
    defaultValues: {
      // Agreed rule: Finance contact is NOT the same as primary by default.
      financeSameAsPrimary: false,
      supplierTypeId: "",
      categoryIds: [],
      serviceAreaIds: [],
    },
  });

  const { register, handleSubmit, watch, setValue, trigger, formState } = form;
  const values = watch();

  const { data: categories } = useAsync(
    () => (values.supplierTypeId ? configService.categories(values.supplierTypeId) : Promise.resolve([])),
    [values.supplierTypeId],
  );

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

  function selectType(id: string) {
    setValue("supplierTypeId", id, { shouldValidate: true });
    setValue("categoryIds", []); // categories are type-specific — reset on change
  }

  async function onSubmit(data: RegistrationInput) {
    setSubmitting(true);
    try {
      const res = await registrationService.register(data);
      setResult(res);
      toast.success("Registration submitted", {
        description: `Supplier ${res.supplier.vendorCode} created.`,
      });
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  if (result) return <RegistrationSuccess result={result} />;

  const typeLabel = types?.find((t) => t.id === values.supplierTypeId)?.label ?? "";

  return (
    <div className="container max-w-3xl py-12">
      <div className="mb-8 flex flex-col items-center text-center">
        <Logo className="mb-4" />
        <h1 className="text-2xl font-semibold tracking-tight">Supplier Registration</h1>
        <p className="text-sm text-muted-foreground">
          Contractors, Product Suppliers &amp; Service Providers · Solar EPC &amp; EV Infrastructure
        </p>
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
                    <Field label="Tax ID / Registration No." required error={formState.errors.taxId?.message}>
                      <Input {...register("taxId")} placeholder="13-digit tax ID" />
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
                    <Field
                      label="Business Description"
                      required
                      error={formState.errors.businessDescription?.message}
                      hint="Describe what your company does: main services, years of experience, key projects or clients, and your coverage area (min. 20 characters)."
                      className="sm:col-span-2"
                    >
                      <Textarea
                        {...register("businessDescription")}
                        rows={3}
                        placeholder="e.g. Solar EPC contractor since 2015, specialising in rooftop and ground-mount PV. Delivered 40+ MW for industrial clients across Central and Eastern Thailand, with in-house electrical and commissioning teams."
                      />
                    </Field>
                    <div className="sm:col-span-2 rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
                      Registration is lightweight. Only your company details, contacts, category and
                      Company Profile are needed now. Full documents are requested later — after your
                      committee presentation and a Qualified decision.
                    </div>
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
                        onCheckedChange={(v) => setValue("financeSameAsPrimary", Boolean(v), { shouldValidate: true })}
                      />
                      Finance contact is the same as primary contact
                    </label>
                    {!values.financeSameAsPrimary && (
                      <div>
                        <h3 className="mb-1 text-sm font-semibold">Finance Contact</h3>
                        <p className="mb-3 text-xs text-muted-foreground">Required unless the box above is ticked.</p>
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
                      <h3 className="mb-1 text-sm font-semibold">Supplier Type</h3>
                      <p className="mb-3 text-xs text-muted-foreground">Choose how you want to register.</p>
                      <div className="grid gap-3 sm:grid-cols-3">
                        {(types ?? []).map((t) => (
                          <button
                            type="button"
                            key={t.id}
                            onClick={() => selectType(t.id)}
                            className={cn(
                              "rounded-xl border p-4 text-left transition-colors",
                              values.supplierTypeId === t.id
                                ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                                : "border-border hover:bg-muted",
                            )}
                          >
                            <p className="text-sm font-semibold">{t.label}</p>
                            <p className="mt-1 text-xs text-muted-foreground">{t.description}</p>
                          </button>
                        ))}
                      </div>
                      {formState.errors.supplierTypeId ? (
                        <p className="mt-2 text-xs text-destructive">{formState.errors.supplierTypeId.message}</p>
                      ) : null}
                    </div>

                    {values.supplierTypeId ? (
                      <div>
                        <h3 className="mb-1 text-sm font-semibold">Business Categories</h3>
                        <p className="mb-3 text-xs text-muted-foreground">Select all that apply for {typeLabel}.</p>
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
                    ) : null}

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
                      <ReviewRow k="Supplier type" v={typeLabel} />
                      <ReviewRow k="Tax ID" v={values.taxId} />
                      <ReviewRow k="Established" v={String(values.yearEstablished ?? "")} />
                      <ReviewRow k="Primary contact" v={values.primaryContactName} />
                      <ReviewRow k="Email" v={values.primaryContactEmail} />
                      <ReviewRow
                        k="Categories"
                        v={(categories ?? []).filter((c) => values.categoryIds?.includes(c.id)).map((c) => c.label).join(", ")}
                      />
                      <ReviewRow
                        k="Service areas"
                        v={(areas ?? []).filter((a) => values.serviceAreaIds?.includes(a.id)).map((a) => a.label).join(", ")}
                      />
                    </dl>
                    <p className="text-xs text-muted-foreground">
                      By submitting you create your supplier account and application. Next steps:
                      a brief eligibility screening, then booking your Thursday presentation.
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

function RegistrationSuccess({ result }: { result: RegistrationResult }) {
  return (
    <div className="container max-w-xl py-16">
      <Card>
        <CardContent className="space-y-5 p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success/10 text-success">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">Registration submitted</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Your supplier account and application have been created. Please keep these reference
              numbers to track your application.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-border p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Supplier ID</p>
              <p className="mt-1 font-mono text-lg font-semibold">{result.supplier.vendorCode}</p>
            </div>
            <div className="rounded-xl border border-border p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Application ID</p>
              <p className="mt-1 font-mono text-lg font-semibold">{result.application.referenceCode}</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Next: a brief eligibility screening by our procurement team, then you will be invited to
            book a Thursday presentation.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Button asChild>
              <Link href={`/status?ref=${encodeURIComponent(result.application.referenceCode)}`}>
                Track my application
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/login">Go to login</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Field({
  label,
  required,
  error,
  hint,
  children,
  className,
}: {
  label: string;
  required?: boolean;
  error?: string;
  /** Optional guidance shown as an info icon (hover) and helper text. */
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center gap-1.5">
        <Label>
          {label} {required ? <span className="text-destructive">*</span> : null}
        </Label>
        {hint ? (
          <span title={hint} aria-label={hint} className="cursor-help text-muted-foreground">
            <Info className="h-3.5 w-3.5" />
          </span>
        ) : null}
      </div>
      {children}
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
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
