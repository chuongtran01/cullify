import "server-only";

import { ImageUploadStatus } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { formatFallbackCollectionName } from "@/lib/db/collections";
import type { CollectionStatus } from "@/components/collections/types";

export type CollectionResultsSummary = {
  collectionId: string;
  collectionName: string;
  status: CollectionStatus;
  createdAt: string;
  totalPhotos: number;
  similarGroups: number;
  lowQualityImages: number;
};

const lowQualityAnalysisWhere = {
  OR: [
    { isBlurry: true },
    { isOutOfFocus: true },
    { hasMotionBlur: true },
    { hasEyesClosed: true },
    { isLowExposure: true },
    { isHighExposure: true },
    { hasCompressionArtifacts: true },
  ],
};

export async function getCollectionResultsSummary(
  collectionId: string,
  userId: string,
): Promise<CollectionResultsSummary | null> {
  const collection = await prisma.collection.findFirst({
    where: { id: collectionId, userId },
    select: {
      id: true,
      name: true,
      status: true,
      createdAt: true,
    },
  });

  if (!collection) {
    return null;
  }

  const [totalPhotos, similarGroups, lowQualityImages] = await Promise.all([
    prisma.image.count({
      where: {
        collectionId,
        status: ImageUploadStatus.UPLOADED,
      },
    }),
    prisma.imageGroup.count({
      where: {
        collectionId,
        imageCount: { gt: 1 },
      },
    }),
    prisma.image.count({
      where: {
        collectionId,
        qualityAnalysis: {
          is: lowQualityAnalysisWhere,
        },
      },
    }),
  ]);

  return {
    collectionId: collection.id,
    collectionName:
      collection.name ?? formatFallbackCollectionName(collection.createdAt),
    status: collection.status,
    createdAt: collection.createdAt.toISOString(),
    totalPhotos,
    similarGroups,
    lowQualityImages,
  };
}
