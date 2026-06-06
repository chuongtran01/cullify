import "server-only";

import { CollectionStatus as PrismaCollectionStatus, ImageUploadStatus } from "@/generated/prisma/client";
import type {
  Collection,
  CollectionsSummary,
  CollectionStatus,
} from "@/components/collections/types";
import { prisma } from "@/lib/prisma";

type CollectionImageSignal = {
  status: ImageUploadStatus;
  qualityAnalysis: {
    isBlurry: boolean;
    isOutOfFocus: boolean;
    hasMotionBlur: boolean;
    hasEyesClosed: boolean;
    isLowExposure: boolean;
    isHighExposure: boolean;
    hasCompressionArtifacts: boolean;
    analysisError: string | null;
    analyzedAt: Date | null;
  } | null;
};

export async function listUserCollections(userId: string): Promise<Collection[]> {
  const collections = await prisma.collection.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      images: {
        select: {
          status: true,
          qualityAnalysis: {
            select: {
              isBlurry: true,
              isOutOfFocus: true,
              hasMotionBlur: true,
              hasEyesClosed: true,
              isLowExposure: true,
              isHighExposure: true,
              hasCompressionArtifacts: true,
              analysisError: true,
              analyzedAt: true,
            },
          },
        },
      },
    },
  });

  return collections.map((collection) => {
    const totalImages = collection.images.length;
    const processedImages = countProcessedImages(collection.images);
    const status = mapCollectionStatus(collection.status, totalImages, processedImages);

    return {
      id: collection.id,
      name: collection.name ?? formatFallbackCollectionName(collection.createdAt),
      status,
      totalImages,
      processedImages,
      createdAt: collection.createdAt.toISOString(),
      reviewedImages: status === "IN_REVIEW" ? 0 : undefined,
      keptImages: status === "COMPLETED" ? 0 : undefined,
      rejectedImages: status === "COMPLETED" ? 0 : undefined,
      errorMessage:
        status === "FAILED" ? "Processing failed. Retry this collection." : undefined,
    };
  });
}

export async function updateUserCollectionName(
  collectionId: string,
  userId: string,
  name: string,
): Promise<{ id: string; name: string } | null> {
  const normalizedName = normalizeCollectionName(name);

  if (!normalizedName) {
    throw new Error("Collection name is required");
  }

  const result = await prisma.collection.updateMany({
    where: { id: collectionId, userId },
    data: { name: normalizedName },
  });

  if (result.count === 0) {
    return null;
  }

  return { id: collectionId, name: normalizedName };
}

export async function getUserCollectionsSummary(
  userId: string,
): Promise<CollectionsSummary> {
  const [totalCollections, needsReview, processing, totalPhotos] =
    await Promise.all([
      prisma.collection.count({ where: { userId } }),
      prisma.collection.count({
        where: {
          userId,
          status: {
            in: [
              PrismaCollectionStatus.READY_FOR_REVIEW,
              PrismaCollectionStatus.IN_REVIEW,
            ],
          },
        },
      }),
      prisma.collection.count({
        where: {
          userId,
          status: {
            in: [PrismaCollectionStatus.UPLOADING, PrismaCollectionStatus.PROCESSING],
          },
        },
      }),
      prisma.image.count({
        where: {
          status: ImageUploadStatus.UPLOADED,
          collection: { userId },
        },
      }),
    ]);

  return {
    totalCollections,
    needsReview,
    processing,
    totalPhotos,
  };
}

function countProcessedImages(images: CollectionImageSignal[]) {
  return images.filter((image) => {
    if (image.status !== ImageUploadStatus.UPLOADED) {
      return false;
    }

    return Boolean(
      image.qualityAnalysis?.analyzedAt || image.qualityAnalysis?.analysisError,
    );
  }).length;
}

export function formatFallbackCollectionName(createdAt: Date): string {
  const date = new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(createdAt);

  return `Collection ${date}`;
}

function normalizeCollectionName(name: string): string | null {
  const normalized = name.trim();

  if (normalized.length === 0 || normalized.length > 100) {
    return null;
  }

  return normalized;
}

function mapCollectionStatus(
  status: string,
  totalImages: number,
  processedImages: number,
): CollectionStatus {
  if (status === PrismaCollectionStatus.UPLOADING) {
    return "UPLOADING";
  }

  if (status === PrismaCollectionStatus.PROCESSING) {
    return totalImages > 0 && processedImages >= totalImages
      ? "READY_FOR_REVIEW"
      : "PROCESSING";
  }

  if (status === PrismaCollectionStatus.READY_FOR_REVIEW) {
    return "READY_FOR_REVIEW";
  }

  if (status === PrismaCollectionStatus.IN_REVIEW) {
    return "IN_REVIEW";
  }

  if (status === PrismaCollectionStatus.COMPLETED) {
    return "COMPLETED";
  }

  return "FAILED";
}
