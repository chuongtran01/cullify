import "server-only";

import { CollectionStatus, ImageUploadStatus } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import type { CollectionProgressData, ProcessingStage } from "@/components/collections/progress/types";

const TERMINAL_STATUSES = new Set<string>([
  CollectionStatus.READY_FOR_REVIEW,
  CollectionStatus.IN_REVIEW,
  CollectionStatus.COMPLETED,
  CollectionStatus.FAILED,
]);

export async function getCollectionProgress(
  collectionId: string,
  userId: string,
): Promise<CollectionProgressData | null> {
  const collection = await prisma.collection.findFirst({
    where: { id: collectionId, userId },
    select: {
      id: true,
      status: true,
      createdAt: true,
    },
  });

  if (!collection) {
    return null;
  }

  const uploadedImageWhere = {
    collectionId,
    status: ImageUploadStatus.UPLOADED,
  } as const;

  const [
    totalPhotos,
    processedPhotos,
    failedPhotos,
    lowQualityDetected,
    similarGroupsFound,
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
    prisma.imageGroup.count({
      where: {
        collectionId,
        imageCount: { gt: 1 },
      },
    })
  ]);

  const progress =
    totalPhotos === 0 ? 0 : Math.floor((processedPhotos / totalPhotos) * 100);

  return {
    collectionId,
    title: "Photo collection",
    uploadedAt: formatUploadDate(collection.createdAt),
    status: collection.status,
    totalPhotos,
    processedPhotos,
    failedPhotos,
    progress,
    estimatedRemaining: getEstimatedRemaining(collection.status),
    lowQualityDetected,
    similarGroupsFound,
    stages: getStages(collection.status, progress, similarGroupsFound),
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

function getEstimatedRemaining(status: CollectionStatus): string {
  if (TERMINAL_STATUSES.has(status)) {
    return "0 minutes";
  }

  return "a few minutes";
}

function getStages(
  status: CollectionStatus,
  progress: number,
  similarGroupsFound: number,
): ProcessingStage[] {
  if (
    status === CollectionStatus.READY_FOR_REVIEW ||
    status === CollectionStatus.IN_REVIEW ||
    status === CollectionStatus.COMPLETED
  ) {
    return [
      { label: "Uploading photos", status: "completed" },
      { label: "Checking image quality", status: "completed" },
      { label: "Creating image embeddings", status: "completed" },
      { label: "Finding similar groups", status: "completed" },
      { label: "Preparing review", status: "completed" },
    ];
  }

  if (status === CollectionStatus.FAILED) {
    return [
      { label: "Uploading photos", status: "completed" },
      { label: "Checking image quality", status: "completed" },
      { label: "Creating image embeddings", status: "pending" },
      { label: "Finding similar groups", status: "pending" },
      { label: "Preparing review", status: "pending" },
    ];
  }

  return [
    {
      label: "Uploading photos",
      status: "completed",
    },
    {
      label: "Checking image quality",
      status: progress > 0 ? "completed" : "in progress",
    },
    {
      label: "Creating image embeddings",
      status: progress >= 50 ? "completed" : progress > 0 ? "in progress" : "pending",
    },
    {
      label: "Finding similar groups",
      status:
        similarGroupsFound > 0
          ? "completed"
          : progress >= 75
            ? "in progress"
            : "pending",
    },
    {
      label: "Preparing review",
      status: progress >= 100 ? "in progress" : "pending",
    },
  ];
}
