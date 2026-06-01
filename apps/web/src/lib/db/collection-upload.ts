import { randomUUID } from "node:crypto";

import { CollectionStatus, ImageUploadStatus } from "@/generated/prisma/client";
import { buildObjectKey } from "@/lib/r2/keys";
import { prisma } from "@/lib/prisma";
import type { CollectionUploadFileInput } from "@/services/collections/types";

export type CollectionUploadFileRecord = {
  fileId: string;
  file: CollectionUploadFileInput;
  objectKey: string;
};

export async function createCollectionUploadRecords(
  collectionId: string,
  userId: string,
  files: CollectionUploadFileInput[],
): Promise<CollectionUploadFileRecord[]> {
  const records = files.map((file) => {
    const fileId = randomUUID();
    const objectKey = buildObjectKey(userId, collectionId, fileId, file.name);

    return { fileId, file, objectKey };
  });

  await prisma.collection.create({
    data: {
      id: collectionId,
      userId,
      status: CollectionStatus.UPLOADING,
      images: {
        create: records.map((record) => ({
          id: record.fileId,
          fileName: record.file.name,
          mimeType: record.file.type,
          sizeBytes: record.file.size,
          objectKey: record.objectKey,
        })),
      },
    },
  });

  return records;
}

export async function deleteCollectionUpload(
  collectionId: string,
  userId: string,
): Promise<void> {
  await prisma.collection
    .deleteMany({
      where: { id: collectionId, userId },
    })
    .catch(() => undefined);
}

export async function completeCollectionUpload(
  collectionId: string,
  userId: string,
  fileIds: string[],
): Promise<number | null> {
  const collection = await prisma.collection.findFirst({
    where: { id: collectionId, userId },
    select: { id: true },
  });

  if (!collection) {
    return null;
  }

  const result = await prisma.$transaction(async (tx) => {
    const imageUpdate = await tx.image.updateMany({
      where: {
        collectionId,
        collection: { userId },
        id: { in: fileIds },
      },
      data: {
        status: ImageUploadStatus.UPLOADED,
        uploadedAt: new Date(),
      },
    });

    await tx.collection.updateMany({
      where: { id: collectionId, userId },
      data: { status: CollectionStatus.PROCESSING },
    });

    return imageUpdate.count;
  });

  return result;
}
