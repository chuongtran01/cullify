from datetime import datetime
from typing import TYPE_CHECKING, Any

from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Index, Uuid
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from image_processor.db.models.base import Base

if TYPE_CHECKING:
    from image_processor.db.models.image import Image


class ImageQualityAnalysis(Base):
    __tablename__ = "ImageQualityAnalysis"
    __table_args__ = (Index("ImageQualityAnalysis_analyzedAt_idx", "analyzedAt"),)

    id: Mapped[str] = mapped_column(Uuid(as_uuid=False), primary_key=True)
    image_id: Mapped[str] = mapped_column(
        "imageId",
        Uuid(as_uuid=False),
        ForeignKey("Image.id", ondelete="CASCADE"),
        unique=True,
    )
    blur_score: Mapped[float | None] = mapped_column("blurScore", Float, nullable=True)
    focus_score: Mapped[float | None] = mapped_column("focusScore", Float, nullable=True)
    motion_blur_score: Mapped[float | None] = mapped_column(
        "motionBlurScore",
        Float,
        nullable=True,
    )
    eye_closed_score: Mapped[float | None] = mapped_column(
        "eyeClosedScore",
        Float,
        nullable=True,
    )
    exposure_score: Mapped[float | None] = mapped_column(
        "exposureScore",
        Float,
        nullable=True,
    )
    compression_score: Mapped[float | None] = mapped_column(
        "compressionScore",
        Float,
        nullable=True,
    )
    overall_quality_score: Mapped[float | None] = mapped_column(
        "overallQualityScore",
        Float,
        nullable=True,
    )
    is_blurry: Mapped[bool] = mapped_column("isBlurry", Boolean, default=False)
    is_out_of_focus: Mapped[bool] = mapped_column("isOutOfFocus", Boolean, default=False)
    has_motion_blur: Mapped[bool] = mapped_column("hasMotionBlur", Boolean, default=False)
    has_eyes_closed: Mapped[bool] = mapped_column("hasEyesClosed", Boolean, default=False)
    is_low_exposure: Mapped[bool] = mapped_column("isLowExposure", Boolean, default=False)
    has_compression_artifacts: Mapped[bool] = mapped_column(
        "hasCompressionArtifacts",
        Boolean,
        default=False,
    )
    flags: Mapped[dict[str, Any] | list[Any] | None] = mapped_column(
        JSONB,
        nullable=True,
    )
    raw: Mapped[dict[str, Any] | list[Any] | None] = mapped_column(JSONB, nullable=True)
    analyzed_at: Mapped[datetime | None] = mapped_column(
        "analyzedAt",
        DateTime(timezone=True),
        nullable=True,
    )
    created_at: Mapped[datetime] = mapped_column("createdAt", DateTime(timezone=True))
    updated_at: Mapped[datetime] = mapped_column("updatedAt", DateTime(timezone=True))

    image: Mapped["Image"] = relationship(back_populates="quality_analysis")
