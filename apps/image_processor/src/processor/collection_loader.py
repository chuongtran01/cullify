from dataclasses import dataclass
from typing import Annotated

from sqlalchemy.orm import sessionmaker

from image_processor.db.models import Collection, Image
from image_processor.db.repositories import CollectionRepository, ImageRepository


@dataclass(frozen=True)
class CollectionContext:
    collection: Annotated[Collection, "Collection record loaded for the upload collection."]
    images: Annotated[list[Image], "Uploaded images belonging to the collection."]


class CollectionNotFoundError(ValueError):
    pass


class CollectionLoader:
    def __init__(self, session_factory: sessionmaker) -> None:
        self.collections = CollectionRepository(session_factory)
        self.images = ImageRepository(session_factory)

    def load(self, collection_id: str) -> CollectionContext:
        collection = self.collections.get_by_id(collection_id)

        if collection is None:
            raise CollectionNotFoundError(f"Collection not found: {collection_id}")

        images = self.images.list_uploaded_for_collection(collection_id)
        return CollectionContext(collection=collection, images=images)
