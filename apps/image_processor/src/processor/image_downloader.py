from dataclasses import dataclass
from typing import Protocol

from image_processor.db.models import Image
from image_processor.processor.batch_loader import BatchContext


class ObjectStorage(Protocol):
    def download_bytes(self, object_key: str) -> bytes:
        pass


@dataclass(frozen=True)
class DownloadedImage:
    image: Image
    data: bytes


class ImageDownloader:
    def __init__(self, storage: ObjectStorage) -> None:
        self.storage = storage

    def download_for_batch(self, context: BatchContext) -> list[DownloadedImage]:
        return [
            DownloadedImage(
                image=image,
                data=self.storage.download_bytes(image.object_key),
            )
            for image in context.images
        ]
