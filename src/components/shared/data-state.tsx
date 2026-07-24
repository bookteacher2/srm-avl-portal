import { AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface DataStateProps {
  loading: boolean;
  error: Error | null;
  children: React.ReactNode;
  skeleton?: React.ReactNode;
}

/**
 * Wraps any data-driven region with consistent loading/error handling so
 * pages don't repeat the pattern. Use with the `useAsync` hook.
 */
export function DataState({ loading, error, children, skeleton }: DataStateProps) {
  if (loading) {
    return (
      <>{skeleton ?? (
        <div className="space-y-3">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      )}</>
    );
  }
  if (error) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
        <AlertTriangle className="h-5 w-5" />
        <span>Something went wrong loading this data. Please try again.</span>
      </div>
    );
  }
  return <>{children}</>;
}
