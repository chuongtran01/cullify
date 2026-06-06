from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, ForeignKey, Index, Integer, Uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship

from image_processor.db.models.base import Base

if TYPE_CHECKING:
    from image_processor.db.models.collection import Collection
    from image_processor.db.models.group_image import GroupImage
    from image_processor.db.models.image import Image


class ImageGroup(Base):
    __tablename__ = "image_group"
    __table_args__ = (
        Index("image_group_collection_id_idx", "collection_id"),
        Index("image_group_representative_image_id_idx", "representative_image_id"),
    )

    id: Mapped[str] = mapped_column(Uuid(as_uuid=False), primary_key=True)
    collection_id: Mapped[str] = mapped_column(
        "collection_id",
        Uuid(as_uuid=False),
        ForeignKey("collection.id", ondelete="CASCADE"),
    )
    representative_image_id: Mapped[str | None] = mapped_column(
        "representative_image_id",
        Uuid(as_uuid=False),
        ForeignKey("image.id", ondelete="SET NULL"),
        nullable=True,
    )
    image_count: Mapped[int] = mapped_column("image_count", Integer)
    created_at: Mapped[datetime] = mapped_column("created_at", DateTime(timezone=True))
    updated_at: Mapped[datetime] = mapped_column("updated_at", DateTime(timezone=True))

    collection: Mapped["Collection"] = relationship(back_populates="groups")
    representative_image: Mapped["Image | None"] = relationship(
        back_populates="representative_for_groups",
    )
    images: Mapped[list["GroupImage"]] = relationship(
        back_populates="group",
        cascade="all, delete-orphan",
    )
