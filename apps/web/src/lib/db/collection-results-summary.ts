import "server-only";

import { ImageUploadStatus } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export type CollectionResultsSummary = {
  totalPhotos: number;
  similarGroups: number;
  lowQualityImages: number;
};

type CollectionResultsSummaryRow = {
  totalPhotos: number | bigint;
  similarGroups: number | bigint;
  lowQualityImages: number | bigint;
};

export async function getCollectionResultsSummary(
  collectionId: string,
  userId: string,
): Promise<CollectionResultsSummary | null> {
  const collectionRows = await prisma.$queryRaw<{ id: string }[]>`
    SELECT id
    FROM "collection"
    WHERE id = ${collectionId}::uuid
      AND user_id = ${userId}
    LIMIT 1
  `;

  if (collectionRows.length === 0) {
    return null;
  }

  const rows = await prisma.$queryRaw<CollectionResultsSummaryRow[]>`
    SELECT
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
  `;

  const summary = rows[0];

  if (!summary) {
    return {
      totalPhotos: 0,
      similarGroups: 0,
      lowQualityImages: 0,
    };
  }

  return {
    totalPhotos: Number(summary.totalPhotos),
    similarGroups: Number(summary.similarGroups),
    lowQualityImages: Number(summary.lowQualityImages),
  };
}
