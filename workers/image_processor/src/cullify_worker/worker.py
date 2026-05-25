from cullify_worker.config import WorkerSettings
from cullify_worker.processing.pipeline import ImageProcessingPipeline


class ImageWorker:
    def __init__(
        self,
        settings: WorkerSettings,
        pipeline: ImageProcessingPipeline | None = None,
    ) -> None:
        self.settings = settings
        self.pipeline = pipeline or ImageProcessingPipeline()

    def run(self) -> None:
        """Start the worker placeholder.

        Queue consumption and image processing will be added when the job
        contract is defined.
        """
        print(
            "Cullify image worker placeholder ready "
            f"for queue '{self.settings.queue_name}'."
        )

