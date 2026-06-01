import enum


class BatchStatus(enum.StrEnum):
    UPLOADING = "UPLOADING"
    PROCESSING = "PROCESSING"
    READY_FOR_REVIEW = "READY_FOR_REVIEW"
    IN_REVIEW = "IN_REVIEW"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"


class ImageUploadStatus(enum.StrEnum):
    PENDING = "PENDING"
    UPLOADED = "UPLOADED"
    FAILED = "FAILED"
