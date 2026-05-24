import type { CreateUploadSessionRequest, UploadFileInput } from "@/lib/upload/types";

const MAX_FILES_PER_SESSION = 100;
const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024;

export type ValidationResult =
  | { ok: true; data: CreateUploadSessionRequest }
  | { ok: false; error: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseFile(value: unknown, index: number): UploadFileInput | string {
  if (!isRecord(value)) {
    return `files[${index}] must be an object`;
  }

  const name = value.name;
  const type = value.type;
  const size = value.size;

  if (typeof name !== "string" || name.trim().length === 0) {
    return `files[${index}].name must be a non-empty string`;
  }

  if (typeof type !== "string" || !type.startsWith("image/")) {
    return `files[${index}].type must be an image MIME type`;
  }

  if (typeof size !== "number" || !Number.isFinite(size) || size <= 0) {
    return `files[${index}].size must be a positive number`;
  }

  if (size > MAX_FILE_SIZE_BYTES) {
    return `files[${index}].size must be at most 50MB`;
  }

  return {
    name: name.trim(),
    type: type.trim(),
    size: Math.floor(size),
  };
}

export function validateCreateUploadSessionRequest(
  body: unknown,
): ValidationResult {
  if (!isRecord(body)) {
    return { ok: false, error: "Request body must be a JSON object" };
  }

  const filesValue = body.files;

  if (!Array.isArray(filesValue)) {
    return { ok: false, error: "files must be an array" };
  }

  if (filesValue.length === 0) {
    return { ok: false, error: "files must contain at least one item" };
  }

  if (filesValue.length > MAX_FILES_PER_SESSION) {
    return {
      ok: false,
      error: `files must contain at most ${MAX_FILES_PER_SESSION} items`,
    };
  }

  const files: UploadFileInput[] = [];

  for (let index = 0; index < filesValue.length; index += 1) {
    const parsed = parseFile(filesValue[index], index);

    if (typeof parsed === "string") {
      return { ok: false, error: parsed };
    }

    files.push(parsed);
  }

  return { ok: true, data: { files } };
}
