from datetime import datetime

from sqlalchemy import DateTime, Enum, Uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship

from image_processor.db.models.base import Base
from image_processor.db.models.enums import BatchStatus


class Batch(Base):
    __tablename__ = "Batch"

    id: Mapped[str] = mapped_column(Uuid(as_uuid=False), primary_key=True)
    status: Mapped[BatchStatus] = mapped_column(
        Enum(
            BatchStatus,
            name="BatchStatus",
            native_enum=True,
            create_type=False,
        ),
        default=BatchStatus.UPLOADING,
    )
    created_at: Mapped[datetime] = mapped_column("createdAt", DateTime(timezone=True))
    updated_at: Mapped[datetime] = mapped_column("updatedAt", DateTime(timezone=True))

    images: Mapped[list["Image"]] = relationship(
        back_populates="batch",
        cascade="all, delete-orphan",
    )
