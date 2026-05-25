from dataclasses import dataclass
from typing import Annotated

from sqlalchemy.orm import sessionmaker

from image_processor.db.models import Batch, Image
from image_processor.db.repositories import BatchRepository, ImageRepository


@dataclass(frozen=True)
class BatchContext:
    batch: Annotated[Batch, "Batch record loaded for the upload session."]
    images: Annotated[list[Image], "Uploaded images belonging to the batch."]


class BatchNotFoundError(ValueError):
    pass


class BatchLoader:
    def __init__(self, session_factory: sessionmaker) -> None:
        self.batches = BatchRepository(session_factory)
        self.images = ImageRepository(session_factory)

    def load(self, session_id: str) -> BatchContext:
        batch = self.batches.get_by_id(session_id)

        if batch is None:
            raise BatchNotFoundError(f"Batch not found: {session_id}")

        images = self.images.list_uploaded_for_batch(session_id)
        return BatchContext(batch=batch, images=images)
