"use client";

import { notFound, useParams } from "next/navigation";

import { BatchProgressView } from "@/components/progress/batch-progress-view";
import { useBatchProgress } from "@/hooks/use-batch-progress";
import { isUuid } from "@/lib/upload/validate";
import { ProgressServiceError } from "@/services/progress";

export default function ProgressPage() {
  const { batchId } = useParams<{ batchId: string }>();

  if (!batchId || !isUuid(batchId)) {
    notFound();
  }

  const { data, error, isPending } = useBatchProgress(batchId);

  if (error instanceof ProgressServiceError && error.status === 404) {
    notFound();
  }

  if (isPending || !data) {
    return (
      <main className="min-h-screen bg-surface-stone text-ink">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-center px-4 py-20 sm:px-6 lg:px-8">
          <p className="text-muted">Loading batch progress...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-surface-stone text-ink">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-center px-4 py-20 sm:px-6 lg:px-8">
          <p className="text-destructive">
            {error instanceof Error
              ? error.message
              : "Failed to load batch progress"}
          </p>
        </div>
      </main>
    );
  }

  return <BatchProgressView data={data} />;
}
