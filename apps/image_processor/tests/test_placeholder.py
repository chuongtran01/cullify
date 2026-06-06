import asyncio
import unittest
from contextlib import redirect_stdout
from dataclasses import dataclass
from datetime import datetime
from io import BytesIO, StringIO
from typing import Any
from unittest.mock import MagicMock

from image_processor.config import WorkerSettings
from image_processor.db import Collection, CollectionStatus, Image, ImageUploadStatus
from image_processor.mq.consumer import ImageWorker
from image_processor.mq.message_types import PROCESS_COLLECTION_JOB_NAME
from image_processor.processor.collection_loader import CollectionLoader, CollectionNotFoundError
from image_processor.processor.image_downloader import DownloadedImage, ImageDownloader
from image_processor.processor.pipeline import ImageProcessingPipeline
from image_processor.processor.quality import ImageQualityResult
from image_processor.processor.similarity import ImageEmbeddingResult


@dataclass(frozen=True)
class FakeJob:
    id: str | None
    name: str
    data: dict[str, Any]


class RecordingPipeline:
    def __init__(self) -> None:
        self.messages: list[dict[str, str]] = []

    def process(self, message: dict[str, str]) -> None:
        self.messages.append(message)


class FakeCollectionRepository:
    def get_by_id(self, collection_id: str) -> Collection | None:
        return Collection(
            id=collection_id,
            status=CollectionStatus.PROCESSING,
            created_at=datetime(2026, 1, 1),
            updated_at=datetime(2026, 1, 1),
        )


class MissingCollectionRepository:
    def get_by_id(self, collection_id: str) -> Collection | None:
        return None


class FakeImageRepository:
    def __init__(self, images: list[Image] | None = None) -> None:
        self._images = images

    def list_uploaded_for_collection(self, collection_id: str) -> list[Image]:
        return self._images or [
            Image(
                id="image-1",
                collection_id=collection_id,
                file_name="photo.jpg",
                mime_type="image/jpeg",
                size_bytes=1024,
                object_key="collections/collection-1/image-1.jpg",
                status=ImageUploadStatus.UPLOADED,
                created_at=datetime(2026, 1, 1),
                uploaded_at=datetime(2026, 1, 1),
            )
        ]


class FakeCollectionLoader:
    def __init__(self, images: list[Image] | None = None) -> None:
        self.images = images

    def load(self, session_id: str):
        return make_collection_loader(images=FakeImageRepository(self.images)).load(session_id)


class FakeImageDownloader:
    def __init__(self, failing_image_ids: set[str] | None = None) -> None:
        self.failing_image_ids = failing_image_ids or set()

    def download(self, image: Image):
        if image.id in self.failing_image_ids:
            raise RuntimeError("download failed")

        return DownloadedImage(
            image=image,
            data=make_image_bytes(),
        )


class FakeQualityAnalyzer:
    def __init__(self) -> None:
        self.images: list[object] = []

    def analyze_image(self, image: object) -> ImageQualityResult:
        self.images.append(image)
        return ImageQualityResult(
            blur_score=42.0,
            is_blurry=True,
            focus_score=256.0,
            is_out_of_focus=False,
            motion_blur_score=0.0,
            has_motion_blur=False,
            exposure_score=0.8,
            mean_luminance=0.45,
            dark_pixel_ratio=0.1,
            bright_pixel_ratio=0.0,
            is_low_exposure=False,
            is_high_exposure=False,
            compression_score=0.9,
            blockiness_score=0.01,
            has_compression_artifacts=False,
            width=10,
            height=10,
        )


class FakeEmbeddingAnalyzer:
    model = "openclip"
    version = "ViT-B-32/test"
    dimension = 512

    def __init__(self, failing: bool = False) -> None:
        self.failing = failing
        self.images: list[object] = []

    def analyze_image(self, image: object) -> ImageEmbeddingResult:
        self.images.append(image)
        if self.failing:
            raise RuntimeError("embedding failed")
        return ImageEmbeddingResult(
            vector=[0.0] * 512,
            model=self.model,
            version=self.version,
            dimension=self.dimension,
            raw={"provider": "test"},
        )


class FakeQualityAnalysisRepository:
    def __init__(self) -> None:
        self.successes: list[tuple[str, ImageQualityResult]] = []
        self.failures: list[tuple[str, str]] = []

    def upsert_success(self, image_id: str, result: ImageQualityResult) -> None:
        self.successes.append((image_id, result))

    def upsert_failure(self, image_id: str, error: str) -> None:
        self.failures.append((image_id, error))


class FakeEmbeddingRepository:
    def __init__(self) -> None:
        self.successes: list[tuple[str, ImageEmbeddingResult]] = []
        self.failures: list[tuple[str, str, str, str | None, int]] = []

    def upsert_success(self, image_id: str, result: ImageEmbeddingResult) -> None:
        self.successes.append((image_id, result))

    def upsert_failure(
        self,
        image_id: str,
        error: str,
        *,
        model: str,
        version: str | None,
        dimension: int,
    ) -> None:
        self.failures.append((image_id, error, model, version, dimension))

    def list_successful_vectors(self, image_ids: list[str]) -> dict[str, list[float]]:
        return {
            image_id: result.vector
            for image_id, result in self.successes
            if image_id in image_ids
        }


