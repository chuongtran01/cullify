import "server-only";

import {
  ReviewDecisionReason,
  ReviewDecisionSource,
} from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export type CollectionImageReviewState = {
  imageId: string;
  isSelected: boolean;
  decisionSource: string;
  decisionReason: string;
  reviewedAt: string;
};

export async function updateCollectionImageReview(
  collectionId: string,
  imageId: string,
  userId: string,
  isSelected: boolean,
): Promise<CollectionImageReviewState | null> {
  const candidate = await prisma.image.findFirst({
    where: {
      id: imageId,
      collectionId,
      collection: { userId },
    },
    select: {
      review: {
        select: { decisionReason: true },
      },
      qualityAnalysis: {
        select: {
          isBlurry: true,
          isOutOfFocus: true,
          hasMotionBlur: true,
          hasEyesClosed: true,
          isLowExposure: true,
          isHighExposure: true,
          hasCompressionArtifacts: true,
        },
      },
    },
  });

  if (!candidate) {
    return null;
  }

  const qualityAnalysis = candidate.qualityAnalysis;
  const isLowQuality = qualityAnalysis
    ? qualityAnalysis.isBlurry ||
      qualityAnalysis.isOutOfFocus ||
      qualityAnalysis.hasMotionBlur ||
      qualityAnalysis.hasEyesClosed ||
      qualityAnalysis.isLowExposure ||
      qualityAnalysis.isHighExposure ||
      qualityAnalysis.hasCompressionArtifacts
    : false;

  if (!isLowQuality) {
    return null;
  }

  const decisionReason =
    candidate.review?.decisionReason ?? ReviewDecisionReason.LOW_QUALITY;

  const review = await prisma.collectionImageReview.upsert({
    where: { imageId },
    create: {
      collectionId,
      imageId,
      isSelected,
      decisionSource: ReviewDecisionSource.USER,
      decisionReason,
      reviewedAt: new Date(),
    },
    update: {
      isSelected,
      decisionSource: ReviewDecisionSource.USER,
      reviewedAt: new Date(),
    },
  });

  if (!review.reviewedAt) {
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
