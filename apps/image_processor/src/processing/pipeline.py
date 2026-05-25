from image_processor.database import ImageProcessingDatabase
from image_processor.jobs import ProcessUploadSessionJobData
from image_processor.processing.batch_loader import BatchLoader


class ImageProcessingPipeline:
    def __init__(
        self,
        database: ImageProcessingDatabase,
        batch_loader: BatchLoader | None = None,
    ) -> None:
        self.batch_loader = batch_loader or BatchLoader(database)

    def process(self, data: ProcessUploadSessionJobData) -> None:
        """Placeholder for the future image-processing workflow."""
        session_id = data["sessionId"]
        context = self.batch_loader.load(session_id)

        print(
            "Image processing pipeline received "
            f"{len(context.images)} uploaded image(s) for batch {context.batch.id}.",
            flush=True,
        )
