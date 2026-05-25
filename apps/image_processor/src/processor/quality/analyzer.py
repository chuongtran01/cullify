from dataclasses import dataclass

from image_processor.processor.quality.blur import (
    BlurScoreResult,
    calculate_blur_score_from_bytes,
)


@dataclass(frozen=True)
class ImageQualityResult:
    blur_score: float
    blur_threshold: float
    is_blurry: bool
    width: int
    height: int


class ImageQualityAnalyzer:
    def analyze(self, image_bytes: bytes) -> ImageQualityResult:
        blur_result = calculate_blur_score_from_bytes(image_bytes)
        return self._from_blur_result(blur_result)

    def _from_blur_result(self, blur_result: BlurScoreResult) -> ImageQualityResult:
        return ImageQualityResult(
            blur_score=blur_result.score,
            blur_threshold=blur_result.threshold,
            is_blurry=blur_result.is_blurry,
            width=blur_result.width,
            height=blur_result.height,
        )
