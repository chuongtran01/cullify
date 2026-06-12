import "server-only";

import {
  ReviewDecisionReason,
  ReviewDecisionSource,
} from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { createPresignedDownloadUrl } from "@/lib/r2/presign";

export type CollectionGroupSummary = {
  id: string;
  collectionId: string;
  imageCount: number;
  createdAt: string;
  updatedAt: string;
};

export type CollectionGroupImage = {
  id: string;
  fileName: string;
  objectKey: string;
  mimeType: string;
  createdAt: string;
  imageUrl: string;
  isSelected: boolean;
  decisionSource: string | null;
  decisionReason: string | null;
  reviewedAt: string | null;
};

export type CollectionGroupDetail = CollectionGroupSummary & {
  images: CollectionGroupImage[];
};

export type CollectionGroupSelectionStatus = "SELECTED" | "NEEDS_SELECTION";

export type CollectionGroupPreview = CollectionGroupSummary & {
  previewImage: CollectionGroupImage;
  selectionStatus: CollectionGroupSelectionStatus;
};

export type CollectionGroupPreviewsResponse = {
  groups: CollectionGroupPreview[];
  totalSimilarGroups: number;
  limit: number;
  offset: number;
  hasMore: boolean;
};

export async function listCollectionGroups(
  collectionId: string,
  userId: string,
  { limit, offset = 0 }: { limit?: number; offset?: number } = {},
): Promise<CollectionGroupPreviewsResponse | null> {
  const collection = await prisma.collection.findFirst({
    where: { id: collectionId, userId },
    select: { id: true },
  });

  if (!collection) {
    return null;
  }

  const [totalSimilarGroups, rows] = await Promise.all([
    prisma.imageGroup.count({
      where: {
        collectionId,
        imageCount: { gt: 1 },
      },
    }),
    prisma.imageGroup.findMany({
      where: {
        collectionId,
        imageCount: { gt: 1 },
      },
      include: {
        images: {
          orderBy: { createdAt: "asc" },
          take: 1,
        },
        _count: {
          select: {
            images: {
              where: {
                review: {
                  is: {
                    isSelected: true,
                    decisionReason: "SIMILAR_GROUP",
                  },
                },
              },
            },
          },
        },
      },
      orderBy: [{ imageCount: "desc" }, { createdAt: "asc" }],
      skip: offset,
      take: limit,
    }),
  ]);

  const groups = await Promise.all(
    rows.flatMap((group) => {
      const firstImage = group.images[0];

      if (!firstImage) {
        return [];
      }

      return [
        (async (): Promise<CollectionGroupPreview> => ({
          ...formatGroupSummary(group),
          selectionStatus: group._count.images === 1 ? "SELECTED" : "NEEDS_SELECTION",
          previewImage: {
            id: firstImage.id,
            fileName: firstImage.fileName,
            objectKey: firstImage.objectKey,
            mimeType: firstImage.mimeType,
            createdAt: firstImage.createdAt.toISOString(),
            imageUrl: await createPresignedDownloadUrl(firstImage.objectKey),
            isSelected: group._count.images === 1,
            decisionSource: null,
            decisionReason: null,
            reviewedAt: null,
          },
        }))(),
      ];
    }),
  );

  return {
    groups,
    totalSimilarGroups,
    limit: limit ?? groups.length,
    offset,
    hasMore: offset + groups.length < totalSimilarGroups,
  };
}

export async function getCollectionGroup(
  collectionId: string,
  groupId: string,
  userId: string,
): Promise<CollectionGroupDetail | null> {
  const group = await prisma.imageGroup.findFirst({
    where: {
      id: groupId,
      collectionId,
      collection: { userId },
    },
    include: {
      images: {
        include: {
          review: {
            select: {
              isSelected: true,
              decisionSource: true,
              decisionReason: true,
              reviewedAt: true,
            },
          },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!group) {
    return null;
  }

  const images = await Promise.all(
    group.images.map(async (image) => ({
      id: image.id,
      fileName: image.fileName,
      objectKey: image.objectKey,
      mimeType: image.mimeType,
      createdAt: image.createdAt.toISOString(),
      imageUrl: await createPresignedDownloadUrl(image.objectKey),
      isSelected: image.review?.isSelected ?? false,
      decisionSource: image.review?.decisionSource ?? null,
      decisionReason: image.review?.decisionReason ?? null,
      reviewedAt: image.review?.reviewedAt?.toISOString() ?? null,
    })),
  );

  return {
    ...formatGroupSummary(group),
    images,
  };
}

export type CollectionGroupSelectionResult = {
  ok: true;
  selectedImageId: string;
};

export async function updateCollectionGroupSelection(
  collectionId: string,
  groupId: string,
  imageId: string,
  userId: string,
): Promise<CollectionGroupSelectionResult | null> {
  return prisma.$transaction(async (transaction) => {
    const group = await transaction.imageGroup.findFirst({
      where: {
        id: groupId,
        collectionId,
        imageCount: { gt: 1 },
        collection: { userId },
      },
      select: {
        images: {
          select: { id: true },
        },
      },
    });

    if (!group) {
      return null;
    }

    const groupImageIds = group.images.map((image) => image.id);

    if (!groupImageIds.includes(imageId)) {
      return null;
    }

    const reviewedAt = new Date();

    await Promise.all(
      groupImageIds.map((groupImageId) =>
        transaction.collectionImageReview.upsert({
          where: { imageId: groupImageId },
          create: {
            collectionId,
            imageId: groupImageId,
            isSelected: groupImageId === imageId,
            decisionSource: ReviewDecisionSource.USER,
            decisionReason: ReviewDecisionReason.SIMILAR_GROUP,
            reviewedAt,
          },
          update: {
            isSelected: groupImageId === imageId,
            decisionSource: ReviewDecisionSource.USER,
            decisionReason: ReviewDecisionReason.SIMILAR_GROUP,
            reviewedAt,
          },
        }),
      ),
    );

    return {
      ok: true,
      selectedImageId: imageId,
    };
  });
}

type GroupSummaryFields = {
  id: string;
  collectionId: string;
  imageCount: number;
  createdAt: Date;
  updatedAt: Date;
};

function formatGroupSummary(group: GroupSummaryFields): CollectionGroupSummary {
  return {
    id: group.id,
    collectionId: group.collectionId,
    imageCount: group.imageCount,
    createdAt: group.createdAt.toISOString(),
    updatedAt: group.updatedAt.toISOString(),
  };
}
