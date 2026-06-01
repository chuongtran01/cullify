import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { getR2BucketName, getR2Client } from "@/lib/r2/client";
import type {
  CollectionUploadFileInput,
  PresignedCollectionUpload,
} from "@/services/collections/types";

export const UPLOAD_URL_EXPIRES_IN_SECONDS = 3600;

export async function createPresignedUpload(
  fileId: string,
  objectKey: string,
  file: CollectionUploadFileInput,
): Promise<PresignedCollectionUpload> {
  const command = new PutObjectCommand({
    Bucket: getR2BucketName(),
    Key: objectKey,
    ContentType: file.type,
  });

  const url = await getSignedUrl(getR2Client(), command, {
    expiresIn: UPLOAD_URL_EXPIRES_IN_SECONDS,
  });

  return {
    fileId,
    url,
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
  };
}
