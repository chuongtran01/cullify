export class CollectionsServiceError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "CollectionsServiceError";
  }
}

export class CollectionUploadError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "CollectionUploadError";
    this.status = status;
  }
}

export class CollectionUploadStorageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CollectionUploadStorageError";
  }
}
