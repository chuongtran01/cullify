import "server-only";

import { BatchStatus, ImageUploadStatus } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import type { BatchProgressData, ProcessingStage } from "@/components/progress/types";

const TERMINAL_STATUSES = new Set<string>([
  BatchStatus.COMPLETED,
  BatchStatus.FAILED,
]);

export async function getBatchProgress(
  batchId: string,
  userId: string,
): Promise<BatchProgressData | null> {
  const batch = await prisma.batch.findFirst({
    where: { id: batchId, userId },
    select: {
      id: true,
      status: true,
      createdAt: true,
    },
  });

  if (!batch) {
    return null;
  }

  const uploadedImageWhere = {
    batchId,
    status: ImageUploadStatus.UPLOADED,
  } as const;

  const [
    totalPhotos,
    processedPhotos,
    failedPhotos,
    lowQualityDetected,
  ] = await Promise.all([
    prisma.image.count({ where: uploadedImageWhere }),
    prisma.image.count({
      where: {
        ...uploadedImageWhere,
        qualityAnalysis: {
          is: {
            analyzedAt: { not: null },
          },
        },
      },
    }),
    prisma.image.count({
      where: {
        ...uploadedImageWhere,
        qualityAnalysis: {
          is: {
            analysisError: { not: null },
          },
        },
      },
    }),
    prisma.image.count({
      where: {
        ...uploadedImageWhere,
        qualityAnalysis: {
          is: {
            OR: [
              { isBlurry: true },
              { isOutOfFocus: true },
              { hasMotionBlur: true },
              { hasEyesClosed: true },
              { isLowExposure: true },
              { isHighExposure: true },
              { hasCompressionArtifacts: true },
              { analysisError: { not: null } },
            ],
          },
        },
      },
    }),
  ]);

  const progress =
    totalPhotos === 0 ? 0 : Math.floor((processedPhotos / totalPhotos) * 100);

  return {
    batchId,
    title: "Photo batch",
    uploadedAt: formatUploadDate(batch.createdAt),
    status: batch.status,
    totalPhotos,
    processedPhotos,
    failedPhotos,
    progress,
    estimatedRemaining: getEstimatedRemaining(batch.status),
    lowQualityDetected,
    similarGroupsFound: 0,
    stages: getStages(batch.status, progress),
    activity: [],
    tasks: [
      "Detecting blurry and out-of-focus photos",
      "Grouping similar photos",
      "Scoring and selecting best photos",
    ],
  };
}

function formatUploadDate(date: Date): string {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function getEstimatedRemaining(status: BatchStatus): string {
  if (TERMINAL_STATUSES.has(status)) {
    return "0 minutes";
  }

  return "a few minutes";
}

function getStages(status: BatchStatus, progress: number): ProcessingStage[] {
  if (status === BatchStatus.COMPLETED) {
    return [
      { label: "Detecting blurry and out-of-focus photos", status: "completed" },
      { label: "Extracting image features", status: "completed" },
      { label: "Grouping similar photos", status: "completed" },
      { label: "Scoring and selecting best photos", status: "completed" },
    ];
  }

  if (status === BatchStatus.FAILED) {
    return [
      { label: "Detecting blurry and out-of-focus photos", status: "completed" },
      { label: "Extracting image features", status: "completed" },
      { label: "Grouping similar photos", status: "pending" },
      { label: "Scoring and selecting best photos", status: "pending" },
    ];
  }

  return [
    {
      label: "Detecting blurry and out-of-focus photos",
      status: progress > 0 ? "completed" : "in progress",
    },
    {
      label: "Extracting image features",
      status: progress >= 50 ? "completed" : progress > 0 ? "in progress" : "pending",
    },
    {
      label: "Grouping similar photos",
      status: progress >= 75 ? "in progress" : "pending",
    },
    {
      label: "Scoring and selecting best photos",
      status: "pending",
    },
  ];
}
