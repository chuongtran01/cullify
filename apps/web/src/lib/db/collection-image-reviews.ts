import "server-only";

import { prisma } from "@/lib/prisma";

export type CollectionImageReviewState = {
  imageId: string;
  isSelected: boolean;
  decisionSource: string;
  decisionReason: string;
  reviewedAt: string;
};

type ImageReviewCandidateRow = {
  imageId: string;
  decisionReason: string | null;
  isLowQuality: boolean;
};

type ImageReviewRow = {
  imageId: string;
  isSelected: boolean;
  decisionSource: string;
  decisionReason: string;
  reviewedAt: Date;
};

export async function updateCollectionImageReview(
  collectionId: string,
  imageId: string,
  userId: string,
  isSelected: boolean,
): Promise<CollectionImageReviewState | null> {
  const candidateRows = await prisma.$queryRaw<ImageReviewCandidateRow[]>`
    SELECT
      image.id::text AS "imageId",
      collection_image_review.decision_reason::text AS "decisionReason",
      COALESCE(
        image_quality_analysis.is_blurry OR
        image_quality_analysis.is_out_of_focus OR
        image_quality_analysis.has_motion_blur OR
        image_quality_analysis.has_eyes_closed OR
        image_quality_analysis.is_low_exposure OR
        image_quality_analysis.is_high_exposure OR
        image_quality_analysis.has_compression_artifacts,
        false
      ) AS "isLowQuality"
    FROM image
    INNER JOIN "collection"
      ON "collection".id = image.collection_id
    LEFT JOIN image_quality_analysis
      ON image_quality_analysis.image_id = image.id
    LEFT JOIN collection_image_review
      ON collection_image_review.image_id = image.id
    WHERE image.id = ${imageId}::uuid
      AND image.collection_id = ${collectionId}::uuid
      AND "collection".user_id = ${userId}
    LIMIT 1
  `;
  const candidate = candidateRows[0];

  if (!candidate || !candidate.isLowQuality) {
    return null;
  }

  const decisionReason = candidate.decisionReason ?? "LOW_QUALITY";
  const reviewRows = await prisma.$queryRaw<ImageReviewRow[]>`
    INSERT INTO collection_image_review (
      id,
      collection_id,
      image_id,
      is_selected,
      decision_source,
      decision_reason,
      reviewed_at,
      created_at,
      updated_at
    )
    VALUES (
      gen_random_uuid(),
      ${collectionId}::uuid,
      ${imageId}::uuid,
      ${isSelected},
      'USER'::"ReviewDecisionSource",
      ${decisionReason}::"ReviewDecisionReason",
      CURRENT_TIMESTAMP,
      CURRENT_TIMESTAMP,
      CURRENT_TIMESTAMP
    )
    ON CONFLICT (image_id)
    DO UPDATE SET
      is_selected = EXCLUDED.is_selected,
      decision_source = 'USER'::"ReviewDecisionSource",
      reviewed_at = CURRENT_TIMESTAMP,
      updated_at = CURRENT_TIMESTAMP
    RETURNING
      image_id::text AS "imageId",
      is_selected AS "isSelected",
      decision_source::text AS "decisionSource",
      decision_reason::text AS "decisionReason",
      reviewed_at AS "reviewedAt"
  `;
  const review = reviewRows[0];

  if (!review) {
    return null;
  }

  return {
    imageId: review.imageId,
    isSelected: review.isSelected,
    decisionSource: review.decisionSource,
    decisionReason: review.decisionReason,
    reviewedAt: review.reviewedAt.toISOString(),
  };
}
