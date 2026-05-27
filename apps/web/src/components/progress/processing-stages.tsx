import { Check, Clock3, LoaderCircle, ScanSearch } from "lucide-react";

import type {
  ProcessingStage,
  ProcessingStageStatus,
} from "@/components/progress/types";

function StageIcon({ status }: { status: ProcessingStageStatus }) {
  if (status === "completed") {
    return (
      <span className="flex size-6 items-center justify-center rounded-full bg-semantic-success text-white">
        <Check className="size-3.5" />
      </span>
    );
  }

  if (status === "in progress") {
    return (
      <span className="flex size-6 items-center justify-center rounded-full bg-primary text-white">
        <LoaderCircle className="size-3.5 animate-spin" />
      </span>
    );
  }

  return (
    <span className="flex size-6 items-center justify-center rounded-full border border-hairline-strong bg-canvas-soft">
      <Clock3 className="size-3.5 text-muted" />
    </span>
  );
}

export function ProcessingStages({ stages }: { stages: ProcessingStage[] }) {
  return (
    <aside className="border-t border-hairline pt-4 lg:border-t-0 lg:border-l lg:pl-5">
      <div className="flex items-center gap-2">
        <ScanSearch className="size-4 text-primary" />
        <h3 className="text-base font-medium">Processing Stages</h3>
      </div>
      <div className="mt-4 space-y-4">
        {stages.map((stage) => (
          <div key={stage.label} className="flex gap-3">
            <StageIcon status={stage.status} />
            <div className="min-w-0">
              <div className="text-sm font-medium leading-5">{stage.label}</div>
              <div className="mt-0.5 text-xs uppercase tracking-wide text-muted">
                {stage.status}
              </div>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
