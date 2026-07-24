"use client";

import {
  FileStack,
  Clock,
  BadgeCheck,
  AlertTriangle,
  XCircle,
  CalendarClock,
  ShieldAlert,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { ScoreRing } from "@/components/shared/score-ring";
import { DataState } from "@/components/shared/data-state";
import { ApplicationsByMonthChart, CategoryDistributionChart } from "@/components/admin/dashboard-charts";
import { DashboardSkeleton } from "@/components/shared/skeletons";
import { useAsync } from "@/hooks/use-async";
import { dashboardService } from "@/lib/services";

export default function AdminDashboardPage() {
  const { data, loading, error } = useAsync(() => dashboardService.forAdmin(), []);

  return (
    <div className="space-y-6">
      <PageHeader title="Procurement Dashboard" description="Supplier pipeline, approvals, and vendor health at a glance." />
      <DataState loading={loading} error={error} skeleton={<DashboardSkeleton />}>
        {data ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard label="Applications" value={data.stats.applications} icon={FileStack} />
              <StatCard label="Pending Review" value={data.stats.pendingReview} icon={Clock} tone="warning" />
              <StatCard label="Approved Vendors" value={data.stats.approvedVendors} icon={BadgeCheck} tone="success" />
              <StatCard label="Conditional" value={data.stats.conditionalVendors} icon={AlertTriangle} tone="warning" />
              <StatCard label="Rejected" value={data.stats.rejectedVendors} icon={XCircle} tone="destructive" />
              <StatCard label="Upcoming Presentations" value={data.stats.upcomingPresentations} icon={CalendarClock} />
              <StatCard label="Docs Expiring Soon" value={data.stats.documentsExpiringSoon} icon={ShieldAlert} tone="destructive" />
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="lg:col-span-2">
                <CardHeader><CardTitle>Applications by Month</CardTitle></CardHeader>
                <CardContent><ApplicationsByMonthChart data={data.applicationsByMonth} /></CardContent>
              </Card>
              <Card className="flex flex-col items-center justify-center">
                <CardHeader><CardTitle>Approval Rate</CardTitle></CardHeader>
                <CardContent className="flex flex-col items-center pb-8">
                  <ScoreRing value={data.approvalRate} label="approved" size={150} />
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader><CardTitle>Supplier Categories</CardTitle></CardHeader>
              <CardContent className="grid items-center gap-6 md:grid-cols-2">
                <CategoryDistributionChart data={data.categoryDistribution} />
                <div className="grid grid-cols-2 gap-2">
                  {data.categoryDistribution.map((c) => (
                    <div key={c.category} className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2 text-sm">
                      <span className="text-muted-foreground">{c.category}</span>
                      <span className="font-semibold">{c.count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        ) : null}
      </DataState>
    </div>
  );
}
