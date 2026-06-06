from io import BytesIO

from sqlalchemy.orm import sessionmaker

from image_processor.config import WorkerSettings
from image_processor.db import CollectionStatus
from image_processor.db.repositories import (
    CollectionImageReviewRepository,
    CollectionRepository,
    ImageEmbeddingRepository,
    ImageGroupRepository,
    ImageQualityAnalysisRepository,
)
from image_processor.mq.message_types import ProcessCollectionJobData
from image_processor.processor.collection_loader import CollectionLoader
from image_processor.processor.image_downloader import ImageDownloader
from image_processor.processor.quality import ImageQualityAnalyzer
from image_processor.processor.similarity import (
    ImageEmbeddingAnalyzer,
    ImageGroupingService,
)
from image_processor.storage.r2_client import R2Client


class ImageProcessingPipeline:
    def __init__(
        self,
        session_factory: sessionmaker,
        settings: WorkerSettings,
    ) -> None:
        self.collection_loader = CollectionLoader(session_factory)
        self.collection_repository = CollectionRepository(session_factory)
        self.quality_analysis_repository = ImageQualityAnalysisRepository(
            session_factory,
        )
        self.image_embedding_repository = ImageEmbeddingRepository(session_factory)
        self.image_group_repository = ImageGroupRepository(session_factory)
        self.collection_image_review_repository = CollectionImageReviewRepository(
            session_factory,
        )
        self.image_downloader = ImageDownloader(R2Client(settings.r2_settings()))
        self.quality_analyzer = ImageQualityAnalyzer()
        self.embedding_analyzer = ImageEmbeddingAnalyzer()
        self.grouping_service = ImageGroupingService()

    def process(self, data: ProcessCollectionJobData) -> None:
        # Load the collection and uploaded image records for this job.
        context = self.collection_loader.load(data["collectionId"])
        failed_count = 0

        # Process each uploaded image independently so one failure does not stop the job.
        for image in context.images:
            try:
                # Download the image once and reuse the decoded pixels for every analyzer.
                downloaded = self.image_downloader.download(image)

                try:
                    from PIL import Image
                except ImportError as exc:
                    raise RuntimeError(
                        "Pillow is required to process downloaded images."
                    ) from exc

                with Image.open(BytesIO(downloaded.data)) as decoded_image:
                    # Store quality signals used for low-quality review defaults.
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
                        # Store embeddings used later to create similarity groups.
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
                # Record per-image processing failures and continue with the batch.
                failed_count += 1
                self.quality_analysis_repository.upsert_failure(
                    image.id,
                    str(exc),
                )
                continue

        # Build similarity groups from successfully generated embeddings.
        image_ids = [image.id for image in context.images]
        embeddings = self.image_embedding_repository.list_successful_vectors(image_ids)
        image_groups = self.grouping_service.group(image_ids, embeddings)
        self.image_group_repository.replace_for_collection(
            context.collection.id,
            image_groups,
        )
        # Create the initial final-photo selections before exposing review to the user.
        self.collection_image_review_repository.create_defaults_for_collection(
            context.collection.id,
        )

        # Mark the collection ready only after quality, grouping, and review defaults exist.
        next_status = (
            CollectionStatus.FAILED if failed_count > 0 else CollectionStatus.READY_FOR_REVIEW
        )
        self.collection_repository.update_status(context.collection.id, next_status)
