import "server-only";

import { BatchStatus as PrismaBatchStatus, ImageUploadStatus } from "@/generated/prisma/client";
import type {
  Batch,
  BatchesSummary,
  BatchStatus,
} from "@/components/batches/types";
import { prisma } from "@/lib/prisma";

type BatchImageSignal = {
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

export async function listUserBatches(userId: string): Promise<Batch[]> {
  const batches = await prisma.batch.findMany({
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

  return batches.map((batch) => {
    const totalImages = batch.images.length;
    const processedImages = countProcessedImages(batch.images);
    const lowQualityImages = countLowQualityImages(batch.images);
    const status = mapBatchStatus(batch.status, totalImages, processedImages);

    return {
      id: batch.id,
      name: batch.name ?? formatFallbackBatchName(batch.createdAt),
      status,
      totalImages,
      processedImages,
      createdAt: batch.createdAt.toISOString(),
      completedAt:
        status === "READY_FOR_REVIEW" || status === "COMPLETED"
          ? batch.updatedAt.toISOString()
          : undefined,
      aiPicksCount:
        status === "READY_FOR_REVIEW"
          ? Math.max(0, totalImages - lowQualityImages)
          : undefined,
      groupsCount: status === "READY_FOR_REVIEW" ? 0 : undefined,
      reviewedImages: status === "IN_REVIEW" ? 0 : undefined,
      keptImages: status === "COMPLETED" ? 0 : undefined,
      rejectedImages: status === "COMPLETED" ? 0 : undefined,
      thumbnailUrls: [],
      errorMessage:
        status === "FAILED" ? "Processing failed. Retry this batch." : undefined,
    };
  });
}

export async function updateUserBatchName(
  batchId: string,
  userId: string,
  name: string,
): Promise<{ id: string; name: string } | null> {
  const normalizedName = normalizeBatchName(name);

  if (!normalizedName) {
    throw new Error("Batch name is required");
  }

  const result = await prisma.batch.updateMany({
    where: { id: batchId, userId },
    data: { name: normalizedName },
  });

  if (result.count === 0) {
    return null;
  }

  return { id: batchId, name: normalizedName };
}

export async function getUserBatchesSummary(
  userId: string,
): Promise<BatchesSummary> {
  const [totalBatches, needsReview, processing, totalPhotos] =
    await Promise.all([
      prisma.batch.count({ where: { userId } }),
      prisma.batch.count({
        where: {
          userId,
          status: {
            in: [
              PrismaBatchStatus.READY_FOR_REVIEW,
              PrismaBatchStatus.IN_REVIEW,
            ],
          },
        },
      }),
      prisma.batch.count({
        where: {
          userId,
          status: {
            in: [PrismaBatchStatus.UPLOADING, PrismaBatchStatus.PROCESSING],
          },
        },
      }),
      prisma.image.count({
        where: {
          status: ImageUploadStatus.UPLOADED,
          batch: { userId },
        },
      }),
    ]);

  return {
    totalBatches,
    needsReview,
    processing,
    totalPhotos,
  };
}

function countProcessedImages(images: BatchImageSignal[]) {
  return images.filter((image) => {
    if (image.status !== ImageUploadStatus.UPLOADED) {
      return false;
    }

    return Boolean(
      image.qualityAnalysis?.analyzedAt || image.qualityAnalysis?.analysisError,
    );
  }).length;
}

function formatFallbackBatchName(createdAt: Date): string {
  const date = new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(createdAt);

  return `Batch ${date}`;
}

function normalizeBatchName(name: string): string | null {
  const normalized = name.trim();

  if (normalized.length === 0 || normalized.length > 100) {
    return null;
  }

  return normalized;
}

function countLowQualityImages(images: BatchImageSignal[]) {
  return images.filter((image) => {
    const analysis = image.qualityAnalysis;

    if (!analysis) {
      return false;
    }

    return (
      analysis.isBlurry ||
      analysis.isOutOfFocus ||
      analysis.hasMotionBlur ||
      analysis.hasEyesClosed ||
      analysis.isLowExposure ||
      analysis.isHighExposure ||
      analysis.hasCompressionArtifacts ||
      Boolean(analysis.analysisError)
    );
  }).length;
}

function mapBatchStatus(
  status: string,
  totalImages: number,
  processedImages: number,
): BatchStatus {
  if (status === PrismaBatchStatus.UPLOADING) {
    return "UPLOADING";
  }

  if (status === PrismaBatchStatus.PROCESSING) {
    return totalImages > 0 && processedImages >= totalImages
      ? "READY_FOR_REVIEW"
      : "PROCESSING";
  }

  if (status === PrismaBatchStatus.READY_FOR_REVIEW) {
    return "READY_FOR_REVIEW";
  }

  if (status === PrismaBatchStatus.IN_REVIEW) {
    return "IN_REVIEW";
  }

  if (status === PrismaBatchStatus.COMPLETED) {
    return "COMPLETED";
  }

  return "FAILED";
}
