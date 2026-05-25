import asyncio
import unittest
from dataclasses import dataclass
from typing import Any

from cullify_worker.config import WorkerSettings
from cullify_worker.processing.pipeline import ImageProcessingPipeline
from cullify_worker.worker import ImageWorker


@dataclass(frozen=True)
class FakeJob:
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
            worker.process_job(FakeJob({"message": "hello from test"}), "token")
        )

        self.assertEqual(result, {"ok": True})
        self.assertEqual(worker.settings.queue_name, "image-processing")
        self.assertEqual(pipeline.messages, [{"message": "hello from test"}])

    def test_pipeline_placeholder_prints_message(self) -> None:
        pipeline = ImageProcessingPipeline()

        pipeline.process({"message": "hello"})


if __name__ == "__main__":
    unittest.main()
