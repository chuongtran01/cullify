from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, ForeignKey, Index, Uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship

from image_processor.db.models.base import Base

if TYPE_CHECKING:
    from image_processor.db.models.image import Image
    from image_processor.db.models.image_group import ImageGroup


class GroupImage(Base):
    __tablename__ = "group_image"
    __table_args__ = (Index("group_image_group_id_idx", "group_id"),)

    id: Mapped[str] = mapped_column(Uuid(as_uuid=False), primary_key=True)
    group_id: Mapped[str] = mapped_column(
        "group_id",
        Uuid(as_uuid=False),
        ForeignKey("image_group.id", ondelete="CASCADE"),
    )
    image_id: Mapped[str] = mapped_column(
        "image_id",
        Uuid(as_uuid=False),
        ForeignKey("image.id", ondelete="CASCADE"),
        unique=True,
    )
    created_at: Mapped[datetime] = mapped_column("created_at", DateTime(timezone=True))

    group: Mapped["ImageGroup"] = relationship(back_populates="images")
    image: Mapped["Image"] = relationship(back_populates="group_membership")
