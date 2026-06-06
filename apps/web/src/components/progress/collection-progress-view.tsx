import { getProgressStats } from "@/components/progress/mock-data";
import { ProcessingSummaryCard } from "@/components/progress/processing-summary-card";
import { ProgressHeader } from "@/components/progress/progress-header";
import { ProgressStats } from "@/components/progress/progress-stats";
import { RecentActivityCard } from "@/components/progress/recent-activity-card";
import { TasksCard } from "@/components/progress/tasks-card";
import type { CollectionProgressData } from "@/components/progress/types";

export function CollectionProgressView({ data }: { data: CollectionProgressData }) {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-5">
      <ProgressHeader
        title={data.title}
        uploadedAt={data.uploadedAt}
        collectionId={data.collectionId}
        status={data.status}
        progress={data.progress}
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
    </div>
  );
}
