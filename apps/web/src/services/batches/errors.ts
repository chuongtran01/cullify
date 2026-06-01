export class BatchesServiceError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "BatchesServiceError";
  }
}

export class BatchUploadError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "BatchUploadError";
    this.status = status;
  }
}

export class BatchUploadStorageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BatchUploadStorageError";
  }
}
