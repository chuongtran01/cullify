from dataclasses import dataclass
from io import BytesIO

from image_processor.processor.quality.blur import (
    DEFAULT_MAX_DIMENSION,
    BlurScoreResult,
    calculate_blur_score_from_pixels,
)
from image_processor.processor.quality.exposure import (
    ExposureScoreResult,
    calculate_exposure_score_from_pixels,
)


@dataclass(frozen=True)
class ImageQualityResult:
    blur_score: float
    is_blurry: bool
    exposure_score: float
    mean_luminance: float
    dark_pixel_ratio: float
    bright_pixel_ratio: float
    is_low_exposure: bool
    is_high_exposure: bool
    width: int
    height: int


class ImageQualityAnalyzer:
    def __init__(self, max_dimension: int = DEFAULT_MAX_DIMENSION) -> None:
        if max_dimension < 3:
            raise ValueError("max_dimension must be at least 3 pixels")

        self.max_dimension = max_dimension

    def analyze(self, image_bytes: bytes) -> ImageQualityResult:
        pixels, width, height = self._load_grayscale_pixels(image_bytes)
        blur_result = calculate_blur_score_from_pixels(
            pixels,
            width=width,
            height=height,
        )
        exposure_result = calculate_exposure_score_from_pixels(
            pixels,
            width=width,
            height=height,
        )
        return self._to_quality_result(
            blur_result,
            exposure_result,
            width=width,
            height=height,
        )

    def _load_grayscale_pixels(self, image_bytes: bytes) -> tuple[list[int], int, int]:
        try:
            from PIL import Image
        except ImportError as exc:
            raise RuntimeError(
                "Pillow is required to analyze image quality from image bytes. "
                "Install the image processor dependencies first."
            ) from exc

        with Image.open(BytesIO(image_bytes)) as image:
            grayscale = image.convert("L")
            grayscale.thumbnail((self.max_dimension, self.max_dimension))
            width, height = grayscale.size
            pixels = list(grayscale.getdata())

        return pixels, width, height

    def _to_quality_result(
        self,
        blur_result: BlurScoreResult,
        exposure_result: ExposureScoreResult,
        *,
        width: int,
        height: int,
    ) -> ImageQualityResult:
        return ImageQualityResult(
            blur_score=blur_result.score,
            is_blurry=blur_result.is_blurry,
            exposure_score=exposure_result.score,
            mean_luminance=exposure_result.mean_luminance,
            dark_pixel_ratio=exposure_result.dark_pixel_ratio,
            bright_pixel_ratio=exposure_result.bright_pixel_ratio,
            is_low_exposure=exposure_result.is_low_exposure,
            is_high_exposure=exposure_result.is_high_exposure,
            width=width,
            height=height,
        )
