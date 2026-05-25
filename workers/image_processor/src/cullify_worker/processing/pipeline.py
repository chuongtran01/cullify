from typing import Protocol

from cullify_worker.database import BatchRecord, ImageRecord
from cullify_worker.jobs import ProcessUploadSessionJobData


class ProcessingDatabase(Protocol):
    def get_batch(self, batch_id: str) -> BatchRecord | None:
        pass

    def list_uploaded_images_for_batch(self, batch_id: str) -> list[ImageRecord]:
        pass


class ImageProcessingPipeline:
    def __init__(self, database: ProcessingDatabase) -> None:
        self.database = database

    def process(self, data: ProcessUploadSessionJobData) -> None:
        """Placeholder for the future image-processing workflow."""
        session_id = data["sessionId"]
        batch = self.database.get_batch(session_id)

        if batch is None:
            raise ValueError(f"Batch not found: {session_id}")

        images = self.database.list_uploaded_images_for_batch(session_id)

        print(
            "Image processing pipeline received "
            f"{len(images)} uploaded image(s) for batch {batch.id}.",
            flush=True,
        )
