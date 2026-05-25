import asyncio
import unittest
from dataclasses import dataclass
from datetime import datetime
from typing import Any

from cullify_worker.config import WorkerSettings
from cullify_worker.database import BatchRecord, ImageRecord
from cullify_worker.jobs import PROCESS_UPLOAD_SESSION_JOB_NAME
from cullify_worker.processing.pipeline import ImageProcessingPipeline
from cullify_worker.worker import ImageWorker


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


class FakeDatabase:
    def get_batch(self, batch_id: str) -> BatchRecord | None:
        return BatchRecord(
            id=batch_id,
            status="PROCESSING",
            created_at=datetime(2026, 1, 1),
            updated_at=datetime(2026, 1, 1),
        )

    def list_uploaded_images_for_batch(self, batch_id: str) -> list[ImageRecord]:
        return [
            ImageRecord(
                id="image-1",
                batch_id=batch_id,
                file_name="photo.jpg",
                mime_type="image/jpeg",
                size_bytes=1024,
                object_key="batches/session-1/image-1.jpg",
                status="UPLOADED",
                created_at=datetime(2026, 1, 1),
                uploaded_at=datetime(2026, 1, 1),
            )
        ]


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
        worker = ImageWorker(settings=settings)

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

    def test_pipeline_placeholder_prints_message(self) -> None:
        pipeline = ImageProcessingPipeline(FakeDatabase())

        pipeline.process({"message": "hello", "sessionId": "session-1"})


if __name__ == "__main__":
    unittest.main()
