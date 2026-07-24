import { Hexagon } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className, showText = true }: { className?: string; showText?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Hexagon className="h-5 w-5" fill="currentColor" />
      </div>
      {showText ? (
        <div className="leading-tight">
          <p className="text-sm font-semibold tracking-tight">EPC Supplier Portal</p>
          <p className="text-[11px] text-muted-foreground">SRM &amp; Approved Vendor List</p>
        </div>
      ) : null}
    </div>
  );
}
