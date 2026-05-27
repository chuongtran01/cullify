import { Clock3, Sparkles } from "lucide-react";

import { ProcessingProgressDonut } from "@/components/progress/processing-progress-donut";
import { ProcessingStages } from "@/components/progress/processing-stages";
import type { ProcessingStage } from "@/components/progress/types";
import { Progress } from "@/components/ui/progress";

type ProcessingSummaryCardProps = {
  progress: number;
  processedPhotos: number;
  totalPhotos: number;
  estimatedRemaining: string;
  stages: ProcessingStage[];
};

export function ProcessingSummaryCard({
  progress,
  processedPhotos,
  totalPhotos,
  estimatedRemaining,
  stages,
}: ProcessingSummaryCardProps) {
  return (
    <section className="grid gap-4 rounded-lg bg-surface-card p-4 ring-1 ring-hairline md:p-5 lg:grid-cols-[1.4fr_0.9fr]">
      <div className="grid gap-5 sm:grid-cols-[176px_1fr] sm:items-center">
        <ProcessingProgressDonut progress={progress} />

        <div className="min-w-0">
          <div className="flex items-center gap-2 text-sm font-medium text-primary">
            <Sparkles className="size-4" />
            AI processing
          </div>
          <h2 className="mt-2 text-2xl leading-tight font-medium">
            Analyzing your photos...
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-body">
            AI is finding the best photos, filtering low-quality shots, and
            organizing similar images so review is faster when processing
            completes.
          </p>

          <div className="mt-6 space-y-2">
            <Progress value={progress} className="h-2 bg-hairline-soft" />
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
              <span className="font-medium text-ink">
                {processedPhotos} of {totalPhotos} photos processed
              </span>
              <span className="text-muted">
                About {estimatedRemaining} remaining
              </span>
            </div>
          </div>

          <div className="mt-4 inline-flex items-center gap-3 rounded-lg border border-hairline bg-canvas-soft px-3 py-2 text-sm">
            <Clock3 className="size-4 text-primary" />
            <div>
              <div className="font-medium">Estimated remaining time</div>
              <div className="text-muted">{estimatedRemaining}</div>
            </div>
          </div>
        </div>
      </div>

      <ProcessingStages stages={stages} />
    </section>
  );
}
