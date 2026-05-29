from dataclasses import dataclass
from io import BytesIO
from typing import Annotated

from image_processor.processor.quality.blur import (
    DEFAULT_MAX_DIMENSION,
    BlurScoreResult,
    calculate_blur_score_from_pixels,
)
from image_processor.processor.quality.compression import (
    CompressionScoreResult,
    calculate_compression_score_from_pixels,
)
from image_processor.processor.quality.exposure import (
    ExposureScoreResult,
    calculate_exposure_score_from_pixels,
)


@dataclass(frozen=True)
class ImageQualityResult:
    blur_score: Annotated[
        float,
        "Variance of the Laplacian; higher values indicate a sharper image.",
    ]
    is_blurry: Annotated[
        bool,
        "True when the blur score falls below the configured blur threshold.",
    ]
    exposure_score: Annotated[
        float,
        "Normalized exposure quality score from 0.0 to 1.0; higher is better.",
    ]
    mean_luminance: Annotated[
        float,
        "Average grayscale luminance normalized from 0.0 to 1.0.",
    ]
    dark_pixel_ratio: Annotated[
        float,
        "Ratio of pixels at or below the configured dark pixel threshold.",
    ]
    bright_pixel_ratio: Annotated[
        float,
        "Ratio of pixels at or above the configured bright pixel threshold.",
    ]
    is_low_exposure: Annotated[
        bool,
        "True when the image is considered underexposed.",
    ]
    is_high_exposure: Annotated[
        bool,
        "True when the image is considered overexposed.",
    ]
    compression_score: Annotated[
        float,
        "Normalized compression quality score from 0.0 to 1.0; higher is better.",
    ]
    blockiness_score: Annotated[
        float,
        "Normalized excess edge strength at JPEG-style block boundaries.",
    ]
    has_compression_artifacts: Annotated[
        bool,
        "True when compression artifacts are detected.",
    ]
    width: Annotated[
        int,
        "Width in pixels after analyzer downscaling.",
    ]
    height: Annotated[
        int,
        "Height in pixels after analyzer downscaling.",
    ]


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
        compression_result = calculate_compression_score_from_pixels(
            pixels,
            width=width,
            height=height,
        )
        return self._to_quality_result(
            blur_result,
            exposure_result,
            compression_result,
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
        compression_result: CompressionScoreResult,
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
            compression_score=compression_result.score,
            blockiness_score=compression_result.blockiness_score,
            has_compression_artifacts=compression_result.has_compression_artifacts,
            width=width,
            height=height,
        )
