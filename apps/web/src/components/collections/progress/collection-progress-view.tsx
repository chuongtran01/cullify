import { getProgressStats } from "@/components/collections/progress/mock-data";
import { ProcessingSummaryCard } from "@/components/collections/progress/processing-summary-card";
import { ProgressHeader } from "@/components/collections/progress/progress-header";
import { ProgressStats } from "@/components/collections/progress/progress-stats";
import { RecentActivityCard } from "@/components/collections/progress/recent-activity-card";
import { TasksCard } from "@/components/collections/progress/tasks-card";
import type { CollectionProgressData } from "@/components/collections/progress/types";

export function CollectionProgressView({ data }: { data: CollectionProgressData }) {
  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8">
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
