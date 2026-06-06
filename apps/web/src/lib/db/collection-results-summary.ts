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

type CollectionResultsSummaryRow = {
  collectionId: string;
  collectionName: string | null;
  status: CollectionStatus;
  createdAt: Date;
  totalPhotos: number | bigint;
  similarGroups: number | bigint;
  lowQualityImages: number | bigint;
};

export async function getCollectionResultsSummary(
  collectionId: string,
  userId: string,
): Promise<CollectionResultsSummary | null> {
  const rows = await prisma.$queryRaw<CollectionResultsSummaryRow[]>`
    SELECT
      collection.id AS "collectionId",
      collection.name AS "collectionName",
      collection.status AS "status",
      collection.created_at AS "createdAt",
      (
        SELECT COUNT(*)::int
        FROM image
        WHERE image.collection_id = ${collectionId}::uuid
          AND image.status = ${ImageUploadStatus.UPLOADED}::"ImageUploadStatus"
      ) AS "totalPhotos",
      (
        SELECT COUNT(*)::int
        FROM image_group
        WHERE image_group.collection_id = ${collectionId}::uuid
          AND image_group.image_count > 1
      ) AS "similarGroups",
      (
        SELECT COUNT(*)::int
        FROM image
        INNER JOIN image_quality_analysis
          ON image_quality_analysis.image_id = image.id
        WHERE image.collection_id = ${collectionId}::uuid
          AND (
            image_quality_analysis.is_blurry OR
            image_quality_analysis.is_out_of_focus OR
            image_quality_analysis.has_motion_blur OR
            image_quality_analysis.has_eyes_closed OR
            image_quality_analysis.is_low_exposure OR
            image_quality_analysis.is_high_exposure OR
            image_quality_analysis.has_compression_artifacts
          )
      ) AS "lowQualityImages"
    FROM collection
    WHERE collection.id = ${collectionId}::uuid
      AND collection.user_id = ${userId}
    LIMIT 1
  `;

  const summary = rows[0];

  if (!summary) {
    return null;
  }

  return {
    collectionId: summary.collectionId,
    collectionName:
      summary.collectionName ?? formatFallbackCollectionName(summary.createdAt),
    status: summary.status,
    createdAt: summary.createdAt.toISOString(),
    totalPhotos: Number(summary.totalPhotos),
    similarGroups: Number(summary.similarGroups),
    lowQualityImages: Number(summary.lowQualityImages),
  };
}
