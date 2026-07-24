"use client";

import { BadgeCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/page-header";
import { DataState } from "@/components/shared/data-state";
import { ScoreRing } from "@/components/shared/score-ring";
import { EmptyState } from "@/components/shared/empty-state";
import { useAuth } from "@/providers/auth-provider";
import { useAsync } from "@/hooks/use-async";
import { avlService, supplierService } from "@/lib/services";
import { AVL_STATUS, VENDOR_TIER } from "@/lib/labels";
import { formatDate, daysUntil } from "@/lib/utils";

export default function AvlStatusPage() {
  const { user } = useAuth();
  const supplierId = user?.supplierId ?? "";
  const { data, loading, error } = useAsync(async () => {
    const [avl, supplier] = await Promise.all([
      avlService.getCurrentForSupplier(supplierId),
      supplierService.getById(supplierId),
    ]);
    return { avl, supplier };
  }, [supplierId]);

  return (
    <div className="space-y-6">
      <PageHeader title="AVL Status" description="Your position on the Approved Vendor List." />
      <DataState loading={loading} error={error}>
        {data?.avl && data.supplier ? (
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="flex flex-col items-center justify-center p-8 text-center">
              <ScoreRing value={data.avl.score} label="AVL Score" size={150} />
              <Badge variant={VENDOR_TIER[data.avl.vendorTier].variant} className="mt-4">
                {VENDOR_TIER[data.avl.vendorTier].label}
              </Badge>
            </Card>
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Vendor Record</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <Detail k="Vendor ID" v={data.supplier.vendorCode} />
                <Detail
                  k="AVL Status"
                  v={<Badge variant={AVL_STATUS[data.avl.status].variant}>{AVL_STATUS[data.avl.status].label}</Badge>}
                />
                <Detail k="Approval Date" v={formatDate(data.avl.approvalDate)} />
                <Detail
                  k="Expiry Date"
                  v={
                    <span>
                      {formatDate(data.avl.expiryDate)}{" "}
                      <span className="text-xs text-muted-foreground">
                        ({daysUntil(data.avl.expiryDate)} days)
                      </span>
                    </span>
                  }
                />
                <Detail k="Supplier Category" v="Contractor" />
                <Detail k="Cycle" v={data.avl.cycle} />
              </CardContent>
            </Card>
          </div>
        ) : (
          <EmptyState
            icon={BadgeCheck}
            title="Not yet on the Approved Vendor List"
            description="Complete evaluation to receive your vendor tier and score."
          />
        )}
      </DataState>
    </div>
  );
}

function Detail({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{k}</p>
      <div className="font-medium">{v}</div>
    </div>
  );
}
