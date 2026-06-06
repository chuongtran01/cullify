from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, DateTime, Enum, ForeignKey, Index, Uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship

from image_processor.db.models.base import Base
from image_processor.db.models.enums import (
    ReviewDecisionReason,
    ReviewDecisionSource,
)

if TYPE_CHECKING:
    from image_processor.db.models.collection import Collection
    from image_processor.db.models.image import Image


class CollectionImageReview(Base):
    __tablename__ = "collection_image_review"
    __table_args__ = (
        Index("collection_image_review_collection_id_idx", "collection_id"),
        Index("collection_image_review_decision_source_idx", "decision_source"),
        Index("collection_image_review_decision_reason_idx", "decision_reason"),
        Index("collection_image_review_is_selected_idx", "is_selected"),
    )

    id: Mapped[str] = mapped_column(Uuid(as_uuid=False), primary_key=True)
    collection_id: Mapped[str] = mapped_column(
        "collection_id",
        Uuid(as_uuid=False),
        ForeignKey("collection.id", ondelete="CASCADE"),
    )
    image_id: Mapped[str] = mapped_column(
        "image_id",
        Uuid(as_uuid=False),
        ForeignKey("image.id", ondelete="CASCADE"),
        unique=True,
    )
    is_selected: Mapped[bool] = mapped_column(
        "is_selected",
        Boolean,
        default=False,
    )
    decision_source: Mapped[ReviewDecisionSource] = mapped_column(
        "decision_source",
        Enum(
            ReviewDecisionSource,
            name="ReviewDecisionSource",
            native_enum=True,
            create_type=False,
        ),
        default=ReviewDecisionSource.DEFAULT,
    )
    decision_reason: Mapped[ReviewDecisionReason] = mapped_column(
        "decision_reason",
        Enum(
            ReviewDecisionReason,
            name="ReviewDecisionReason",
            native_enum=True,
            create_type=False,
        ),
    )
    reviewed_at: Mapped[datetime | None] = mapped_column(
        "reviewed_at",
        DateTime(timezone=True),
        nullable=True,
    )
    created_at: Mapped[datetime] = mapped_column("created_at", DateTime(timezone=True))
    updated_at: Mapped[datetime] = mapped_column("updated_at", DateTime(timezone=True))

    collection: Mapped["Collection"] = relationship(back_populates="image_reviews")
    image: Mapped["Image"] = relationship(back_populates="review")
