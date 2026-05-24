export class UploadSessionError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "UploadSessionError";
    this.status = status;
  }
}
