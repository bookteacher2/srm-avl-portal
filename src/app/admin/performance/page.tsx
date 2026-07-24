"use client";

import { useMemo, useState } from "react";
import { Star, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/shared/page-header";
import { DataState } from "@/components/shared/data-state";
import { EmptyState } from "@/components/shared/empty-state";
import { useAuth } from "@/providers/auth-provider";
import { useAsync } from "@/hooks/use-async";
import { configService, performanceService, supplierService } from "@/lib/services";
import { computePerformanceScore } from "@/lib/domain/performance";
import { formatDate } from "@/lib/utils";

export default function AdminPerformancePage() {
  const { user } = useAuth();
  const [supplierId, setSupplierId] = useState<string>("");
  const [projectName, setProjectName] = useState("");
  const [scores, setScores] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);

  const { data: base, loading, error } = useAsync(async () => {
    const [{ items: suppliers }, criteria] = await Promise.all([
      supplierService.list({ pageSize: 200 }),
      configService.performanceCriteria(),
    ]);
    return { suppliers, criteria };
  }, []);

  const activeSupplier = supplierId || base?.suppliers[0]?.id || "";

  const { data: history, reload } = useAsync(
    () => (activeSupplier ? performanceService.listBySupplier(activeSupplier) : Promise.resolve([])),
    [activeSupplier],
  );

  const criteria = base?.criteria ?? [];
  const scoreLines = criteria.map((c) => ({ criterionId: c.id, score: scores[c.id] ?? 80 }));
  const liveTotal = useMemo(
    () => computePerformanceScore(scoreLines, criteria),
    [scoreLines, criteria],
  );

  async function handleRecord() {
    if (!activeSupplier || !projectName) {
      toast.error("Enter a project name first.");
      return;
    }
    setSubmitting(true);
    await performanceService.record({
      supplierId: activeSupplier,
      projectId: `prj-${Date.now()}`,
      projectName,
      evaluatorId: user?.id,
      scores: scoreLines,
    });
    setSubmitting(false);
    setProjectName("");
    toast.success("Performance evaluation recorded", { description: `Score ${liveTotal.toFixed(1)}` });
    reload();
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Performance Evaluation" description="Score supplier delivery after each project. History is retained." />
      <DataState loading={loading} error={error}>
        {base ? (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <Card>
                <CardHeader><CardTitle>Evaluation History</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="max-w-sm space-y-1.5">
                    <Label>Supplier</Label>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm shadow-soft"
                      value={activeSupplier}
                      onChange={(e) => setSupplierId(e.target.value)}
                    >
                      {base.suppliers.map((s) => (
                        <option key={s.id} value={s.id}>{s.companyName}</option>
                      ))}
                    </select>
                  </div>
                  {history && history.length ? (
                    <div className="space-y-3">
                      {history.map((h) => (
                        <div key={h.id} className="rounded-xl border border-border p-4">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">{h.projectName}</p>
                            <Badge variant={h.weightedTotal >= 80 ? "success" : h.weightedTotal >= 65 ? "warning" : "destructive"}>
                              {h.weightedTotal.toFixed(1)}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{formatDate(h.evaluationDate)}</p>
                          {h.comment ? <p className="mt-2 text-sm text-muted-foreground">{h.comment}</p> : null}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState icon={Star} title="No performance records yet" />
                  )}
                </CardContent>
              </Card>
            </div>

            <Card className="h-fit">
              <CardHeader>
                <CardTitle>Record Evaluation</CardTitle>
                <p className="text-sm text-muted-foreground">Live weighted total: <span className="font-semibold text-foreground">{liveTotal.toFixed(1)}</span></p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Project Name</Label>
                  <Input value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="e.g. Rayong Solar Farm Phase 2" />
                </div>
                {criteria.map((c) => (
                  <div key={c.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{c.label} <span className="text-muted-foreground">· {c.weightPercent}%</span></span>
                      <span className="tabular-nums font-semibold">{scores[c.id] ?? 80}</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={scores[c.id] ?? 80}
                      onChange={(e) => setScores((s) => ({ ...s, [c.id]: Number(e.target.value) }))}
                      className="w-full accent-[hsl(var(--primary))]"
                    />
                  </div>
                ))}
                <Button className="w-full" onClick={handleRecord} disabled={submitting}>
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Save Evaluation
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : null}
      </DataState>
    </div>
  );
}
