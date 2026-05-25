import asyncio
import unittest
from dataclasses import dataclass
from typing import Any

from cullify_worker.config import WorkerSettings
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


class WorkerPlaceholderTest(unittest.TestCase):
    def test_worker_processes_job_data(self) -> None:
        settings = WorkerSettings(
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
        pipeline = ImageProcessingPipeline()

        pipeline.process({"message": "hello"})


if __name__ == "__main__":
    unittest.main()
