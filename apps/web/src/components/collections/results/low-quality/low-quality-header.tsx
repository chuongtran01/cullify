import { AlertTriangle } from "lucide-react";

import { Badge } from "@/components/ui/badge";

type LowQualityHeaderProps = {
  isPending: boolean;
  total: number;
};

export function LowQualityHeader({ isPending, total }: LowQualityHeaderProps) {
  return (
    <header className="flex flex-col gap-4 rounded-lg border border-hairline-strong bg-surface-card p-5 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted">
          <AlertTriangle className="size-4" aria-hidden="true" />
          Low quality review
        </div>
        <h1 className="mt-3 text-3xl font-semibold leading-tight text-ink">
          Low Quality Photos
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-body">
          Review photos flagged for blur, focus issues, closed eyes, poor lighting,
          or compression artifacts.
        </p>
      </div>
      <Badge variant="outline" className="h-8 rounded-full px-3 text-sm text-body">
        {isPending ? "Loading..." : `${total} photos`}
      </Badge>
    </header>
  );
}
