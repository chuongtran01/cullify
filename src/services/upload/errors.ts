export class UploadSessionError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "UploadSessionError";
    this.status = status;
  }
}

export class UploadR2Error extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UploadR2Error";
  }
}
