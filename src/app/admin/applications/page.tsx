"use client";

import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/shared/page-header";
import { DataState } from "@/components/shared/data-state";
import { TableSkeleton } from "@/components/shared/skeletons";
import { useAsync } from "@/hooks/use-async";
import { applicationService, supplierService } from "@/lib/services";
import { STAGE_LABELS } from "@/lib/domain/application";
import { APPLICATION_STATUS_VARIANT } from "@/lib/labels";
import { formatDate } from "@/lib/utils";

export default function AdminApplicationsPage() {
  const [query, setQuery] = useState("");
  const { data, loading, error } = useAsync(async () => {
    const [{ items: apps }, { items: suppliers }] = await Promise.all([
      applicationService.list({ pageSize: 200 }),
      supplierService.list({ pageSize: 200 }),
    ]);
    const nameById = new Map(suppliers.map((s) => [s.id, s.companyName]));
    return apps.map((a) => ({ ...a, companyName: nameById.get(a.supplierId) ?? a.supplierId }));
  }, []);

  const filtered = (data ?? []).filter(
    (a) =>
      a.companyName.toLowerCase().includes(query.toLowerCase()) ||
      a.referenceCode.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Applications" description="Review and evaluate supplier applications." />
      <Card>
        <CardContent className="p-4">
          <div className="relative mb-4 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search company or reference…" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <DataState loading={loading} error={error} skeleton={<TableSkeleton cols={6} />}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-mono text-xs">{a.referenceCode}</TableCell>
                    <TableCell className="font-medium">{a.companyName}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{STAGE_LABELS[a.currentStage]}</TableCell>
                    <TableCell>
                      <Badge variant={APPLICATION_STATUS_VARIANT[a.status] ?? "default"}>
                        {a.status.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{formatDate(a.submittedAt)}</TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/admin/evaluation?application=${a.id}`}>Evaluate</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </DataState>
        </CardContent>
      </Card>
    </div>
  );
}
