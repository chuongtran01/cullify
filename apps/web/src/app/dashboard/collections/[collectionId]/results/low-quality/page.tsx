import { Suspense } from "react";
import { notFound } from "next/navigation";

import { LowQualityGridSkeleton } from "@/components/collections/results/low-quality/low-quality-grid-skeleton";
import { LowQualityPage } from "@/components/collections/results/low-quality/low-quality-page";
import { isUuid } from "@/services/collections";

type LowQualityImagesPageProps = {
  params: Promise<{ collectionId: string }>;
};

export default async function LowQualityImagesPage({
  params,
}: LowQualityImagesPageProps) {
  const { collectionId } = await params;

  if (!isUuid(collectionId)) {
    notFound();
  }

  return (
    <Suspense fallback={<LowQualityGridSkeleton />}>
      <LowQualityPage collectionId={collectionId} />
    </Suspense>
  );
}
