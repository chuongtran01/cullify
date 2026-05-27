import { Check, Clock3, LoaderCircle, ScanSearch } from "lucide-react";

import type {
  ProcessingStage,
  ProcessingStageStatus,
} from "@/components/progress/types";

function StageIcon({ status }: { status: ProcessingStageStatus }) {
  if (status === "completed") {
    return (
      <span className="flex size-6 items-center justify-center rounded-full bg-surface-green-wash text-deep-green">
        <Check className="size-3.5" />
      </span>
    );
  }

  if (status === "in progress") {
    return (
      <span className="flex size-6 items-center justify-center rounded-full bg-white text-primary">
        <LoaderCircle className="size-3.5 animate-spin" />
      </span>
    );
  }

  return (
    <span className="flex size-6 items-center justify-center rounded-full border border-white/15 bg-white/5">
      <Clock3 className="size-3.5 text-white/45" />
    </span>
  );
}

export function ProcessingStages({ stages }: { stages: ProcessingStage[] }) {
  return (
    <aside className="rounded-[18px] border border-white/10 bg-black/20 p-5">
      <div className="flex items-center gap-2">
        <ScanSearch className="size-4 text-white/70" />
        <h3 className="font-mono text-xs uppercase tracking-[0.02em] text-white/60">
          Processing stages
        </h3>
      </div>
      <div className="mt-5 grid border-y border-white/10">
        {stages.map((stage) => (
          <div
            key={stage.label}
            className="flex gap-3 border-b border-white/10 py-4 last:border-b-0"
          >
            <StageIcon status={stage.status} />
            <div className="min-w-0">
              <div className="text-sm leading-5 text-white">{stage.label}</div>
              <div className="mt-1 font-mono text-xs uppercase tracking-[0.02em] text-white/45">
                {stage.status}
              </div>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
