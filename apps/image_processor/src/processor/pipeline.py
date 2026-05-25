from image_processor.mq.message_types import ProcessUploadSessionJobData
from image_processor.processor.batch_loader import BatchLoader


class ImageProcessingPipeline:
    def __init__(self, batch_loader: BatchLoader) -> None:
        self.batch_loader = batch_loader

    def process(self, data: ProcessUploadSessionJobData) -> None:
        """Placeholder for the future image-processing workflow."""
        session_id = data["sessionId"]
        context = self.batch_loader.load(session_id)

        print(
            "Image processing pipeline received "
            f"{len(context.images)} uploaded image(s) for batch {context.batch.id}.",
            flush=True,
        )
