import "server-only";

import { BatchStatus as PrismaBatchStatus, ImageUploadStatus } from "@/generated/prisma/client";
import type { Batch, BatchStatus } from "@/components/batches/types";
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
      name: `Photo batch ${batch.id.slice(0, 8)}`,
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
