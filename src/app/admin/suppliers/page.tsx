"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/shared/page-header";
import { DataState } from "@/components/shared/data-state";
import { TableSkeleton } from "@/components/shared/skeletons";
import { useAsync } from "@/hooks/use-async";
import { supplierService } from "@/lib/services";
import { AVL_STATUS, VENDOR_TIER } from "@/lib/labels";
import { formatScore } from "@/lib/utils";

export default function AdminSuppliersPage() {
  const [query, setQuery] = useState("");
  const { data, loading, error } = useAsync(() => supplierService.list({ pageSize: 200 }), []);

  const rows = (data?.items ?? []).filter(
    (s) =>
      s.companyName.toLowerCase().includes(query.toLowerCase()) ||
      s.vendorCode.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Suppliers" description="The full supplier master directory." />
      <Card>
        <CardContent className="p-4">
          <div className="relative mb-4 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search suppliers…" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <DataState loading={loading} error={error} skeleton={<TableSkeleton cols={5} />}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vendor ID</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Tier</TableHead>
                  <TableHead>AVL Status</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-mono text-xs">{s.vendorCode}</TableCell>
                    <TableCell className="font-medium">{s.companyName}</TableCell>
                    <TableCell>
                      <Badge variant={VENDOR_TIER[s.vendorTier].variant}>{VENDOR_TIER[s.vendorTier].label}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={AVL_STATUS[s.avlStatus].variant}>{AVL_STATUS[s.avlStatus].label}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold tabular-nums">{formatScore(s.currentScore)}</TableCell>
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
