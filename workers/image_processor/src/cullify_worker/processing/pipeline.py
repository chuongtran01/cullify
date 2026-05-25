from typing import Any


class ImageProcessingPipeline:
    def process(self, message: dict[str, Any]) -> None:
        """Placeholder for the future image-processing workflow."""
        print(f"Image processing pipeline received message: {message}", flush=True)
