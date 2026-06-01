from datetime import UTC, datetime

from sqlalchemy import select
from sqlalchemy.orm import sessionmaker

from image_processor.db.models import Collection, CollectionStatus
from image_processor.db.session import session_scope


class CollectionRepository:
    def __init__(self, session_factory: sessionmaker) -> None:
        self.session_factory = session_factory

    def get_by_id(self, collection_id: str) -> Collection | None:
        with session_scope(self.session_factory) as session:
            return session.scalar(select(Collection).where(Collection.id == collection_id))

    def update_status(self, collection_id: str, status: CollectionStatus) -> None:
        with self.session_factory.begin() as session:
            collection = session.scalar(select(Collection).where(Collection.id == collection_id))

            if collection is None:
                return

            collection.status = status
            collection.updated_at = datetime.now(UTC)
