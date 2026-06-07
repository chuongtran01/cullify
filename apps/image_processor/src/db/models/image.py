from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, Enum, ForeignKey, Index, Integer, String, Uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship

from image_processor.db.models.base import Base
from image_processor.db.models.enums import ImageUploadStatus

if TYPE_CHECKING:
    from image_processor.db.models.collection import Collection
    from image_processor.db.models.collection_image_review import CollectionImageReview
    from image_processor.db.models.image_embedding import ImageEmbedding
    from image_processor.db.models.image_group import ImageGroup
    from image_processor.db.models.image_quality_analysis import ImageQualityAnalysis


class Image(Base):
    __tablename__ = "image"
    __table_args__ = (
        Index("image_collection_id_idx", "collection_id"),
        Index("image_group_id_idx", "group_id"),
        Index("image_status_idx", "status"),
    )

    id: Mapped[str] = mapped_column(Uuid(as_uuid=False), primary_key=True)
    collection_id: Mapped[str] = mapped_column(
        "collection_id",
        Uuid(as_uuid=False),
        ForeignKey("collection.id", ondelete="CASCADE"),
    )
    group_id: Mapped[str | None] = mapped_column(
        "group_id",
        Uuid(as_uuid=False),
        ForeignKey("image_group.id", ondelete="SET NULL"),
        nullable=True,
    )
    file_name: Mapped[str] = mapped_column("file_name", String)
    mime_type: Mapped[str] = mapped_column("mime_type", String)
    size_bytes: Mapped[int] = mapped_column("size_bytes", Integer)
    object_key: Mapped[str] = mapped_column("object_key", String, unique=True)
    status: Mapped[ImageUploadStatus] = mapped_column(
        Enum(
            ImageUploadStatus,
            name="ImageUploadStatus",
            native_enum=True,
            create_type=False,
        ),
        default=ImageUploadStatus.PENDING,
    )
    created_at: Mapped[datetime] = mapped_column("created_at", DateTime(timezone=True))
    uploaded_at: Mapped[datetime | None] = mapped_column(
        "uploaded_at",
        DateTime(timezone=True),
        nullable=True,
    )

    collection: Mapped["Collection"] = relationship(back_populates="images")
    quality_analysis: Mapped["ImageQualityAnalysis | None"] = relationship(
        back_populates="image",
        uselist=False,
        cascade="all, delete-orphan",
    )
    embedding: Mapped["ImageEmbedding | None"] = relationship(
        back_populates="image",
        uselist=False,
        cascade="all, delete-orphan",
    )
    group: Mapped["ImageGroup | None"] = relationship(
        back_populates="images",
    )
    review: Mapped["CollectionImageReview | None"] = relationship(
        back_populates="image",
        uselist=False,
        cascade="all, delete-orphan",
    )
