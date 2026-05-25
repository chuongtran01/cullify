import asyncio
import unittest
from contextlib import redirect_stdout
from dataclasses import dataclass
from datetime import datetime
from io import StringIO
from typing import Any
from unittest.mock import MagicMock, patch

from image_processor.config import WorkerSettings
from image_processor.db import Batch, BatchStatus, Image, ImageUploadStatus
from image_processor.mq.consumer import ImageWorker
from image_processor.mq.message_types import PROCESS_UPLOAD_SESSION_JOB_NAME
from image_processor.processor.batch_loader import BatchLoader, BatchNotFoundError
from image_processor.processor.image_downloader import DownloadedImage, ImageDownloader
from image_processor.processor.pipeline import ImageProcessingPipeline
from image_processor.processor.quality import BlurScoreResult


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


class FakeBatchRepository:
    def get_by_id(self, batch_id: str) -> Batch | None:
        return Batch(
            id=batch_id,
            status=BatchStatus.PROCESSING,
            created_at=datetime(2026, 1, 1),
            updated_at=datetime(2026, 1, 1),
        )


class MissingBatchRepository:
    def get_by_id(self, batch_id: str) -> Batch | None:
        return None


class FakeImageRepository:
    def __init__(self, images: list[Image] | None = None) -> None:
        self._images = images

    def list_uploaded_for_batch(self, batch_id: str) -> list[Image]:
        return self._images or [
            Image(
                id="image-1",
                batch_id=batch_id,
                file_name="photo.jpg",
                mime_type="image/jpeg",
                size_bytes=1024,
                object_key="batches/session-1/image-1.jpg",
                status=ImageUploadStatus.UPLOADED,
                created_at=datetime(2026, 1, 1),
                uploaded_at=datetime(2026, 1, 1),
            )
        ]


class FakeBatchLoader:
    def __init__(self, images: list[Image] | None = None) -> None:
        self.images = images

    def load(self, session_id: str):
        return make_batch_loader(images=FakeImageRepository(self.images)).load(session_id)


class FakeImageDownloader:
    def __init__(self, failing_image_ids: set[str] | None = None) -> None:
        self.failing_image_ids = failing_image_ids or set()

    def download(self, image: Image):
        if image.id in self.failing_image_ids:
            raise RuntimeError("download failed")

        return DownloadedImage(
            image=image,
            data=f"encoded-image-bytes:{image.id}".encode(),
        )


def make_batch_loader(
    batches: FakeBatchRepository | MissingBatchRepository | None = None,
    images: FakeImageRepository | None = None,
) -> BatchLoader:
    loader = BatchLoader(MagicMock())
    loader.batches = batches or FakeBatchRepository()
    loader.images = images or FakeImageRepository()
    return loader


def make_image(image_id: str, object_key: str | None = None) -> Image:
    return Image(
        id=image_id,
        batch_id="session-1",
        file_name=f"{image_id}.jpg",
        mime_type="image/jpeg",
        size_bytes=1024,
        object_key=object_key or f"batches/session-1/{image_id}.jpg",
        status=ImageUploadStatus.UPLOADED,
        created_at=datetime(2026, 1, 1),
        uploaded_at=datetime(2026, 1, 1),
    )


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
                    name=PROCESS_UPLOAD_SESSION_JOB_NAME,
                    data={
                        "message": "hello from test",
                        "sessionId": "session-1",
                    },
                ),
                "token",
            )
        )

        self.assertEqual(result, {"ok": True})
        self.assertEqual(worker.settings.queue_name, "image-processing")
        self.assertEqual(
            pipeline.messages,
            [{"message": "hello from test", "sessionId": "session-1"}],
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
                            "sessionId": "session-1",
                        },
                    ),
                    "token",
                )
            )

    def test_batch_loader_loads_batch_and_images(self) -> None:
        context = make_batch_loader().load("session-1")

        self.assertEqual(context.batch.id, "session-1")
        self.assertEqual(len(context.images), 1)
        self.assertEqual(context.images[0].object_key, "batches/session-1/image-1.jpg")

    def test_batch_loader_raises_when_batch_missing(self) -> None:
        loader = make_batch_loader(batches=MissingBatchRepository())

        with self.assertRaises(BatchNotFoundError):
            loader.load("missing-session")

    def test_image_downloader_downloads_batch_images(self) -> None:
        class FakeStorage:
            def download_bytes(self, object_key: str) -> bytes:
                return f"bytes:{object_key}".encode()

        context = make_batch_loader().load("session-1")
        downloaded = ImageDownloader(FakeStorage()).download_for_batch(context)

        self.assertEqual(len(downloaded), 1)
        self.assertEqual(downloaded[0].image.id, "image-1")
        self.assertEqual(
            downloaded[0].data,
            b"bytes:batches/session-1/image-1.jpg",
        )

    def test_pipeline_scores_downloaded_images_for_blur(self) -> None:
        pipeline = ImageProcessingPipeline.__new__(ImageProcessingPipeline)
        pipeline.batch_loader = FakeBatchLoader()
        pipeline.image_downloader = FakeImageDownloader()

        with patch(
            "image_processor.processor.pipeline.calculate_blur_score_from_bytes",
            return_value=BlurScoreResult(
                score=42.0,
                threshold=100.0,
                is_blurry=True,
                width=10,
                height=10,
            ),
        ) as score_blur:
            with redirect_stdout(StringIO()) as output:
                pipeline.process({"sessionId": "session-1"})

        score_blur.assert_called_once_with(b"encoded-image-bytes:image-1")
        self.assertIn("image=image-1 blur_score=42.00", output.getvalue())

    def test_pipeline_continues_when_one_image_fails(self) -> None:
        pipeline = ImageProcessingPipeline.__new__(ImageProcessingPipeline)
        pipeline.batch_loader = FakeBatchLoader(
            images=[
                make_image("image-1"),
                make_image("image-2"),
                make_image("image-3"),
            ]
        )
        pipeline.image_downloader = FakeImageDownloader(
            failing_image_ids={"image-2"}
        )

        with patch(
            "image_processor.processor.pipeline.calculate_blur_score_from_bytes",
            return_value=BlurScoreResult(
                score=42.0,
                threshold=100.0,
                is_blurry=True,
                width=10,
                height=10,
            ),
        ) as score_blur:
            with redirect_stdout(StringIO()) as output:
                pipeline.process({"sessionId": "session-1"})

        self.assertEqual(score_blur.call_count, 2)
        summary = output.getvalue()
        self.assertIn("image=image-1 blur_score=42.00", summary)
        self.assertIn("image=image-3 blur_score=42.00", summary)
        self.assertNotIn("image=image-2", summary)


if __name__ == "__main__":
    unittest.main()
