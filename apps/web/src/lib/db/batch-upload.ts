import { randomUUID } from "node:crypto";

import { BatchStatus, ImageUploadStatus } from "@/generated/prisma/client";
import { buildObjectKey } from "@/lib/r2/keys";
import { prisma } from "@/lib/prisma";
import type { BatchUploadFileInput } from "@/services/batches/types";

export type BatchUploadFileRecord = {
  fileId: string;
  file: BatchUploadFileInput;
  objectKey: string;
};

export async function createBatchUploadRecords(
  batchId: string,
  userId: string,
  files: BatchUploadFileInput[],
): Promise<BatchUploadFileRecord[]> {
  const records = files.map((file) => {
    const fileId = randomUUID();
    const objectKey = buildObjectKey(userId, batchId, fileId, file.name);

    return { fileId, file, objectKey };
  });

  await prisma.batch.create({
    data: {
      id: batchId,
      userId,
      status: BatchStatus.UPLOADING,
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

export async function deleteBatchUpload(
  batchId: string,
  userId: string,
): Promise<void> {
  await prisma.batch
    .deleteMany({
      where: { id: batchId, userId },
    })
    .catch(() => undefined);
}

export async function completeBatchUpload(
  batchId: string,
  userId: string,
  fileIds: string[],
): Promise<number | null> {
  const batch = await prisma.batch.findFirst({
    where: { id: batchId, userId },
    select: { id: true },
  });

  if (!batch) {
    return null;
  }

  const result = await prisma.$transaction(async (tx) => {
    const imageUpdate = await tx.image.updateMany({
      where: {
        batchId,
        batch: { userId },
        id: { in: fileIds },
      },
      data: {
        status: ImageUploadStatus.UPLOADED,
        uploadedAt: new Date(),
      },
    });

    await tx.batch.updateMany({
      where: { id: batchId, userId },
      data: { status: BatchStatus.PROCESSING },
    });

    return imageUpdate.count;
  });

  return result;
}
