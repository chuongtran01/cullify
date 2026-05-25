from image_processor.db.models import (
    Base,
    Batch,
    BatchStatus,
    Image,
    ImageQualityAnalysis,
    ImageUploadStatus,
)
from image_processor.db.repositories import BatchRepository, ImageRepository
from image_processor.db.session import create_session_factory


class ImageProcessingDatabase:
    def __init__(self, database_url: str) -> None:
        session_factory = create_session_factory(database_url)
        self.batches = BatchRepository(session_factory)
        self.images = ImageRepository(session_factory)

    def get_batch(self, batch_id: str) -> Batch | None:
        return self.batches.get_by_id(batch_id)

    def list_uploaded_images_for_batch(self, batch_id: str) -> list[Image]:
        return self.images.list_uploaded_for_batch(batch_id)


__all__ = [
    "Base",
    "Batch",
    "BatchRepository",
    "BatchStatus",
    "Image",
    "ImageProcessingDatabase",
    "ImageQualityAnalysis",
    "ImageRepository",
    "ImageUploadStatus",
    "create_session_factory",
]
