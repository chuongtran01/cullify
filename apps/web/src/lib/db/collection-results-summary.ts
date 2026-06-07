import "server-only";

import { ImageUploadStatus } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { formatFallbackCollectionName } from "@/lib/db/collections";
import type { CollectionStatus } from "@/components/collections/types";

export type CollectionResultsBaseSummary = {
  collectionId: string;
  collectionName: string;
  status: CollectionStatus;
  createdAt: string;
  totalPhotos: number;
};

export async function getCollectionResultsBaseSummary(
  collectionId: string,
  userId: string,
): Promise<CollectionResultsBaseSummary | null> {
  const collection = await prisma.collection.findFirst({
    where: { id: collectionId, userId },
    select: {
      id: true,
      name: true,
      status: true,
      createdAt: true,
    },
  });

  if (!collection) {
    return null;
  }

  const totalPhotos = await prisma.image.count({
    where: {
      collectionId,
      status: ImageUploadStatus.UPLOADED,
    },
  });

  return {
    collectionId: collection.id,
    collectionName:
      collection.name ?? formatFallbackCollectionName(collection.createdAt),
    status: collection.status,
    createdAt: collection.createdAt.toISOString(),
    totalPhotos,
  };
}
