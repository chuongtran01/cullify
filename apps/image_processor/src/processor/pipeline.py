from io import BytesIO

from sqlalchemy.orm import sessionmaker

from image_processor.config import WorkerSettings
from image_processor.db import BatchStatus
from image_processor.db.repositories import (
    BatchRepository,
    ImageEmbeddingRepository,
    ImageQualityAnalysisRepository,
)
from image_processor.mq.message_types import ProcessUploadSessionJobData
from image_processor.processor.batch_loader import BatchLoader
from image_processor.processor.image_downloader import ImageDownloader
from image_processor.processor.quality import ImageQualityAnalyzer
from image_processor.processor.similarity import ImageEmbeddingAnalyzer
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
        self.image_embedding_repository = ImageEmbeddingRepository(session_factory)
        self.image_downloader = ImageDownloader(R2Client(settings.r2_settings()))
        self.quality_analyzer = ImageQualityAnalyzer()
        self.embedding_analyzer = ImageEmbeddingAnalyzer()

    def process(self, data: ProcessUploadSessionJobData) -> None:
        context = self.batch_loader.load(data["sessionId"])
        failed_count = 0

        for image in context.images:
            try:
                downloaded = self.image_downloader.download(image)

                try:
                    from PIL import Image
                except ImportError as exc:
                    raise RuntimeError(
                        "Pillow is required to process downloaded images."
                    ) from exc

                with Image.open(BytesIO(downloaded.data)) as decoded_image:
                    quality_result = self.quality_analyzer.analyze_image(
                        decoded_image,
                    )
                    self.quality_analysis_repository.upsert_success(
                        image.id,
                        quality_result,
                    )
                    print(
                        f"image={image.id} "
                        f"blur_score={quality_result.blur_score:.2f} "
                        f"exposure_score={quality_result.exposure_score:.2f} "
                        f"compression_score={quality_result.compression_score:.2f}"
                    )

                    try:
                        embedding_result = self.embedding_analyzer.analyze_image(
                            decoded_image,
                        )
                        self.image_embedding_repository.upsert_success(
                            image.id,
                            embedding_result,
                        )
                    except Exception as embedding_exc:
                        self.image_embedding_repository.upsert_failure(
                            image.id,
                            str(embedding_exc),
                            model=self.embedding_analyzer.model,
                            version=self.embedding_analyzer.version,
                            dimension=self.embedding_analyzer.dimension,
                        )
            except Exception as exc:
                failed_count += 1
                self.quality_analysis_repository.upsert_failure(
                    image.id,
                    str(exc),
                )
                continue

        next_status = (
            BatchStatus.FAILED if failed_count > 0 else BatchStatus.READY_FOR_REVIEW
        )
        self.batch_repository.update_status(context.batch.id, next_status)
