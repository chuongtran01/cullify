from datetime import datetime
from typing import TYPE_CHECKING, Any

from sqlalchemy import DateTime, ForeignKey, Index, Integer, String, Uuid
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from image_processor.db.models.base import Base
from image_processor.db.models.vector import PgVector

if TYPE_CHECKING:
    from image_processor.db.models.image import Image


class ImageEmbedding(Base):
    __tablename__ = "image_embedding"
    __table_args__ = (
        Index("image_embedding_model_idx", "model"),
        Index("image_embedding_embedded_at_idx", "embedded_at"),
    )

    id: Mapped[str] = mapped_column(Uuid(as_uuid=False), primary_key=True)
    image_id: Mapped[str] = mapped_column(
        "image_id",
        Uuid(as_uuid=False),
        ForeignKey("image.id", ondelete="CASCADE"),
        unique=True,
    )
    model: Mapped[str] = mapped_column("model", String)
    version: Mapped[str | None] = mapped_column("version", String, nullable=True)
    dimension: Mapped[int] = mapped_column("dimension", Integer)
    vector: Mapped[list[float] | None] = mapped_column(
        "vector",
        PgVector(512),
        nullable=True,
    )
    vector_ref: Mapped[str | None] = mapped_column(
        "vector_ref",
        String,
        nullable=True,
    )
    embedding_error: Mapped[str | None] = mapped_column(
        "embedding_error",
        String,
        nullable=True,
    )
    raw: Mapped[dict[str, Any] | list[Any] | None] = mapped_column(
        JSONB,
        nullable=True,
    )
    embedded_at: Mapped[datetime | None] = mapped_column(
        "embedded_at",
        DateTime(timezone=True),
        nullable=True,
    )
    created_at: Mapped[datetime] = mapped_column("created_at", DateTime(timezone=True))
    updated_at: Mapped[datetime] = mapped_column("updated_at", DateTime(timezone=True))

    image: Mapped["Image"] = relationship(back_populates="embedding")
