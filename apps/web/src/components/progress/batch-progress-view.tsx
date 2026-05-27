import { getProgressStats } from "@/components/progress/mock-data";
import { ProcessingSummaryCard } from "@/components/progress/processing-summary-card";
import { ProgressFooter } from "@/components/progress/progress-footer";
import { ProgressHeader } from "@/components/progress/progress-header";
import { ProgressStats } from "@/components/progress/progress-stats";
import { RecentActivityCard } from "@/components/progress/recent-activity-card";
import { TasksCard } from "@/components/progress/tasks-card";
import type { BatchProgressData } from "@/components/progress/types";

export function BatchProgressView({ data }: { data: BatchProgressData }) {
  return (
    <main className="min-h-screen bg-surface-stone text-ink">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
        <ProgressHeader
          title={data.title}
          uploadedAt={data.uploadedAt}
          totalPhotos={data.totalPhotos}
          batchId={data.batchId}
          status={data.status}
        />
        <ProcessingSummaryCard
          progress={data.progress}
          processedPhotos={data.processedPhotos}
          totalPhotos={data.totalPhotos}
          estimatedRemaining={data.estimatedRemaining}
          stages={data.stages}
        />
        <ProgressStats stats={getProgressStats(data)} />
        <section className="grid gap-4 lg:grid-cols-2">
          <RecentActivityCard activity={data.activity} />
          <TasksCard tasks={data.tasks} />
        </section>
        <ProgressFooter />
      </div>
    </main>
  );
}
