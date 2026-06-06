"use client";

import { notFound, useParams } from "next/navigation";

import { CollectionProgressView } from "@/components/progress/collection-progress-view";
import { useCollectionProgress } from "@/features/collections/hooks";
import { CollectionsServiceError, isUuid } from "@/services/collections";

export default function DashboardCollectionProgressPage() {
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
      <div className="flex w-full items-center justify-center py-20">
        <p className="text-muted">Loading collection progress...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex w-full items-center justify-center py-20">
        <p className="text-destructive">
          {error instanceof Error
            ? error.message
            : "Failed to load collection progress"}
        </p>
      </div>
    );
  }

  return <CollectionProgressView data={data} />;
}
