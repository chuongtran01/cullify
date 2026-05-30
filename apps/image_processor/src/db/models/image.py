from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, Enum, ForeignKey, Index, Integer, String, Uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship

from image_processor.db.models.base import Base
from image_processor.db.models.enums import ImageUploadStatus

if TYPE_CHECKING:
    from image_processor.db.models.batch import Batch
    from image_processor.db.models.image_quality_analysis import ImageQualityAnalysis


class Image(Base):
    __tablename__ = "image"
    __table_args__ = (
        Index("image_batch_id_idx", "batch_id"),
        Index("image_status_idx", "status"),
    )

    id: Mapped[str] = mapped_column(Uuid(as_uuid=False), primary_key=True)
    batch_id: Mapped[str] = mapped_column(
        "batch_id",
        Uuid(as_uuid=False),
        ForeignKey("batch.id", ondelete="CASCADE"),
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

    batch: Mapped["Batch"] = relationship(back_populates="images")
    quality_analysis: Mapped["ImageQualityAnalysis | None"] = relationship(
        back_populates="image",
        uselist=False,
        cascade="all, delete-orphan",
    )
