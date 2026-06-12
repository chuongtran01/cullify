import { Suspense } from "react";
import { notFound } from "next/navigation";

import { SelectedPageSkeleton } from "@/components/collections/results/selected/selected-grid-skeleton";
import { SelectedPage } from "@/components/collections/results/selected/selected-page";
import { isUuid } from "@/services/collections";

type SelectedImagesPageProps = {
  params: Promise<{ collectionId: string }>;
};

export default async function SelectedImagesPage({
  params,
}: SelectedImagesPageProps) {
  const { collectionId } = await params;

  if (!isUuid(collectionId)) {
    notFound();
  }

  return (
    <Suspense fallback={<SelectedPageSkeleton />}>
      <SelectedPage collectionId={collectionId} />
    </Suspense>
  );
}
