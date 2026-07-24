"use client";

import Link from "next/link";
import {
  FileText,
  CalendarClock,
  ShieldAlert,
  BadgeCheck,
  Star,
  Bell,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/shared/page-header";
import { DataState } from "@/components/shared/data-state";
import { StepTimeline } from "@/components/shared/step-timeline";
import { EmptyState } from "@/components/shared/empty-state";
import { StatGridSkeleton } from "@/components/shared/skeletons";
import { useAuth } from "@/providers/auth-provider";
import { useAsync } from "@/hooks/use-async";
import { dashboardService } from "@/lib/services";
import { stageProgress, STAGE_LABELS } from "@/lib/domain/application";
import { AVL_STATUS, VENDOR_TIER } from "@/lib/labels";
import { expiryState } from "@/lib/domain/documents";
import { formatDate } from "@/lib/utils";

const NOTIF_DOT: Record<string, string> = {
  ACTION_REQUIRED: "bg-primary",
  WARNING: "bg-warning",
  SUCCESS: "bg-success",
  INFO: "bg-muted-foreground",
};

export default function SupplierDashboardPage() {
  const { user } = useAuth();
  const supplierId = user?.supplierId ?? "";
  const { data, loading, error } = useAsync(
    () => dashboardService.forSupplier(supplierId, user?.id),
    [supplierId, user?.id],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome, ${user?.name ?? "Supplier"}`}
        description="Track your registration, presentation, documents, and vendor status."
      />

      <DataState loading={loading} error={error} skeleton={<StatGridSkeleton />}>
        {data ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="h-4 w-4" /> Application
                  </div>
                  {data.application ? (
                    <>
                      <p className="mt-2 font-semibold">
                        {STAGE_LABELS[data.application.currentStage]}
                      </p>
                      <Progress className="mt-3" value={stageProgress(data.application.currentStage)} />
                    </>
                  ) : (
                    <p className="mt-2 text-sm text-muted-foreground">No application yet</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarClock className="h-4 w-4" /> Presentation
                  </div>
                  {data.booking ? (
                    <>
                      <p className="mt-2 font-semibold">{formatDate(data.booking.date)}</p>
                      <p className="text-sm text-muted-foreground">{data.booking.time} · {data.booking.status}</p>
                    </>
                  ) : (
                    <p className="mt-2 text-sm text-muted-foreground">Not scheduled</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <BadgeCheck className="h-4 w-4" /> AVL Status
                  </div>
                  {data.avl ? (
                    <div className="mt-2 space-y-1">
                      <Badge variant={AVL_STATUS[data.avl.status].variant}>
                        {AVL_STATUS[data.avl.status].label}
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        {VENDOR_TIER[data.avl.vendorTier].label}
                      </p>
                    </div>
                  ) : (
                    <p className="mt-2 text-sm text-muted-foreground">Pending approval</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Star className="h-4 w-4" /> Performance
                  </div>
                  <p className="mt-2 text-2xl font-semibold">
                    {data.latestPerformance !== null ? data.latestPerformance.toFixed(1) : "—"}
                  </p>
                  <p className="text-sm text-muted-foreground">Average project score</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="lg:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Application Progress</CardTitle>
                  <Button variant="link" asChild className="px-0">
                    <Link href="/supplier/application">
                      View details <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  {data.application ? (
                    <StepTimeline
                      steps={data.application.stageEvents.map((e) => ({
                        label: STAGE_LABELS[e.stage],
                        status: e.status,
                        date: e.occurredAt,
                        note: e.note,
                      }))}
                    />
                  ) : (
                    <EmptyState icon={FileText} title="No application submitted yet" />
                  )}
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <ShieldAlert className="h-4 w-4 text-warning-foreground" /> Document Expiry
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {data.expiringDocuments.length ? (
                      data.expiringDocuments.map(({ document, label }) => {
                        const expired = expiryState(document.expiryDate) === "EXPIRED";
                        return (
                          <div key={document.id} className="flex items-center justify-between gap-2 text-sm">
                            <span className="truncate text-muted-foreground">{label}</span>
                            <Badge variant={expired ? "destructive" : "warning"}>
                              {formatDate(document.expiryDate)}
                            </Badge>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-sm text-muted-foreground">No documents expiring soon.</p>
                    )}
                    <Button variant="outline" size="sm" asChild className="w-full">
                      <Link href="/supplier/documents">Manage documents</Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Bell className="h-4 w-4" /> Notifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {data.notifications.length ? (
                      data.notifications.slice(0, 4).map((n) => (
                        <div key={n.id} className="flex gap-3">
                          <span
                            className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${NOTIF_DOT[n.type] ?? "bg-muted-foreground"}`}
                          />
                          <div className="min-w-0">
                            <p className="text-sm font-medium leading-tight">{n.title}</p>
                            <p className="text-xs text-muted-foreground">{n.body}</p>
                            <p className="mt-0.5 text-[11px] text-muted-foreground">{formatDate(n.createdAt)}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">You&apos;re all caught up.</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        ) : null}
      </DataState>
    </div>
  );
}