class FakeGroupingService:
    def __init__(self) -> None:
        self.calls: list[tuple[list[str], dict[str, list[float]]]] = []

    def group(
        self,
        image_ids: list[str],
        embeddings: dict[str, list[float]],
    ) -> list[list[str]]:
        self.calls.append((image_ids, embeddings))
        return [[image_id] for image_id in image_ids]


class FakeImageGroupRepository:
    def __init__(self) -> None:
        self.replacements: list[tuple[str, list[list[str]]]] = []

    def replace_for_collection(
        self,
        collection_id: str,
        image_groups: list[list[str]],
    ) -> None:
        self.replacements.append((collection_id, image_groups))


class FakeCollectionStatusRepository:
    def __init__(self) -> None:
        self.statuses: list[tuple[str, CollectionStatus]] = []

    def update_status(self, collection_id: str, status: CollectionStatus) -> None:
        self.statuses.append((collection_id, status))


def make_collection_loader(
    collections: FakeCollectionRepository | MissingCollectionRepository | None = None,
    images: FakeImageRepository | None = None,
) -> CollectionLoader:
    loader = CollectionLoader(MagicMock())
    loader.collections = collections or FakeCollectionRepository()
    loader.images = images or FakeImageRepository()
    return loader


def make_image(image_id: str, object_key: str | None = None) -> Image:
    return Image(
        id=image_id,
        collection_id="session-1",
        file_name=f"{image_id}.jpg",
        mime_type="image/jpeg",
        size_bytes=1024,
        object_key=object_key or f"collections/collection-1/{image_id}.jpg",
        status=ImageUploadStatus.UPLOADED,
        created_at=datetime(2026, 1, 1),
        uploaded_at=datetime(2026, 1, 1),
    )


def make_image_bytes() -> bytes:
    from PIL import Image as PILImage

    image = PILImage.new("RGB", (4, 4), color=(128, 128, 128))
    output = BytesIO()
    image.save(output, format="PNG")
    return output.getvalue()


