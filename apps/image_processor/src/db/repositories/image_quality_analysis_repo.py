from datetime import UTC, datetime
from uuid import uuid4

from sqlalchemy import select
from sqlalchemy.orm import Session, sessionmaker

from image_processor.db.models import ImageQualityAnalysis
from image_processor.processor.quality import ImageQualityResult


class ImageQualityAnalysisRepository:
    def __init__(self, session_factory: sessionmaker) -> None:
        self.session_factory = session_factory

    def upsert_success(self, image_id: str, result: ImageQualityResult) -> None:
        now = datetime.now(UTC)

        with self.session_factory.begin() as session:
            analysis = self._get_by_image_id(session, image_id)

            if analysis is None:
                analysis = ImageQualityAnalysis(
                    id=str(uuid4()),
                    image_id=image_id,
                    created_at=now,
                    updated_at=now,
                )
                session.add(analysis)

            analysis.blur_score = result.blur_score
            analysis.exposure_score = result.exposure_score
            analysis.compression_score = result.compression_score
            analysis.overall_quality_score = None
            analysis.is_blurry = result.is_blurry
            analysis.is_low_exposure = result.is_low_exposure
            analysis.is_high_exposure = result.is_high_exposure
            analysis.has_compression_artifacts = result.has_compression_artifacts
            analysis.analysis_error = None
            analysis.raw = {
                "meanLuminance": result.mean_luminance,
                "darkPixelRatio": result.dark_pixel_ratio,
                "brightPixelRatio": result.bright_pixel_ratio,
                "blockinessScore": result.blockiness_score,
                "width": result.width,
                "height": result.height,
            }
            analysis.analyzed_at = now
            analysis.updated_at = now

    def upsert_failure(self, image_id: str, error: str) -> None:
        now = datetime.now(UTC)

        with self.session_factory.begin() as session:
            analysis = self._get_by_image_id(session, image_id)

            if analysis is None:
                analysis = ImageQualityAnalysis(
                    id=str(uuid4()),
                    image_id=image_id,
                    created_at=now,
                    updated_at=now,
                )
                session.add(analysis)

            analysis.blur_score = None
            analysis.exposure_score = None
            analysis.compression_score = None
            analysis.overall_quality_score = None
            analysis.is_blurry = False
            analysis.is_low_exposure = False
            analysis.is_high_exposure = False
            analysis.has_compression_artifacts = False
            analysis.analysis_error = error
            analysis.raw = None
            analysis.analyzed_at = now
            analysis.updated_at = now

    def _get_by_image_id(
        self,
        session: Session,
        image_id: str,
    ) -> ImageQualityAnalysis | None:
        return session.scalar(
            select(ImageQualityAnalysis).where(
                ImageQualityAnalysis.image_id == image_id,
            )
        )
