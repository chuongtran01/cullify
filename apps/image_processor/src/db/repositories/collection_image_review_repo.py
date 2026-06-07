from dataclasses import dataclass
from datetime import UTC, datetime
from uuid import uuid4

from sqlalchemy import select
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.orm import sessionmaker

from image_processor.db.models import (
    CollectionImageReview,
    GroupImage,
    Image,
    ImageGroup,
    ImageQualityAnalysis,
    ImageUploadStatus,
    ReviewDecisionReason,
    ReviewDecisionSource,
)


@dataclass(frozen=True)
class ReviewDefault:
    image_id: str
    is_selected: bool
    decision_reason: ReviewDecisionReason


class CollectionImageReviewRepository:
    def __init__(self, session_factory: sessionmaker) -> None:
        self.session_factory = session_factory

    def create_defaults_for_collection(self, collection_id: str) -> None:
        now = datetime.now(UTC)

        with self.session_factory.begin() as session:
            defaults = [
                self._build_default(row)
                for row in session.execute(
                    select(
                        Image.id,
                        ImageGroup.image_count,
                        ImageQualityAnalysis.is_blurry,
                        ImageQualityAnalysis.is_out_of_focus,
                        ImageQualityAnalysis.has_motion_blur,
                        ImageQualityAnalysis.has_eyes_closed,
                        ImageQualityAnalysis.is_low_exposure,
                        ImageQualityAnalysis.is_high_exposure,
                        ImageQualityAnalysis.has_compression_artifacts,
                        ImageQualityAnalysis.analysis_error,
                    )
                    .outerjoin(GroupImage, GroupImage.image_id == Image.id)
                    .outerjoin(ImageGroup, ImageGroup.id == GroupImage.group_id)
                    .outerjoin(
                        ImageQualityAnalysis,
                        ImageQualityAnalysis.image_id == Image.id,
                    )
                    .where(Image.collection_id == collection_id)
                    .where(Image.status == ImageUploadStatus.UPLOADED)
                )
            ]

            if not defaults:
                return

            statement = insert(CollectionImageReview).values(
                [
                    {
                        "id": str(uuid4()),
                        "collection_id": collection_id,
                        "image_id": default.image_id,
                        "is_selected": default.is_selected,
                        "decision_source": ReviewDecisionSource.DEFAULT,
                        "decision_reason": default.decision_reason,
                        "reviewed_at": None,
                        "created_at": now,
                        "updated_at": now,
                    }
                    for default in defaults
                ]
            )

            session.execute(statement.on_conflict_do_nothing(index_elements=["image_id"]))

    def _build_default(self, row: tuple) -> ReviewDefault:
        (
            image_id,
            group_image_count,
            is_blurry,
            is_out_of_focus,
            has_motion_blur,
            has_eyes_closed,
            is_low_exposure,
            is_high_exposure,
            has_compression_artifacts,
            analysis_error,
        ) = row

        if group_image_count is not None and group_image_count > 1:
            return ReviewDefault(
                image_id=image_id,
                is_selected=False,
                decision_reason=ReviewDecisionReason.SIMILAR_GROUP,
            )

        if any(
            (
                is_blurry,
                is_out_of_focus,
                has_motion_blur,
                has_eyes_closed,
                is_low_exposure,
                is_high_exposure,
                has_compression_artifacts,
                analysis_error,
            )
        ):
            return ReviewDefault(
                image_id=image_id,
                is_selected=False,
                decision_reason=ReviewDecisionReason.LOW_QUALITY,
            )

        return ReviewDefault(
            image_id=image_id,
            is_selected=True,
            decision_reason=ReviewDecisionReason.GOOD_STANDALONE,
        )
