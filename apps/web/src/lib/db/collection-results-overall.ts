import "server-only";

import {
  getCollectionLowQualityImages,
  type CollectionLowQualityImagesResponse,
} from "@/lib/db/collection-low-quality-images";
import {
  getCollectionResultsSummary,
  type CollectionResultsSummary,
} from "@/lib/db/collection-results-summary";

const OVERALL_LOW_QUALITY_LIMIT = 5;

export type CollectionResultsOverall = {
  summary: CollectionResultsSummary;
  lowQuality: CollectionLowQualityImagesResponse;
};

export async function getCollectionResultsOverall(
  collectionId: string,
  userId: string,
): Promise<CollectionResultsOverall | null> {
  const [summary, lowQuality] = await Promise.all([
    getCollectionResultsSummary(collectionId, userId),
    getCollectionLowQualityImages(collectionId, userId, {
      limit: OVERALL_LOW_QUALITY_LIMIT,
      isSelected: false,
    }),
  ]);

  if (!summary || !lowQuality) {
    return null;
  }

  return {
    summary,
    lowQuality,
  };
}
