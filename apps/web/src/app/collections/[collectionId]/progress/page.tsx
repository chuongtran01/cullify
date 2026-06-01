"use client";

import { notFound, useParams } from "next/navigation";

import { CollectionProgressView } from "@/components/progress/collection-progress-view";
import { useCollectionProgress } from "@/features/collections/hooks";
import { CollectionsServiceError, isUuid } from "@/services/collections";

export default function ProgressPage() {
  const { collectionId } = useParams<{ collectionId: string }>();

  if (!collectionId || !isUuid(collectionId)) {
    notFound();
  }

  const { data, error, isPending } = useCollectionProgress(collectionId);

  if (error instanceof CollectionsServiceError && error.status === 404) {
    notFound();
  }

  if (isPending || !data) {
    return (
      <main className="min-h-screen bg-surface-stone text-ink">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-center px-4 py-20 sm:px-6 lg:px-8">
          <p className="text-muted">Loading collection progress...</p>
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
              : "Failed to load collection progress"}
          </p>
        </div>
      </main>
    );
  }

  return <CollectionProgressView data={data} />;
}
