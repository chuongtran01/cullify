import { Sparkles } from "lucide-react";

import { ProcessingProgressDonut } from "@/components/collections/progress/processing-progress-donut";
import { ProcessingStages } from "@/components/collections/progress/processing-stages";
import type { ProcessingStage } from "@/components/collections/progress/types";
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
    <section className="grid gap-5 rounded-lg bg-surface-dark p-3 text-on-dark lg:grid-cols-[1.4fr_0.9fr]">
      <div className="grid gap-5 rounded-lg border border-white/10 bg-surface-dark-elevated p-5 sm:grid-cols-[176px_1fr] sm:items-center">
        <ProcessingProgressDonut progress={progress} />

        <div className="min-w-0">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wide text-on-dark-soft">
            <Sparkles className="size-4" />
            AI processing
          </div>
          <h2 className="mt-3 text-3xl font-semibold leading-snug tracking-tight text-on-dark">
            Analyzing your photos
          </h2>
          <p className="mt-3 max-w-2xl text-sm font-normal leading-normal text-on-dark-soft">
            AI is finding the best photos, filtering low-quality shots, and
            organizing similar images so review is faster when processing
            completes.
          </p>

          <div className="mt-6 space-y-2">
            <Progress
              value={progress}
              className="h-2 bg-white/10 [&_[data-slot=progress-indicator]]:bg-on-dark"
            />
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
              <span className="text-on-dark">
                {processedPhotos} of {totalPhotos} photos processed
              </span>
              <span className="text-on-dark-soft">
                About {estimatedRemaining} remaining
              </span>
            </div>
          </div>

          <p className="mt-4 max-w-xl text-sm font-normal leading-normal text-on-dark-soft">
            You can leave this page. Processing will continue in the
            background.
          </p>
        </div>
      </div>

      <ProcessingStages stages={stages} />
    </section>
  );
}
