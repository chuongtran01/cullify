import { randomUUID } from "node:crypto";

import { ImageUploadStatus } from "@/generated/prisma/client";
import { buildObjectKey } from "@/lib/r2/keys";
import { prisma } from "@/lib/prisma";
import type { UploadFileInput } from "@/lib/upload/types";

export type UploadFileRecord = {
  fileId: string;
  file: UploadFileInput;
  objectKey: string;
};

export async function createUploadSessionRecords(
  sessionId: string,
  files: UploadFileInput[],
): Promise<UploadFileRecord[]> {
  const records = files.map((file) => {
    const fileId = randomUUID();
    const objectKey = buildObjectKey(sessionId, fileId, file.name);

    return { fileId, file, objectKey };
  });

  await prisma.project.create({
    data: {
      id: sessionId,
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

export async function deleteUploadSession(sessionId: string): Promise<void> {
  await prisma.project
    .delete({
      where: { id: sessionId },
    })
    .catch(() => undefined);
}

export async function completeUploadSession(
  sessionId: string,
  fileIds: string[],
): Promise<number | null> {
  const project = await prisma.project.findUnique({
    where: { id: sessionId },
    select: { id: true },
  });

  if (!project) {
    return null;
  }

  const result = await prisma.image.updateMany({
    where: {
      projectId: sessionId,
      id: { in: fileIds },
    },
    data: {
      status: ImageUploadStatus.UPLOADED,
      uploadedAt: new Date(),
    },
  });

  return result.count;
}
