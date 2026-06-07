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
  getCollectionResultsBaseSummary,
} from "@/lib/db/collection-results-summary";

const OVERALL_GROUP_LIMIT = 5;
const OVERALL_LOW_QUALITY_LIMIT = 5;

export type CollectionResultsSummary = {
  collectionId: string;
  collectionName: string;
  status: string;
  createdAt: string;
  totalPhotos: number;
  similarGroups: number;
  lowQualityImages: number;
};

export type CollectionResultsOverall = {
  summary: CollectionResultsSummary;
  similarGroups: CollectionGroupPreviewsResponse;
  lowQuality: CollectionLowQualityImagesResponse;
};

export async function getCollectionResultsOverall(
  collectionId: string,
  userId: string,
): Promise<CollectionResultsOverall | null> {
  const [baseSummary, similarGroups, lowQuality] = await Promise.all([
    getCollectionResultsBaseSummary(collectionId, userId),
    getCollectionGroupPreviews(collectionId, userId, {
      limit: OVERALL_GROUP_LIMIT,
    }),
    getCollectionLowQualityImages(collectionId, userId, {
      limit: OVERALL_LOW_QUALITY_LIMIT,
      isSelected: false,
    }),
  ]);

  if (!baseSummary || !similarGroups || !lowQuality) {
    return null;
  }

  return {
    summary: {
      ...baseSummary,
      similarGroups: similarGroups.totalSimilarGroups,
      lowQualityImages: lowQuality.totalLowQualityImages,
    },
    similarGroups,
    lowQuality,
  };
}
