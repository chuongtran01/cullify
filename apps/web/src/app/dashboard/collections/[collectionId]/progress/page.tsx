"use client";

import { notFound, useParams } from "next/navigation";

import { CollectionProgressView } from "@/components/collections/progress/collection-progress-view";
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
      <div className="mx-auto flex w-full max-w-[1200px] items-center justify-center py-20">
        <p className="text-sm font-normal text-muted">
          Loading collection progress...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto w-full max-w-[1200px] py-20">
        <section className="rounded-lg border border-hairline-strong bg-surface-card p-8 text-center">
          <h2 className="text-lg font-semibold text-ink">
            Could not load collection progress
          </h2>
          <p className="mx-auto mt-2 max-w-md text-base font-normal leading-normal text-semantic-error">
            {error instanceof Error
              ? error.message
              : "Failed to load collection progress"}
          </p>
        </section>
      </div>
    );
  }

  return <CollectionProgressView data={data} />;
}
