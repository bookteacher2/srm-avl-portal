"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, XCircle, ShieldCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/shared/page-header";
import { DataState } from "@/components/shared/data-state";
import { ScoreRing } from "@/components/shared/score-ring";
import { useAsync } from "@/hooks/use-async";
import { useAuth } from "@/providers/auth-provider";
import { applicationService, configService, evaluationService, supplierService } from "@/lib/services";
import { computeWeightedScore, mapRecommendation, mapVendorTier, stageOnePassed } from "@/lib/domain/scoring";
import { RECOMMENDATION } from "@/lib/labels";
import type { Application, ComplianceItem, EvaluationCriterion, Supplier, SupplierType } from "@/types";

interface EvalData {
  app: Application;
  supplier: Supplier;
  criteria: EvaluationCriterion[];
  compliance: ComplianceItem[];
  supplierType: SupplierType;
}

export default function EvaluationPage() {
  return (
    <Suspense fallback={null}>
      <EvaluationInner />
    </Suspense>
  );
}

function EvaluationInner() {
  const params = useSearchParams();
  const { user } = useAuth();
  const applicationId = params.get("application") ?? "";

  const { data, loading, error } = useAsync(async () => {
    const apps = await applicationService.list({ pageSize: 200 });
    const app = applicationId
      ? await applicationService.getById(applicationId)
      : apps.items[0] ?? null;
    if (!app) return null;
    const supplier = await supplierService.getById(app.supplierId);
    if (!supplier) return null;
    const [criteria, compliance, types] = await Promise.all([
      configService.evaluationCriteria(supplier.supplierTypeId),
      configService.complianceItems(supplier.supplierTypeId),
      configService.supplierTypes(),
    ]);
    const supplierType = types.find((t) => t.id === supplier.supplierTypeId)!;
    return { app, supplier, criteria, compliance, supplierType };
  }, [applicationId]);

  return (
    <div className="space-y-6">
      <PageHeader title="Supplier Evaluation" description="Two-stage assessment: mandatory compliance, then weighted scoring." />
      <DataState loading={loading} error={error}>
        {data ? (
          <EvaluationForm
            key={data.app.id}
            data={data}
            evaluatorId={user?.id}
          />
        ) : null}
      </DataState>
    </div>
  );
}

function EvaluationForm({ data, evaluatorId }: { data: EvalData; evaluatorId?: string }) {
  const { app, supplier, criteria, compliance, supplierType } = data;
  const [checks, setChecks] = useState<Record<string, boolean>>(
    Object.fromEntries(compliance.map((c) => [c.id, true])),
  );
  const [scores, setScores] = useState<Record<string, number>>(
    Object.fromEntries(criteria.map((c) => [c.id, 75])),
  );
  const [submitting, setSubmitting] = useState(false);

  const complianceResults = compliance.map((c) => ({ itemId: c.id, passed: checks[c.id] ?? false }));
  const passedStageOne = stageOnePassed(complianceResults);

  const scoreLines = criteria.map((c) => ({ criterionId: c.id, score: scores[c.id] ?? 0 }));
  const total = useMemo(() => computeWeightedScore(scoreLines, criteria), [scoreLines, criteria]);
  const recommendation = passedStageOne ? mapRecommendation(total) : "REJECTED";

  async function handleSubmit() {
    setSubmitting(true);
    await evaluationService.submit({
      applicationId: app.id,
      supplierId: supplier.id,
      supplierType,
      evaluatorId,
      complianceResults,
      scores: scoreLines,
      note: undefined,
    });
    setSubmitting(false);
    toast.success("Evaluation submitted", {
      description: `${supplier.companyName}: ${RECOMMENDATION[recommendation].label} (${total.toFixed(1)})`,
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        {/* Stage 1 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" /> Stage 1 · Mandatory Compliance
              </CardTitle>
              <Badge variant={passedStageOne ? "success" : "destructive"}>
                {passedStageOne ? "Pass" : "Fail"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">All items must pass to proceed to scoring.</p>
          </CardHeader>
          <CardContent className="space-y-2">
            {compliance.map((item) => (
              <label
                key={item.id}
                className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5 text-sm"
              >
                <span>{item.label}</span>
                <span className="flex items-center gap-3">
                  <span className={checks[item.id] ? "text-success" : "text-destructive"}>
                    {checks[item.id] ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                  </span>
                  <Checkbox
                    checked={checks[item.id]}
                    onCheckedChange={(v) => setChecks((s) => ({ ...s, [item.id]: Boolean(v) }))}
                  />
                </span>
              </label>
            ))}
          </CardContent>
        </Card>

        {/* Stage 2 */}
        <Card className={passedStageOne ? "" : "opacity-60"}>
          <CardHeader>
            <CardTitle>Stage 2 · Weighted Score</CardTitle>
            <p className="text-sm text-muted-foreground">
              {passedStageOne ? "Score each criterion from 0–100." : "Locked until Stage 1 passes."}
            </p>
          </CardHeader>
          <CardContent className="space-y-5">
            {criteria.map((c) => (
              <div key={c.id} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">
                    {c.label} <span className="text-muted-foreground">· {c.weightPercent}%</span>
                  </span>
                  <span className="tabular-nums font-semibold">{scores[c.id]}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={scores[c.id]}
                  disabled={!passedStageOne}
                  onChange={(e) => setScores((s) => ({ ...s, [c.id]: Number(e.target.value) }))}
                  className="w-full accent-[hsl(var(--primary))]"
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Result panel */}
      <div className="space-y-6">
        <Card className="sticky top-24">
          <CardHeader>
            <CardTitle>Result</CardTitle>
            <p className="text-sm text-muted-foreground">{supplier.companyName}</p>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <ScoreRing value={passedStageOne ? total : 0} label="Total Score" size={150} />
            <Badge variant={RECOMMENDATION[recommendation].variant} className="text-sm">
              {RECOMMENDATION[recommendation].label}
            </Badge>
            <Separator />
            <div className="w-full space-y-1 text-sm">
              <RowKV k="Application" v={app.referenceCode} />
              <RowKV k="Vendor Tier" v={mapVendorTier(recommendation).replace("NONE", "—")} />
              <RowKV k="Stage 1" v={passedStageOne ? "Passed" : "Failed"} />
            </div>
            <Button className="w-full" onClick={handleSubmit} disabled={submitting}>
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Submit Evaluation
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              90+ Strategic · 80–89 Approved · 65–79 Conditional · &lt;65 Rejected
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function RowKV({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{k}</span>
      <span className="font-medium">{v}</span>
    </div>
  );
}
