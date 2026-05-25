from sqlalchemy.orm import sessionmaker

from image_processor.mq.message_types import ProcessUploadSessionJobData
from image_processor.processor.batch_loader import BatchLoader


class ImageProcessingPipeline:
    def __init__(self, session_factory: sessionmaker) -> None:
        self.batch_loader = BatchLoader(session_factory)

    def process(self, data: ProcessUploadSessionJobData) -> None:
        """Placeholder for the future image-processing workflow."""
        context = self.batch_loader.load(data["sessionId"])

        print(
            "Image processing pipeline received "
            f"{len(context.images)} uploaded image(s) for batch {context.batch.id}.",
            flush=True,
        )
