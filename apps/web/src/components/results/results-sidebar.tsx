import { CheckCircle2, Info, Lightbulb } from "lucide-react";

import type {
  ReviewProgressItem,
  ReviewResultsData,
} from "@/components/results/mock-data";
import { Progress } from "@/components/ui/progress";

function ProgressRing({ percent }: { percent: number }) {
  const value = Math.min(Math.max(percent, 0), 100);
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div
      className="relative grid size-32 shrink-0 place-items-center"
      role="img"
      aria-label={`${value}% review complete`}
    >
      <svg aria-hidden className="absolute inset-0 size-32 -rotate-90" viewBox="0 0 128 128">
        <circle
          cx="64"
          cy="64"
          r={radius}
          fill="none"
          stroke="rgba(33,33,33,0.10)"
          strokeWidth="10"
        />
        <circle
          cx="64"
          cy="64"
          r={radius}
          fill="none"
          stroke="#003c33"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          strokeWidth="10"
        />
      </svg>
      <div className="text-center">
        <div className="text-3xl leading-none font-normal text-ink">{value}%</div>
        <div className="mt-1 text-xs text-muted">complete</div>
      </div>
    </div>
  );
}

function ProgressRow({ item }: { item: ReviewProgressItem }) {
  const value = item.total > 0 ? Math.round((item.completed / item.total) * 100) : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="text-ink">{item.label}</span>
        <span className="text-muted">
          {item.completed}/{item.total}
        </span>
      </div>
      <Progress value={value} className="h-1.5 bg-hairline" />
    </div>
  );
}

export function ResultsSidebar({
  progress,
}: {
  progress: ReviewResultsData["progress"];
}) {
  return (
    <aside className="grid gap-5 lg:sticky lg:top-20">
      <section className="rounded-[22px] border border-hairline bg-canvas p-5">
        <div className="flex items-center gap-4">
          <ProgressRing percent={progress.percent} />
          <div>
            <p className="font-mono text-xs uppercase text-muted">Review progress</p>
            <h2 className="mt-2 text-2xl leading-tight font-normal text-ink">
              {progress.percent}% reviewed
            </h2>
            <p className="mt-2 text-sm leading-6 text-body">
              Work through each review lane and export your final selections when ready.
            </p>
          </div>
        </div>
        <div className="mt-6 space-y-4">
          {progress.items.map((item) => (
            <ProgressRow item={item} key={item.label} />
          ))}
        </div>
      </section>

      <section className="rounded-[16px] border border-hairline bg-canvas p-5">
        <div className="flex items-start gap-3">
          <Lightbulb className="mt-0.5 size-5 text-coral" />
          <div>
            <h2 className="text-lg font-normal text-ink">Suggested workflow</h2>
            <p className="mt-2 text-sm leading-6 text-body">
              Start with AI Picks to confirm the strongest photos, then move into Similar
              Groups before checking rejected images.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-[16px] border border-hairline bg-canvas p-5">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 size-5 text-action-blue" />
          <div>
            <h2 className="text-lg font-normal text-ink">Progress is saved</h2>
            <p className="mt-2 text-sm leading-6 text-body">
              You can leave this dashboard and return later. Review progress is saved
              automatically.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-[16px] border border-hairline bg-surface-blue-wash p-5">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 size-5 text-deep-green" />
          <div>
            <h2 className="text-lg font-normal text-ink">Ready when you are</h2>
            <p className="mt-2 text-sm leading-6 text-body">
              Export Picks creates a clean selection set from reviewed AI choices.
            </p>
          </div>
        </div>
      </section>
    </aside>
  );
}
