from datetime import datetime
from typing import TYPE_CHECKING, Any

from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Index, String, Uuid
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from image_processor.db.models.base import Base

if TYPE_CHECKING:
    from image_processor.db.models.image import Image


class ImageQualityAnalysis(Base):
    __tablename__ = "image_quality_analysis"
    __table_args__ = (Index("image_quality_analysis_analyzed_at_idx", "analyzed_at"),)

    id: Mapped[str] = mapped_column(Uuid(as_uuid=False), primary_key=True)
    image_id: Mapped[str] = mapped_column(
        "image_id",
        Uuid(as_uuid=False),
        ForeignKey("image.id", ondelete="CASCADE"),
        unique=True,
    )
    blur_score: Mapped[float | None] = mapped_column("blur_score", Float, nullable=True)
    focus_score: Mapped[float | None] = mapped_column("focus_score", Float, nullable=True)
    motion_blur_score: Mapped[float | None] = mapped_column(
        "motion_blur_score",
        Float,
        nullable=True,
    )
    eye_closed_score: Mapped[float | None] = mapped_column(
        "eye_closed_score",
        Float,
        nullable=True,
    )
    exposure_score: Mapped[float | None] = mapped_column(
        "exposure_score",
        Float,
        nullable=True,
    )
    compression_score: Mapped[float | None] = mapped_column(
        "compression_score",
        Float,
        nullable=True,
    )
    overall_quality_score: Mapped[float | None] = mapped_column(
        "overall_quality_score",
        Float,
        nullable=True,
    )
    is_blurry: Mapped[bool] = mapped_column("is_blurry", Boolean, default=False)
    is_out_of_focus: Mapped[bool] = mapped_column("is_out_of_focus", Boolean, default=False)
    has_motion_blur: Mapped[bool] = mapped_column("has_motion_blur", Boolean, default=False)
    has_eyes_closed: Mapped[bool] = mapped_column("has_eyes_closed", Boolean, default=False)
    is_low_exposure: Mapped[bool] = mapped_column("is_low_exposure", Boolean, default=False)
    is_high_exposure: Mapped[bool] = mapped_column(
        "is_high_exposure",
        Boolean,
        default=False,
    )
    has_compression_artifacts: Mapped[bool] = mapped_column(
        "has_compression_artifacts",
        Boolean,
        default=False,
    )
    analysis_error: Mapped[str | None] = mapped_column(
        "analysis_error",
        String,
        nullable=True,
    )
    flags: Mapped[dict[str, Any] | list[Any] | None] = mapped_column(
        JSONB,
        nullable=True,
    )
    raw: Mapped[dict[str, Any] | list[Any] | None] = mapped_column(JSONB, nullable=True)
    analyzed_at: Mapped[datetime | None] = mapped_column(
        "analyzed_at",
        DateTime(timezone=True),
        nullable=True,
    )
    created_at: Mapped[datetime] = mapped_column("created_at", DateTime(timezone=True))
    updated_at: Mapped[datetime] = mapped_column("updated_at", DateTime(timezone=True))

    image: Mapped["Image"] = relationship(back_populates="quality_analysis")
