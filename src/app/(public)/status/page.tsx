"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, FileSearch, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { StepTimeline } from "@/components/shared/step-timeline";
import { EmptyState } from "@/components/shared/empty-state";
import { applicationService, supplierService } from "@/lib/services";
import { STAGE_LABELS, stageProgress } from "@/lib/domain/application";
import { APPLICATION_STATUS_LABEL, APPLICATION_STATUS_VARIANT } from "@/lib/labels";
import { formatDate } from "@/lib/utils";
import type { Application } from "@/types";

export default function PublicStatusPage() {
  return (
    <Suspense fallback={null}>
      <StatusInner />
    </Suspense>
  );
}

function StatusInner() {
  const params = useSearchParams();
  const [ref, setRef] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [app, setApp] = useState<Application | null>(null);
  const [companyName, setCompanyName] = useState<string>("");

  async function lookup(code: string) {
    if (!code.trim()) return;
    setLoading(true);
    setSearched(true);
    const found = await applicationService.getByReference(code);
    setApp(found);
    if (found) {
      const s = await supplierService.getById(found.supplierId);
      setCompanyName(s?.companyName ?? "");
    } else {
      setCompanyName("");
    }
    setLoading(false);
  }

  // Deep link: /status?ref=APP-2026-0142
  useEffect(() => {
    const q = params.get("ref");
    if (q) {
      setRef(q);
      lookup(q);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container max-w-3xl py-16">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Track Your Application</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter your Application ID (e.g. APP-2026-0142) to see your current status. No login required.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          lookup(ref);
        }}
        className="mx-auto mb-8 flex max-w-md gap-2"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="APP-2026-0142"
            value={ref}
            onChange={(e) => setRef(e.target.value)}
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Track"}
        </Button>
      </form>

      {searched && !loading && !app ? (
        <EmptyState
          icon={FileSearch}
          title="No application found"
          description="Check your Application ID and try again. It looks like APP-YYYY-NNNN."
        />
      ) : null}

      {app ? (
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <CardTitle>{app.referenceCode}</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                  {companyName} · Submitted {formatDate(app.submittedAt)}
                </p>
              </div>
              <Badge variant={APPLICATION_STATUS_VARIANT[app.status] ?? "default"}>
                {APPLICATION_STATUS_LABEL[app.status] ?? app.status}
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
      ) : null}
    </div>
  );
}
