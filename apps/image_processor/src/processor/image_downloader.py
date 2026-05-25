from dataclasses import dataclass
from typing import Annotated, Protocol

from image_processor.db.models import Image
from image_processor.processor.batch_loader import BatchContext


class ObjectStorage(Protocol):
    def download_bytes(self, object_key: str) -> bytes:
        pass


@dataclass(frozen=True)
class DownloadedImage:
    image: Annotated[Image, "Database image record associated with the bytes."]
    data: Annotated[bytes, "Downloaded encoded image bytes."]


class ImageDownloader:
    def __init__(self, storage: ObjectStorage) -> None:
        self.storage = storage

    def download(self, image: Image) -> DownloadedImage:
        return DownloadedImage(
            image=image,
            data=self.storage.download_bytes(image.object_key),
        )

    def download_for_batch(self, context: BatchContext) -> list[DownloadedImage]:
        return [self.download(image) for image in context.images]
