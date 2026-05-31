from dataclasses import dataclass
from typing import Annotated, Any

from image_processor.processor.quality.blur import (
    DEFAULT_MAX_DIMENSION,
    BlurScoreResult,
    FocusScoreResult,
    MotionBlurScoreResult,
    calculate_blur_score_from_pixels,
    calculate_focus_score_from_pixels,
    calculate_motion_blur_score_from_pixels,
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
        "True when blur, focus, or motion blur checks detect a blurry image.",
    ]
    focus_score: Annotated[
        float,
        "Tenengrad focus score; higher values indicate a better-focused image.",
    ]
    is_out_of_focus: Annotated[
        bool,
        "True when the focus score falls below the configured focus threshold.",
    ]
    motion_blur_score: Annotated[
        float,
        "Directional blur score; higher values indicate stronger motion blur.",
    ]
    has_motion_blur: Annotated[
        bool,
        "True when directional blur exceeds the configured motion blur threshold.",
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

    def analyze_image(self, image: Any) -> ImageQualityResult:
        pixels, width, height = self._load_grayscale_pixels_from_image(image)
        return self._analyze_pixels(pixels, width=width, height=height)

    def _analyze_pixels(
        self,
        pixels: list[int],
        *,
        width: int,
        height: int,
    ) -> ImageQualityResult:
        blur_result = calculate_blur_score_from_pixels(
            pixels,
            width=width,
            height=height,
        )
        focus_result = calculate_focus_score_from_pixels(
            pixels,
            width=width,
            height=height,
        )
        motion_blur_result = calculate_motion_blur_score_from_pixels(
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
            focus_result,
            motion_blur_result,
            exposure_result,
            compression_result,
            width=width,
            height=height,
        )

    def _load_grayscale_pixels_from_image(self, image: Any) -> tuple[list[int], int, int]:
        try:
            from PIL import ImageOps
        except ImportError as exc:
            raise RuntimeError(
                "Pillow is required to analyze image quality from image data. "
                "Install the image processor dependencies first."
            ) from exc

        grayscale = ImageOps.exif_transpose(image).convert("L")
        grayscale.thumbnail((self.max_dimension, self.max_dimension))
        width, height = grayscale.size
        pixels = list(grayscale.getdata())

        return pixels, width, height

    def _to_quality_result(
        self,
        blur_result: BlurScoreResult,
        focus_result: FocusScoreResult,
        motion_blur_result: MotionBlurScoreResult,
        exposure_result: ExposureScoreResult,
        compression_result: CompressionScoreResult,
        *,
        width: int,
        height: int,
    ) -> ImageQualityResult:
        return ImageQualityResult(
            blur_score=blur_result.score,
            is_blurry=(
                blur_result.is_blurry
                or focus_result.is_out_of_focus
                or motion_blur_result.has_motion_blur
            ),
            focus_score=focus_result.score,
            is_out_of_focus=focus_result.is_out_of_focus,
            motion_blur_score=motion_blur_result.score,
            has_motion_blur=motion_blur_result.has_motion_blur,
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