class WorkerPlaceholderTest(unittest.TestCase):
    def test_worker_processes_job_data(self) -> None:
        settings = WorkerSettings(
            database_url="postgresql://cullify:cullify@localhost:5432/cullify",
            redis_url="redis://localhost:6379",
            queue_name="image-processing",
            log_level="INFO",
        )

        pipeline = RecordingPipeline()
        worker = ImageWorker(settings=settings, pipeline=pipeline)

        result = asyncio.run(
            worker.process_job(
                FakeJob(
                    id="1",
                    name=PROCESS_COLLECTION_JOB_NAME,
                    data={
                        "message": "hello from test",
                        "collectionId": "session-1",
                    },
                ),
                "token",
            )
        )

        self.assertEqual(result, {"ok": True})
        self.assertEqual(worker.settings.queue_name, "image-processing")
        self.assertEqual(
            pipeline.messages,
            [{"message": "hello from test", "collectionId": "session-1"}],
        )

    def test_worker_rejects_unsupported_job_name(self) -> None:
        settings = WorkerSettings(
            database_url="postgresql://cullify:cullify@localhost:5432/cullify",
            redis_url="redis://localhost:6379",
            queue_name="image-processing",
            log_level="INFO",
        )
        worker = ImageWorker(settings=settings, pipeline=RecordingPipeline())

        with self.assertRaises(ValueError):
            asyncio.run(
                worker.process_job(
                    FakeJob(
                        id="1",
                        name="unsupported-job",
                        data={
                            "message": "hello from test",
                            "collectionId": "session-1",
                        },
                    ),
                    "token",
                )
            )

    def test_collection_loader_loads_collection_and_images(self) -> None:
        context = make_collection_loader().load("session-1")

        self.assertEqual(context.collection.id, "session-1")
        self.assertEqual(len(context.images), 1)
        self.assertEqual(context.images[0].object_key, "collections/collection-1/image-1.jpg")

    def test_collection_loader_raises_when_collection_missing(self) -> None:
        loader = make_collection_loader(collections=MissingCollectionRepository())

        with self.assertRaises(CollectionNotFoundError):
            loader.load("missing-session")

    def test_image_downloader_downloads_collection_images(self) -> None:
        class FakeStorage:
            def download_bytes(self, object_key: str) -> bytes:
                return f"bytes:{object_key}".encode()

        context = make_collection_loader().load("session-1")
        downloaded = ImageDownloader(FakeStorage()).download_for_collection(context)

        self.assertEqual(len(downloaded), 1)
        self.assertEqual(downloaded[0].image.id, "image-1")
        self.assertEqual(
            downloaded[0].data,
            b"bytes:collections/collection-1/image-1.jpg",
        )

    def test_pipeline_scores_downloaded_images_for_blur(self) -> None:
        pipeline = ImageProcessingPipeline.__new__(ImageProcessingPipeline)
        pipeline.collection_loader = FakeCollectionLoader()
        pipeline.image_downloader = FakeImageDownloader()
        pipeline.quality_analyzer = FakeQualityAnalyzer()
        pipeline.embedding_analyzer = FakeEmbeddingAnalyzer()
        pipeline.quality_analysis_repository = FakeQualityAnalysisRepository()
        pipeline.image_embedding_repository = FakeEmbeddingRepository()
        pipeline.grouping_service = FakeGroupingService()
        pipeline.image_group_repository = FakeImageGroupRepository()
        pipeline.collection_repository = FakeCollectionStatusRepository()

        with redirect_stdout(StringIO()) as output:
            pipeline.process({"collectionId": "session-1"})

        self.assertEqual(
            len(pipeline.quality_analyzer.images),
            1,
        )
        self.assertEqual(len(pipeline.embedding_analyzer.images), 1)
        self.assertEqual(len(pipeline.quality_analysis_repository.successes), 1)
        self.assertEqual(len(pipeline.image_embedding_repository.successes), 1)
        self.assertEqual(
            pipeline.quality_analysis_repository.successes[0][0],
            "image-1",
        )
        self.assertEqual(pipeline.quality_analysis_repository.failures, [])
        self.assertEqual(pipeline.image_embedding_repository.failures, [])
        self.assertEqual(
            pipeline.image_group_repository.replacements,
            [("session-1", [["image-1"]])],
        )
        self.assertEqual(
            pipeline.collection_repository.statuses,
            [("session-1", CollectionStatus.READY_FOR_REVIEW)],
        )
        self.assertIn("image=image-1 blur_score=42.00", output.getvalue())
        self.assertIn("exposure_score=0.80", output.getvalue())
        self.assertIn("compression_score=0.90", output.getvalue())

    def test_pipeline_continues_when_one_image_fails(self) -> None:
        pipeline = ImageProcessingPipeline.__new__(ImageProcessingPipeline)
        pipeline.collection_loader = FakeCollectionLoader(
            images=[
                make_image("image-1"),
                make_image("image-2"),
                make_image("image-3"),
            ]
        )
        pipeline.image_downloader = FakeImageDownloader(
            failing_image_ids={"image-2"}
        )
        pipeline.quality_analyzer = FakeQualityAnalyzer()
        pipeline.embedding_analyzer = FakeEmbeddingAnalyzer()
        pipeline.quality_analysis_repository = FakeQualityAnalysisRepository()
        pipeline.image_embedding_repository = FakeEmbeddingRepository()
        pipeline.grouping_service = FakeGroupingService()
        pipeline.image_group_repository = FakeImageGroupRepository()
        pipeline.collection_repository = FakeCollectionStatusRepository()

        with redirect_stdout(StringIO()) as output:
            pipeline.process({"collectionId": "session-1"})

        self.assertEqual(
            len(pipeline.quality_analyzer.images),
            2,
        )
        self.assertEqual(len(pipeline.embedding_analyzer.images), 2)
        self.assertEqual(
            [image_id for image_id, _result in pipeline.quality_analysis_repository.successes],
            ["image-1", "image-3"],
        )
        self.assertEqual(
            pipeline.quality_analysis_repository.failures,
            [("image-2", "download failed")],
        )
        self.assertEqual(
            pipeline.image_group_repository.replacements,
            [("session-1", [["image-1"], ["image-2"], ["image-3"]])],
        )
        self.assertEqual(
            pipeline.collection_repository.statuses,
            [("session-1", CollectionStatus.FAILED)],
        )
        summary = output.getvalue()
        self.assertIn("image=image-1 blur_score=42.00", summary)
        self.assertIn("image=image-3 blur_score=42.00", summary)
        self.assertNotIn("image=image-2", summary)

    def test_pipeline_records_embedding_failure_without_failing_collection(self) -> None:
        pipeline = ImageProcessingPipeline.__new__(ImageProcessingPipeline)
        pipeline.collection_loader = FakeCollectionLoader()
        pipeline.image_downloader = FakeImageDownloader()
        pipeline.quality_analyzer = FakeQualityAnalyzer()
        pipeline.embedding_analyzer = FakeEmbeddingAnalyzer(failing=True)
        pipeline.quality_analysis_repository = FakeQualityAnalysisRepository()
        pipeline.image_embedding_repository = FakeEmbeddingRepository()
        pipeline.grouping_service = FakeGroupingService()
        pipeline.image_group_repository = FakeImageGroupRepository()
        pipeline.collection_repository = FakeCollectionStatusRepository()

        pipeline.process({"collectionId": "session-1"})

        self.assertEqual(len(pipeline.quality_analysis_repository.successes), 1)
        self.assertEqual(pipeline.image_embedding_repository.successes, [])
        self.assertEqual(
            pipeline.image_embedding_repository.failures,
            [
                (
                    "image-1",
                    "embedding failed",
                    "openclip",
                    "ViT-B-32/test",
                    512,
                )
            ],
        )
        self.assertEqual(
            pipeline.image_group_repository.replacements,
            [("session-1", [["image-1"]])],
        )
        self.assertEqual(
            pipeline.collection_repository.statuses,
            [("session-1", CollectionStatus.READY_FOR_REVIEW)],
        )


if __name__ == "__main__":
    unittest.main()
