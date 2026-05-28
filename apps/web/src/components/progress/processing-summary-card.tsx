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
    <section className="grid gap-5 rounded-[22px] bg-deep-green p-3 text-white lg:grid-cols-[1.4fr_0.9fr]">
      <div className="grid gap-5 rounded-[18px] border border-white/10 bg-surface-dark p-5 sm:grid-cols-[176px_1fr] sm:items-center">
        <ProcessingProgressDonut progress={progress} />

        <div className="min-w-0">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.02em] text-white/60">
            <Sparkles className="size-4" />
            AI processing
          </div>
          <h2 className="mt-3 text-3xl leading-tight font-normal tracking-[-0.02em] text-white">
            Analyzing your photos
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65">
            AI is finding the best photos, filtering low-quality shots, and
            organizing similar images so review is faster when processing
            completes.
          </p>

          <div className="mt-6 space-y-2">
            <Progress
              value={progress}
              className="h-2 bg-white/10 [&_[data-slot=progress-indicator]]:bg-white"
            />
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
              <span className="text-white">
                {processedPhotos} of {totalPhotos} photos processed
              </span>
              <span className="text-white/55">
                About {estimatedRemaining} remaining
              </span>
            </div>
          </div>

          <div className="mt-5 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm">
            <Clock3 className="size-4 text-white/70" />
            <div>
              <div className="font-mono text-xs uppercase tracking-[0.02em] text-white/50">
                Estimated remaining
              </div>
              <div className="text-white">{estimatedRemaining}</div>
            </div>
          </div>
          <p className="mt-4 max-w-xl text-sm leading-6 text-white/55">
            You can leave this page. Processing will continue in the
            background.
          </p>
        </div>
      </div>

      <ProcessingStages stages={stages} />
    </section>
  );
}
