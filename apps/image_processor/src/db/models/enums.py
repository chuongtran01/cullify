import enum


class CollectionStatus(enum.StrEnum):
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


class ReviewDecisionSource(enum.StrEnum):
    DEFAULT = "DEFAULT"
    USER = "USER"


class ReviewDecisionReason(enum.StrEnum):
    GOOD_STANDALONE = "GOOD_STANDALONE"
    LOW_QUALITY = "LOW_QUALITY"
    SIMILAR_GROUP = "SIMILAR_GROUP"
