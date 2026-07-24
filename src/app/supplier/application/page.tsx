"use client";

import { FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/shared/page-header";
import { DataState } from "@/components/shared/data-state";
import { StepTimeline } from "@/components/shared/step-timeline";
import { EmptyState } from "@/components/shared/empty-state";
import { useAuth } from "@/providers/auth-provider";
import { useAsync } from "@/hooks/use-async";
import { applicationService } from "@/lib/services";
import { STAGE_LABELS, stageProgress } from "@/lib/domain/application";
import { REVIEW_DECISION, APPLICATION_STATUS_VARIANT } from "@/lib/labels";
import { formatDate } from "@/lib/utils";

const REVIEW_LABELS: Record<string, string> = {
  DOCUMENT: "Document Review",
  TECHNICAL: "Technical Review",
  COMMERCIAL: "Commercial Review",
  HSE: "HSE Review",
  FINANCE: "Finance Review",
};

export default function ApplicationStatusPage() {
  const { user } = useAuth();
  const supplierId = user?.supplierId ?? "";
  const { data: app, loading, error } = useAsync(
    () => applicationService.currentForSupplier(supplierId),
    [supplierId],
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Application Status" description="Follow your registration through each review stage." />
      <DataState loading={loading} error={error}>
        {app ? (
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{app.referenceCode}</CardTitle>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Submitted {formatDate(app.submittedAt)} · {app.cycle}
                    </p>
                  </div>
                  <Badge variant={APPLICATION_STATUS_VARIANT[app.status] ?? "default"}>
                    {app.status.replace("_", " ")}
                  </Badge>
                </div>
                <Progress className="mt-4" value={stageProgress(app.currentStage)} />
              </CardHeader>
              <CardContent>
                <StepTimeline
                  steps={app.stageEvents.map((e) => ({
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
                <CardTitle>Review Panel</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {app.reviews.map((r) => (
                  <div key={r.id} className="space-y-1 border-b border-border pb-3 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{REVIEW_LABELS[r.type] ?? r.type}</p>
                      <Badge variant={REVIEW_DECISION[r.decision].variant}>
                        {REVIEW_DECISION[r.decision].label}
                      </Badge>
                    </div>
                    {r.comment ? <p className="text-xs text-muted-foreground">{r.comment}</p> : null}
                    {r.reviewedAt ? (
                      <p className="text-xs text-muted-foreground">{formatDate(r.reviewedAt)}</p>
                    ) : null}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        ) : (
          <EmptyState icon={FileText} title="No application found" description="Complete your registration to begin." />
        )}
      </DataState>
    </div>
  );
}
