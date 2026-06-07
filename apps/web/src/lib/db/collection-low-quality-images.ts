import "server-only";

import { Prisma } from "@/generated/prisma/client";

import { prisma } from "@/lib/prisma";
import { createPresignedDownloadUrl } from "@/lib/r2/presign";

export const DEFAULT_LOW_QUALITY_LIMIT = 50;
export const MAX_LOW_QUALITY_LIMIT = 100;

export type CollectionLowQualityImage = {
  id: string;
  fileName: string;
  objectKey: string;
  mimeType: string;
  imageUrl: string;
  isSelected: boolean;
  decisionSource: string | null;
  decisionReason: string | null;
  reviewedAt: string | null;
  reasons: string[];
  createdAt: string;
};

export type CollectionLowQualityImagesResponse = {
  images: CollectionLowQualityImage[];
  totalLowQualityImages: number;
  limit: number;
  offset: number;
  hasMore: boolean;
};

type LowQualityImageRow = {
  id: string;
  fileName: string;
  objectKey: string;
  mimeType: string;
  createdAt: Date;
  isBlurry: boolean;
  isOutOfFocus: boolean;
  hasMotionBlur: boolean;
  hasEyesClosed: boolean;
  isLowExposure: boolean;
  isHighExposure: boolean;
  hasCompressionArtifacts: boolean;
  isSelected: boolean | null;
  decisionSource: string | null;
  decisionReason: string | null;
  reviewedAt: Date | null;
  reasonCount: number;
  totalCount: number;
};

export async function getCollectionLowQualityImages(
  collectionId: string,
  userId: string,
  {
    limit = DEFAULT_LOW_QUALITY_LIMIT,
    offset = 0,
    isSelected,
  }: {
    limit?: number;
    offset?: number;
    isSelected?: boolean;
  } = {},
): Promise<CollectionLowQualityImagesResponse | null> {
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

  const isSelectedCondition =
    isSelected === undefined
      ? Prisma.empty
      : Prisma.sql`AND COALESCE(collection_image_review.is_selected, false) = ${isSelected}`;

  const rows = await prisma.$queryRaw<LowQualityImageRow[]>`
    SELECT
      image.id::text,
      image.file_name AS "fileName",
      image.object_key AS "objectKey",
      image.mime_type AS "mimeType",
      image.created_at AS "createdAt",
      image_quality_analysis.is_blurry AS "isBlurry",
      image_quality_analysis.is_out_of_focus AS "isOutOfFocus",
      image_quality_analysis.has_motion_blur AS "hasMotionBlur",
      image_quality_analysis.has_eyes_closed AS "hasEyesClosed",
      image_quality_analysis.is_low_exposure AS "isLowExposure",
      image_quality_analysis.is_high_exposure AS "isHighExposure",
      image_quality_analysis.has_compression_artifacts AS "hasCompressionArtifacts",
      collection_image_review.is_selected AS "isSelected",
      collection_image_review.decision_source::text AS "decisionSource",
      collection_image_review.decision_reason::text AS "decisionReason",
      collection_image_review.reviewed_at AS "reviewedAt",
      (
        image_quality_analysis.is_blurry::int +
        image_quality_analysis.is_out_of_focus::int +
        image_quality_analysis.has_motion_blur::int +
        image_quality_analysis.has_eyes_closed::int +
        image_quality_analysis.is_low_exposure::int +
        image_quality_analysis.is_high_exposure::int +
        image_quality_analysis.has_compression_artifacts::int
      ) AS "reasonCount",
      COUNT(*) OVER()::int AS "totalCount"
    FROM image
    INNER JOIN image_quality_analysis
      ON image_quality_analysis.image_id = image.id
    LEFT JOIN collection_image_review
      ON collection_image_review.image_id = image.id
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
      ${isSelectedCondition}
    ORDER BY "reasonCount" DESC, image.created_at ASC
    LIMIT ${limit}
    OFFSET ${offset}
  `;

  const images = await Promise.all(
    rows.map(async (image) => ({
      id: image.id,
      fileName: image.fileName,
      objectKey: image.objectKey,
      mimeType: image.mimeType,
      imageUrl: await createPresignedDownloadUrl(image.objectKey),
      isSelected: image.isSelected ?? false,
      decisionSource: image.decisionSource,
      decisionReason: image.decisionReason,
      reviewedAt: image.reviewedAt?.toISOString() ?? null,
      reasons: getLowQualityReasons(image),
      createdAt: image.createdAt.toISOString(),
    })),
  );

  const totalLowQualityImages = rows[0]?.totalCount ?? 0;

  return {
    images,
    totalLowQualityImages,
    limit,
    offset,
    hasMore: offset + images.length < totalLowQualityImages,
  };
}

function getLowQualityReasons(image: LowQualityImageRow): string[] {
  const reasons: string[] = [];

  if (image.isBlurry) {
    reasons.push("Blurry");
  }

  if (image.isOutOfFocus) {
    reasons.push("Out of Focus");
  }

  if (image.hasMotionBlur) {
    reasons.push("Motion Blur");
  }

  if (image.hasEyesClosed) {
    reasons.push("Closed Eyes");
  }

  if (image.isLowExposure) {
    reasons.push("Low Exposure");
  }

  if (image.isHighExposure) {
    reasons.push("High Exposure");
  }

  if (image.hasCompressionArtifacts) {
    reasons.push("Compression Artifacts");
  }

  return reasons;
}
