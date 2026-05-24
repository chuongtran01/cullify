import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { getR2BucketName, getR2Client } from "@/lib/r2/client";
import { buildObjectKey } from "@/lib/r2/keys";
import type { PresignedUpload, UploadFileInput } from "@/lib/upload/types";

export const UPLOAD_URL_EXPIRES_IN_SECONDS = 3600;

export async function createPresignedUpload(
  sessionId: string,
  fileId: string,
  file: UploadFileInput,
): Promise<PresignedUpload> {
  const key = buildObjectKey(sessionId, fileId, file.name);
  const command = new PutObjectCommand({
    Bucket: getR2BucketName(),
    Key: key,
    ContentType: file.type,
  });

  const url = await getSignedUrl(getR2Client(), command, {
    expiresIn: UPLOAD_URL_EXPIRES_IN_SECONDS,
  });

  return {
    fileId,
    key,
    url,
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
  };
}
