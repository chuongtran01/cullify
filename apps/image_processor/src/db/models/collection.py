from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, Enum, Uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship

from image_processor.db.models.base import Base
from image_processor.db.models.enums import CollectionStatus

if TYPE_CHECKING:
    from image_processor.db.models.image import Image
    from image_processor.db.models.image_group import ImageGroup


class Collection(Base):
    __tablename__ = "collection"

    id: Mapped[str] = mapped_column(Uuid(as_uuid=False), primary_key=True)
    status: Mapped[CollectionStatus] = mapped_column(
        Enum(
            CollectionStatus,
            name="CollectionStatus",
            native_enum=True,
            create_type=False,
        ),
        default=CollectionStatus.UPLOADING,
    )
    created_at: Mapped[datetime] = mapped_column("created_at", DateTime(timezone=True))
    updated_at: Mapped[datetime] = mapped_column("updated_at", DateTime(timezone=True))

    images: Mapped[list["Image"]] = relationship(
        back_populates="collection",
        cascade="all, delete-orphan",
    )
    groups: Mapped[list["ImageGroup"]] = relationship(
        back_populates="collection",
        cascade="all, delete-orphan",
    )
