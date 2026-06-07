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

export type CollectionGroupsResponse = {
  groups: CollectionGroupSummary[];
  totalGroups: number;
  totalImages: number;
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

export async function listCollectionGroups(
  collectionId: string,
  userId: string,
): Promise<CollectionGroupsResponse | null> {
  const collection = await prisma.collection.findFirst({
    where: { id: collectionId, userId },
    select: { id: true },
  });

  if (!collection) {
    return null;
  }

  const rows = await prisma.imageGroup.findMany({
    where: { collectionId },
    orderBy: [{ imageCount: "desc" }, { createdAt: "asc" }],
  });
  const groups = rows.map(formatGroupSummary);

  return {
    groups,
    totalGroups: groups.length,
    totalImages: groups.reduce((total, group) => total + group.imageCount, 0),
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
