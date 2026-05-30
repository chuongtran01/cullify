export class ProgressServiceError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ProgressServiceError";
    this.status = status;
  }
}
