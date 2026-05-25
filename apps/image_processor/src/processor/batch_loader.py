from dataclasses import dataclass
from typing import Protocol

from image_processor.db.models import Batch, Image


class BatchLoaderDatabase(Protocol):
    def get_batch(self, batch_id: str) -> Batch | None:
        pass

    def list_uploaded_images_for_batch(self, batch_id: str) -> list[Image]:
        pass


@dataclass(frozen=True)
class BatchContext:
    batch: Batch
    images: list[Image]


class BatchNotFoundError(ValueError):
    pass


class BatchLoader:
    def __init__(self, database: BatchLoaderDatabase) -> None:
        self.database = database

    def load(self, session_id: str) -> BatchContext:
        batch = self.database.get_batch(session_id)

        if batch is None:
            raise BatchNotFoundError(f"Batch not found: {session_id}")

        images = self.database.list_uploaded_images_for_batch(session_id)
        return BatchContext(batch=batch, images=images)
