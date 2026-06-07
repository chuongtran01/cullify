import "server-only";

import { prisma } from "@/lib/prisma";
import { createPresignedDownloadUrl } from "@/lib/r2/presign";

export type CollectionGroupSummary = {
  id: string;
  collectionId: string;
  representativeImageId: string | null;
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
  totalImages: number;
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
          include: { image: true },
          orderBy: { image: { createdAt: "asc" } },
          take: 1,
        },
      },
      orderBy: [{ imageCount: "desc" }, { createdAt: "asc" }],
      skip: offset,
      take: limit,
    }),
  ]);

  const groups = await Promise.all(
    rows.flatMap((group) => {
      const firstImage = group.images[0]?.image;

      if (!firstImage) {
        return [];
      }

      return [
        (async (): Promise<CollectionGroupPreview> => ({
          ...formatGroupSummary(group),
          selectionStatus:
            group.representativeImageId === null ? "NEEDS_SELECTION" : "SELECTED",
          previewImage: {
            id: firstImage.id,
            fileName: firstImage.fileName,
            objectKey: firstImage.objectKey,
            mimeType: firstImage.mimeType,
            createdAt: firstImage.createdAt.toISOString(),
            imageUrl: await createPresignedDownloadUrl(firstImage.objectKey),
          },
        }))(),
      ];
    }),
  );

  return {
    groups,
    totalSimilarGroups,
    totalImages: groups.reduce((total, group) => total + group.imageCount, 0),
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
        include: { image: true },
        orderBy: { image: { createdAt: "asc" } },
      },
    },
  });

  if (!group) {
    return null;
  }

  const images = await Promise.all(
    group.images.map(async (groupImage) => ({
      id: groupImage.image.id,
      fileName: groupImage.image.fileName,
      objectKey: groupImage.image.objectKey,
      mimeType: groupImage.image.mimeType,
      createdAt: groupImage.image.createdAt.toISOString(),
      imageUrl: await createPresignedDownloadUrl(groupImage.image.objectKey),
    })),
  );

  return {
    ...formatGroupSummary(group),
    images,
  };
}

export async function updateCollectionGroupRepresentative(
  collectionId: string,
  groupId: string,
  userId: string,
  representativeImageId: string | null,
): Promise<boolean> {
  const group = await prisma.imageGroup.findFirst({
    where: {
      id: groupId,
      collectionId,
      collection: { userId },
    },
    select: { id: true },
  });

  if (!group) {
    return false;
  }

  if (representativeImageId !== null) {
    const membership = await prisma.groupImage.findFirst({
      where: {
        groupId,
        imageId: representativeImageId,
      },
      select: { id: true },
    });

    if (!membership) {
      return false;
    }
  }

  await prisma.imageGroup.update({
    where: { id: groupId },
    data: { representativeImageId },
  });

  return true;
}

type GroupSummaryFields = {
  id: string;
  collectionId: string;
  representativeImageId: string | null;
  imageCount: number;
  createdAt: Date;
  updatedAt: Date;
};

function formatGroupSummary(group: GroupSummaryFields): CollectionGroupSummary {
  return {
    id: group.id,
    collectionId: group.collectionId,
    representativeImageId: group.representativeImageId,
    imageCount: group.imageCount,
    createdAt: group.createdAt.toISOString(),
    updatedAt: group.updatedAt.toISOString(),
  };
}
