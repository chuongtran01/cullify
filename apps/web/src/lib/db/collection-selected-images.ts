import "server-only";

import type { ReviewDecisionReason } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { createPresignedDownloadUrl } from "@/lib/r2/presign";

export const DEFAULT_SELECTED_IMAGES_LIMIT = 50;
export const MAX_SELECTED_IMAGES_LIMIT = 100;

export type CollectionSelectedImage = {
  id: string;
  fileName: string;
  objectKey: string;
  mimeType: string;
  imageUrl: string;
  decisionSource: string;
  decisionReason: string;
  selectionLabel: string;
  reviewedAt: string | null;
  createdAt: string;
};

export type CollectionSelectedImagesResponse = {
  images: CollectionSelectedImage[];
  totalSelectedImages: number;
  limit: number;
  offset: number;
  hasMore: boolean;
};

export async function getCollectionSelectedImages(
  collectionId: string,
  userId: string,
  {
    limit = DEFAULT_SELECTED_IMAGES_LIMIT,
    offset = 0,
  }: {
    limit?: number;
    offset?: number;
  } = {},
): Promise<CollectionSelectedImagesResponse | null> {
  const collection = await prisma.collection.findFirst({
    where: { id: collectionId, userId },
    select: { id: true },
  });

  if (!collection) {
    return null;
  }

  const [totalSelectedImages, rows] = await Promise.all([
    prisma.collectionImageReview.count({
      where: {
        collectionId,
        isSelected: true,
      },
    }),
    prisma.collectionImageReview.findMany({
      where: {
        collectionId,
        isSelected: true,
      },
      include: {
        image: true,
      },
      orderBy: [{ reviewedAt: "desc" }, { createdAt: "desc" }],
      skip: offset,
      take: limit,
    }),
  ]);

  const images = await Promise.all(
    rows.map(async (review) => ({
      id: review.image.id,
      fileName: review.image.fileName,
      objectKey: review.image.objectKey,
      mimeType: review.image.mimeType,
      imageUrl: await createPresignedDownloadUrl(review.image.objectKey),
      decisionSource: review.decisionSource,
      decisionReason: review.decisionReason,
      selectionLabel: getSelectionLabel(review.decisionReason),
      reviewedAt: review.reviewedAt?.toISOString() ?? null,
      createdAt: review.image.createdAt.toISOString(),
    })),
  );

  return {
    images,
    totalSelectedImages,
    limit,
    offset,
    hasMore: offset + images.length < totalSelectedImages,
  };
}

function getSelectionLabel(reason: ReviewDecisionReason): string {
  if (reason === "SIMILAR_GROUP") {
    return "Similar Group";
  }

  if (reason === "LOW_QUALITY") {
    return "Low Quality Kept";
  }

  return "Standalone";
}
