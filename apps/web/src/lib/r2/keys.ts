const MAX_FILE_NAME_LENGTH = 200;

export function sanitizeFileName(name: string): string {
  const baseName = name.split(/[/\\]/).pop()?.trim() ?? "";

  if (!baseName) {
    return "upload.bin";
  }

  const sanitized = baseName.replace(/[^\w.\-()+\s]/g, "_").replace(/\s+/g, " ");

  if (sanitized.length <= MAX_FILE_NAME_LENGTH) {
    return sanitized;
  }

  const extensionIndex = sanitized.lastIndexOf(".");
  const extension =
    extensionIndex > 0 ? sanitized.slice(extensionIndex) : "";
  const stem = sanitized.slice(
    0,
    Math.max(1, MAX_FILE_NAME_LENGTH - extension.length),
  );

  return `${stem}${extension}`;
}

export function buildObjectKey(
  userId: string,
  sessionId: string,
  fileId: string,
  fileName: string,
): string {
  return `uploads/users/${userId}/batches/${sessionId}/images/${fileId}/${sanitizeFileName(fileName)}`;
}
