import "server-only";

import {
  getCollectionLowQualityImages,
  type CollectionLowQualityImagesResponse,
} from "@/lib/db/collection-low-quality-images";
import {
  getCollectionGroupPreviews,
  type CollectionGroupPreviewsResponse,
} from "@/lib/db/collection-groups";
import {
  getCollectionResultsSummary,
  type CollectionResultsSummary,
} from "@/lib/db/collection-results-summary";

const OVERALL_GROUP_LIMIT = 5;
const OVERALL_LOW_QUALITY_LIMIT = 5;

export type CollectionResultsOverall = {
  summary: CollectionResultsSummary;
  similarGroups: CollectionGroupPreviewsResponse;
  lowQuality: CollectionLowQualityImagesResponse;
};

export async function getCollectionResultsOverall(
  collectionId: string,
  userId: string,
): Promise<CollectionResultsOverall | null> {
  const [summary, similarGroups, lowQuality] = await Promise.all([
    getCollectionResultsSummary(collectionId, userId),
    getCollectionGroupPreviews(collectionId, userId, {
      limit: OVERALL_GROUP_LIMIT,
    }),
    getCollectionLowQualityImages(collectionId, userId, {
      limit: OVERALL_LOW_QUALITY_LIMIT,
      isSelected: false,
    }),
  ]);

  if (!summary || !similarGroups || !lowQuality) {
    return null;
  }

  return {
    summary,
    similarGroups,
    lowQuality,
  };
}
