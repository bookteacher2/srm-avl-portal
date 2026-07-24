"use client";

import { Building2, Globe, Users2, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/page-header";
import { DataState } from "@/components/shared/data-state";
import { useAuth } from "@/providers/auth-provider";
import { useAsync } from "@/hooks/use-async";
import { configService, supplierService } from "@/lib/services";
import { formatCurrency } from "@/lib/utils";

export default function ProfilePage() {
  const { user } = useAuth();
  const supplierId = user?.supplierId ?? "";
  const { data, loading, error } = useAsync(async () => {
    const supplier = await supplierService.getById(supplierId);
    if (!supplier) return null;
    const [categories, areas] = await Promise.all([
      configService.categories(supplier.supplierTypeId),
      configService.serviceAreas(),
    ]);
    return { supplier, categories, areas };
  }, [supplierId]);

  return (
    <div className="space-y-6">
      <PageHeader title="Company Profile" description="Your organisation details on record." />
      <DataState loading={loading} error={error}>
        {data ? (
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>{data.supplier.companyName}</CardTitle>
                <p className="text-sm text-muted-foreground">{data.supplier.vendorCode} · Est. {data.supplier.yearEstablished}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{data.supplier.businessDescription}</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Info icon={Building2} k="Tax ID" v={data.supplier.taxId} />
                  <Info icon={Globe} k="Website" v={data.supplier.website ?? "—"} />
                  <Info icon={Wallet} k="Registered Capital" v={data.supplier.registeredCapital ? formatCurrency(data.supplier.registeredCapital) : "—"} />
                  <Info icon={Users2} k="Employees" v={String(data.supplier.employeeCount ?? "—")} />
                </div>
                <div>
                  <p className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">Registered Address</p>
                  {data.supplier.addresses.map((a) => (
                    <p key={a.id} className="text-sm">
                      {a.line1}, {a.district}, {a.province} {a.postalCode}, {a.country}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader><CardTitle className="text-base">Business Categories</CardTitle></CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {data.categories
                    .filter((c) => data.supplier.categoryIds.includes(c.id))
                    .map((c) => <Badge key={c.id} variant="secondary">{c.label}</Badge>)}
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-base">Service Areas</CardTitle></CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {data.areas
                    .filter((a) => data.supplier.serviceAreaIds.includes(a.id))
                    .map((a) => <Badge key={a.id} variant="muted">{a.label}</Badge>)}
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-base">Contacts</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {data.supplier.contacts.map((c) => (
                    <div key={c.id} className="text-sm">
                      <p className="font-medium">{c.name} <Badge variant="muted" className="ml-1">{c.type}</Badge></p>
                      <p className="text-xs text-muted-foreground">{c.position} · {c.email} · {c.phone}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        ) : null}
      </DataState>
    </div>
  );
}

function Info({ icon: Icon, k, v }: { icon: typeof Building2; k: string; v: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{k}</p>
        <p className="text-sm font-medium">{v}</p>
      </div>
    </div>
  );
}
