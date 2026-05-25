import unittest

from cullify_worker.config import WorkerSettings
from cullify_worker.processing.pipeline import ImageProcessingPipeline
from cullify_worker.worker import ImageWorker


class WorkerPlaceholderTest(unittest.TestCase):
    def test_worker_can_be_constructed(self) -> None:
        settings = WorkerSettings(
            redis_url="redis://localhost:6379",
            queue_name="image-processing",
            log_level="INFO",
        )

        worker = ImageWorker(settings=settings)

        self.assertEqual(worker.settings.queue_name, "image-processing")

    def test_pipeline_placeholder_is_not_implemented(self) -> None:
        pipeline = ImageProcessingPipeline()

        with self.assertRaises(NotImplementedError):
            pipeline.process("placeholder-job")


if __name__ == "__main__":
    unittest.main()

