from sqlalchemy import select
from sqlalchemy.orm import sessionmaker

from image_processor.db.models import Batch
from image_processor.db.session import session_scope


class BatchRepository:
    def __init__(self, session_factory: sessionmaker) -> None:
        self.session_factory = session_factory

    def get_by_id(self, batch_id: str) -> Batch | None:
        with session_scope(self.session_factory) as session:
            return session.scalar(select(Batch).where(Batch.id == batch_id))
