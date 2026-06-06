import { notFound } from "next/navigation";

import { LowQualityPage } from "@/components/results/low-quality/low-quality-page";
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

  return <LowQualityPage collectionId={collectionId} />;
}
