from typing import Any

from cullify_worker.jobs import ProcessUploadSessionJobData


class ImageProcessingPipeline:
    def process(self, data: ProcessUploadSessionJobData) -> None:
        """Placeholder for the future image-processing workflow."""
        print(
            f"Image processing pipeline received message: {data}", flush=True)
