from datetime import UTC, datetime

from sqlalchemy import select
from sqlalchemy.orm import sessionmaker

from image_processor.db.models import Batch, BatchStatus
from image_processor.db.session import session_scope


class BatchRepository:
    def __init__(self, session_factory: sessionmaker) -> None:
        self.session_factory = session_factory

    def get_by_id(self, batch_id: str) -> Batch | None:
        with session_scope(self.session_factory) as session:
            return session.scalar(select(Batch).where(Batch.id == batch_id))

    def update_status(self, batch_id: str, status: BatchStatus) -> None:
        with self.session_factory.begin() as session:
            batch = session.scalar(select(Batch).where(Batch.id == batch_id))

            if batch is None:
                return

            batch.status = status
            batch.updated_at = datetime.now(UTC)
