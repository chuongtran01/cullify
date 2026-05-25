from sqlalchemy.orm import sessionmaker

from image_processor.config import WorkerSettings
from image_processor.mq.message_types import ProcessUploadSessionJobData
from image_processor.processor.batch_loader import BatchLoader
from image_processor.processor.image_downloader import ImageDownloader
from image_processor.processor.quality import calculate_blur_score_from_bytes
from image_processor.storage.r2_client import R2Client


class ImageProcessingPipeline:
    def __init__(
        self,
        session_factory: sessionmaker,
        settings: WorkerSettings,
    ) -> None:
        self.batch_loader = BatchLoader(session_factory)
        self.image_downloader = ImageDownloader(
            R2Client(settings.r2_settings()))

    def process(self, data: ProcessUploadSessionJobData) -> None:
        context = self.batch_loader.load(data["sessionId"])

        for image in context.images:
            try:
                downloaded = self.image_downloader.download(image)
                blur_result = calculate_blur_score_from_bytes(downloaded.data)
            except Exception:
                continue

            print(
                f"image={image.id} blur_score={blur_result.score:.2f} "
                f"is_blurry={blur_result.is_blurry}",
                flush=True,
            )
