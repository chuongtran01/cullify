from sqlalchemy.orm import sessionmaker

from image_processor.config import WorkerSettings
from image_processor.db import BatchStatus
from image_processor.db.repositories import (
    BatchRepository,
    ImageQualityAnalysisRepository,
)
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
        self.batch_repository = BatchRepository(session_factory)
        self.quality_analysis_repository = ImageQualityAnalysisRepository(
            session_factory,
        )
        self.image_downloader = ImageDownloader(
            R2Client(settings.r2_settings()))
        self.quality_analyzer = ImageQualityAnalyzer()

    def process(self, data: ProcessUploadSessionJobData) -> None:
        context = self.batch_loader.load(data["sessionId"])
        failed_count = 0

        for image in context.images:
            try:
                downloaded = self.image_downloader.download(image)
                quality_result = self.quality_analyzer.analyze(downloaded.data)
                self.quality_analysis_repository.upsert_success(
                    image.id,
                    quality_result,
                )
            except Exception as exc:
                failed_count += 1
                self.quality_analysis_repository.upsert_failure(
                    image.id,
                    str(exc),
                )
                continue

        next_status = (
            BatchStatus.FAILED if failed_count > 0 else BatchStatus.COMPLETED
        )
        self.batch_repository.update_status(context.batch.id, next_status)
