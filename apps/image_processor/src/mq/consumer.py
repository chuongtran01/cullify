import asyncio
import signal
from collections.abc import Callable
from typing import Any, cast

from bullmq import Worker as BullMQWorker

from image_processor.config import WorkerSettings
from image_processor.db.session import create_session_factory
from image_processor.mq.message_types import (
    PROCESS_UPLOAD_SESSION_JOB_NAME,
    BullMQJob,
    ProcessUploadSessionJobData,
)
from image_processor.processor.pipeline import ImageProcessingPipeline


BullMQWorkerFactory = Callable[[str, Callable[..., Any], dict[str, Any]], Any]


class ImageWorker:
    def __init__(
        self,
        settings: WorkerSettings,
        pipeline: ImageProcessingPipeline | None = None,
        worker_factory: BullMQWorkerFactory = BullMQWorker,
    ) -> None:
        self.settings = settings
        if pipeline is None:
            session_factory = create_session_factory(settings.database_url)
            pipeline = ImageProcessingPipeline(session_factory, settings)

        self.pipeline = pipeline
        self.worker_factory = worker_factory

    async def process_job(self, job: BullMQJob, job_token: str) -> dict[str, bool]:
        if job.name != PROCESS_UPLOAD_SESSION_JOB_NAME:
            raise ValueError(f"Unsupported image-processing job type: {job.name}")

        data = cast(ProcessUploadSessionJobData, job.data)
        self.pipeline.process(data)

        return {"ok": True}

    async def run(self) -> None:
        """Run the BullMQ consumer until the process receives a shutdown signal."""
        shutdown_event = asyncio.Event()

        def handle_shutdown(*_: object) -> None:
            print("Signal received, shutting down image worker.", flush=True)
            shutdown_event.set()

        signal.signal(signal.SIGTERM, handle_shutdown)
        signal.signal(signal.SIGINT, handle_shutdown)

        worker = self.worker_factory(
            self.settings.queue_name,
            self.process_job,
            {"connection": self.settings.redis_url},
        )

        print(
            "Cullify image worker placeholder ready "
            f"for queue '{self.settings.queue_name}'.",
            flush=True,
        )

        try:
            await shutdown_event.wait()
        finally:
            print("Cleaning up image worker...", flush=True)
            await worker.close()
            print("Image worker shut down successfully.", flush=True)
