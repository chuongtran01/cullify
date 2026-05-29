from sqlalchemy.orm import sessionmaker

from image_processor.config import WorkerSettings
from image_processor.mq.message_types import ProcessUploadSessionJobData
from image_processor.processor.batch_loader import BatchLoader
from image_processor.processor.image_downloader import ImageDownloader
from image_processor.processor.quality import ImageQualityAnalyzer
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
        self.quality_analyzer = ImageQualityAnalyzer()

    def process(self, data: ProcessUploadSessionJobData) -> None:
        context = self.batch_loader.load(data["sessionId"])

        for image in context.images:
            try:
                downloaded = self.image_downloader.download(image)
                quality_result = self.quality_analyzer.analyze(downloaded.data)
            except Exception:
                continue

            print(
                f"image={image.id} blur_score={quality_result.blur_score:.2f} "
                f"is_blurry={quality_result.is_blurry} "
                f"exposure_score={quality_result.exposure_score:.2f} "
                f"is_low_exposure={quality_result.is_low_exposure} "
                f"compression_score={quality_result.compression_score:.2f} "
                f"has_compression_artifacts="
                f"{quality_result.has_compression_artifacts}",
                flush=True,
            )
