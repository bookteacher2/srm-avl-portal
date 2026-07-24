import { AppShell } from "@/components/layout/app-shell";

export default function SupplierLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell area="supplier" title="Supplier Portal">
      {children}
    </AppShell>
  );
}
