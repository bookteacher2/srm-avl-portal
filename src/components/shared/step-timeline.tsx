import { Check, Circle, Clock, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";

export interface TimelineStep {
  label: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "REJECTED";
  date?: string | null;
  note?: string | null;
}

const config = {
  COMPLETED: { icon: Check, ring: "bg-success text-success-foreground", line: "bg-success" },
  IN_PROGRESS: { icon: Clock, ring: "bg-primary text-primary-foreground", line: "bg-border" },
  REJECTED: { icon: X, ring: "bg-destructive text-destructive-foreground", line: "bg-border" },
  PENDING: { icon: Circle, ring: "bg-muted text-muted-foreground", line: "bg-border" },
} as const;

export function StepTimeline({ steps }: { steps: TimelineStep[] }) {
  return (
    <ol className="relative">
      {steps.map((step, i) => {
        const c = config[step.status];
        const Icon = c.icon;
        const isLast = i === steps.length - 1;
        return (
          <li key={step.label} className="flex gap-4 pb-6 last:pb-0">
            <div className="flex flex-col items-center">
              <div className={cn("flex h-8 w-8 items-center justify-center rounded-full", c.ring)}>
                <Icon className="h-4 w-4" strokeWidth={2.5} />
              </div>
              {!isLast ? <div className={cn("mt-1 w-px flex-1", c.line)} /> : null}
            </div>
            <div className="pb-1 pt-1">
              <p className="text-sm font-medium leading-tight">{step.label}</p>
              <p className="text-xs text-muted-foreground">
                {step.status === "PENDING" ? "Pending" : formatDate(step.date)}
              </p>
              {step.note ? (
                <p className="mt-1 text-xs text-muted-foreground">{step.note}</p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
