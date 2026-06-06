from datetime import UTC, datetime
from uuid import uuid4

from sqlalchemy import select
from sqlalchemy.orm import Session, sessionmaker

from image_processor.db.models import ImageEmbedding
from image_processor.processor.similarity import ImageEmbeddingResult


class ImageEmbeddingRepository:
    def __init__(self, session_factory: sessionmaker) -> None:
        self.session_factory = session_factory

    def upsert_success(self, image_id: str, result: ImageEmbeddingResult) -> None:
        now = datetime.now(UTC)

        with self.session_factory.begin() as session:
            embedding = self._get_by_image_id(session, image_id)

            if embedding is None:
                embedding = ImageEmbedding(
                    id=str(uuid4()),
                    image_id=image_id,
                    created_at=now,
                    updated_at=now,
                )
                session.add(embedding)

            embedding.model = result.model
            embedding.version = result.version
            embedding.dimension = result.dimension
            embedding.vector = result.vector
            embedding.vector_ref = None
            embedding.embedding_error = None
            embedding.raw = result.raw
            embedding.embedded_at = now
            embedding.updated_at = now

    def upsert_failure(
        self,
        image_id: str,
        error: str,
        *,
        model: str,
        version: str | None,
        dimension: int,
    ) -> None:
        now = datetime.now(UTC)

        with self.session_factory.begin() as session:
            embedding = self._get_by_image_id(session, image_id)

            if embedding is None:
                embedding = ImageEmbedding(
                    id=str(uuid4()),
                    image_id=image_id,
                    created_at=now,
                    updated_at=now,
                )
                session.add(embedding)

            embedding.model = model
            embedding.version = version
            embedding.dimension = dimension
            embedding.vector = None
            embedding.vector_ref = None
            embedding.embedding_error = error
            embedding.raw = None
            embedding.embedded_at = None
            embedding.updated_at = now

    def list_successful_vectors(
        self,
        image_ids: list[str],
    ) -> dict[str, list[float]]:
        if not image_ids:
            return {}

        with self.session_factory() as session:
            rows = session.execute(
                select(ImageEmbedding.image_id, ImageEmbedding.vector).where(
                    ImageEmbedding.image_id.in_(image_ids),
                    ImageEmbedding.vector.is_not(None),
                    ImageEmbedding.embedding_error.is_(None),
                    ImageEmbedding.embedded_at.is_not(None),
                )
            ).all()

        return {
            image_id: vector
            for image_id, vector in rows
            if vector is not None
        }

    def _get_by_image_id(
        self,
        session: Session,
        image_id: str,
    ) -> ImageEmbedding | None:
        return session.scalar(
            select(ImageEmbedding).where(ImageEmbedding.image_id == image_id)
        )
