"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, CheckCircle2, HelpCircle, XCircle, ClipboardCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/shared/page-header";
import { DataState } from "@/components/shared/data-state";
import { StepTimeline } from "@/components/shared/step-timeline";
import { useAuth } from "@/providers/auth-provider";
import { useAsync } from "@/hooks/use-async";
import { applicationService, supplierService } from "@/lib/services";
import { STAGE_LABELS, stageProgress } from "@/lib/domain/application";
import {
  APPLICATION_STATUS_LABEL,
  APPLICATION_STATUS_VARIANT,
  DECISION_OUTCOME,
  REVIEW_DECISION,
} from "@/lib/labels";
import { formatDate } from "@/lib/utils";
import type { DecisionOutcome } from "@/types";

const REVIEW_LABELS: Record<string, string> = {
  DOCUMENT: "Document Review",
  TECHNICAL: "Technical Review",
  COMMERCIAL: "Commercial Review",
  HSE: "HSE Review",
  FINANCE: "Finance Review",
};

// Decision can be recorded while the application is at these stages.
const DECIDABLE = ["PRESENTED", "INTERNAL_ASSESSMENT", "DECISION"];

export default function AdminApplicationDetailPage() {
  const params = useParams();
  const id = String(params.id);
  const { user } = useAuth();
  const [busy, setBusy] = useState<DecisionOutcome | null>(null);

  const { data, loading, error, reload } = useAsync(async () => {
    const app = await applicationService.getById(id);
    if (!app) return null;
    const supplier = await supplierService.getById(app.supplierId);
    return { app, supplier };
  }, [id]);

  async function decide(outcome: DecisionOutcome) {
    setBusy(outcome);
    try {
      await applicationService.recordDecision(id, outcome);
      toast.success("Decision recorded", { description: DECISION_OUTCOME[outcome]?.label ?? outcome });
      reload();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Application Review"
        description="Internal assessment and committee decision."
        actions={
          <Button variant="outline" asChild>
            <Link href="/admin/applications">
              <ArrowLeft className="h-4 w-4" /> Back to queue
            </Link>
          </Button>
        }
      />
      <DataState loading={loading} error={error}>
        {data?.app && data.supplier ? (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <CardTitle>{data.supplier.companyName}</CardTitle>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {data.app.referenceCode} · {data.supplier.vendorCode} · Submitted {formatDate(data.app.submittedAt)}
                      </p>
                    </div>
                    <Badge variant={APPLICATION_STATUS_VARIANT[data.app.status] ?? "default"}>
                      {APPLICATION_STATUS_LABEL[data.app.status] ?? data.app.status}
                    </Badge>
                  </div>
                  <Progress className="mt-4" value={stageProgress(data.app.currentStage)} />
                </CardHeader>
                <CardContent>
                  <StepTimeline
                    steps={data.app.stageEvents.map((e) => ({
                      label: STAGE_LABELS[e.stage],
                      status: e.status,
                      date: e.occurredAt,
                      note: e.note,
                    }))}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <ClipboardCheck className="h-4 w-4" /> Internal Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {data.app.reviews.length ? (
                    data.app.reviews.map((r) => (
                      <div key={r.id} className="flex items-start justify-between gap-3 border-b border-border pb-3 last:border-0 last:pb-0">
                        <div>
                          <p className="text-sm font-medium">{REVIEW_LABELS[r.type] ?? r.type}</p>
                          {r.comment ? <p className="text-xs text-muted-foreground">{r.comment}</p> : null}
                        </div>
                        <Badge variant={REVIEW_DECISION[r.decision].variant}>{REVIEW_DECISION[r.decision].label}</Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No assessment notes recorded yet.</p>
                  )}
                  <Button variant="link" className="px-0" asChild>
                    <Link href={`/admin/evaluation?application=${data.app.id}`}>Open full evaluation &amp; scoring</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Decision panel */}
            <Card className="h-fit">
              <CardHeader>
                <CardTitle>Committee Decision</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Record the outcome after internal assessment.
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                {data.app.decisionOutcome && data.app.decisionOutcome !== "PENDING" ? (
                  <div className="rounded-lg border border-border p-3">
                    <p className="text-xs text-muted-foreground">Current decision</p>
                    <Badge className="mt-1" variant={DECISION_OUTCOME[data.app.decisionOutcome]?.variant ?? "muted"}>
                      {DECISION_OUTCOME[data.app.decisionOutcome]?.label ?? data.app.decisionOutcome}
                    </Badge>
                    <p className="mt-2 text-xs text-muted-foreground">Decided {formatDate(data.app.decisionAt)}</p>
                  </div>
                ) : null}

                {DECIDABLE.includes(data.app.currentStage) ? (
                  <div className="space-y-2">
                    <Button className="w-full justify-start" onClick={() => decide("QUALIFIED")} disabled={busy !== null}>
                      {busy === "QUALIFIED" ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                      Qualified — request documents
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => decide("MORE_INFO")} disabled={busy !== null}>
                      {busy === "MORE_INFO" ? <Loader2 className="h-4 w-4 animate-spin" /> : <HelpCircle className="h-4 w-4" />}
                      Request more information
                    </Button>
                    <Button variant="outline" className="w-full justify-start text-destructive" onClick={() => decide("REJECT")} disabled={busy !== null}>
                      {busy === "REJECT" ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                      Reject application
                    </Button>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    A decision can be recorded once the supplier has presented and internal
                    assessment is underway.
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Qualified applications advance to Document Upload; documents are only requested
                  after this decision.
                </p>
              </CardContent>
            </Card>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Application not found.</p>
        )}
      </DataState>
    </div>
  );
}
