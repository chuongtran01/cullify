from __future__ import annotations

from dataclasses import dataclass
from typing import Sequence


DEFAULT_MAX_DIMENSION = 1_000
DEFAULT_DARK_PIXEL_THRESHOLD = 20
DEFAULT_BRIGHT_PIXEL_THRESHOLD = 235
DEFAULT_LOW_EXPOSURE_THRESHOLD = 0.25
DEFAULT_HIGH_EXPOSURE_THRESHOLD = 0.85
DEFAULT_CLIPPED_PIXEL_RATIO = 0.50


@dataclass(frozen=True)
class ExposureScoreResult:
    score: float
    mean_luminance: float
    dark_pixel_ratio: float
    bright_pixel_ratio: float
    is_low_exposure: bool
    is_high_exposure: bool
    width: int
    height: int


def calculate_exposure_score_from_pixels(
    grayscale_pixels: Sequence[int],
    *,
    width: int,
    height: int,
) -> ExposureScoreResult:
    """Calculate a normalized exposure quality score from 8-bit grayscale pixels."""
    if width < 1 or height < 1:
        raise ValueError("exposure score requires an image at least 1x1 pixels")

    expected_pixels = width * height
    if len(grayscale_pixels) != expected_pixels:
        raise ValueError(
            f"expected {expected_pixels} pixels for {width}x{height}, "
            f"got {len(grayscale_pixels)}"
        )

    pixel_count = len(grayscale_pixels)
    mean_luminance = sum(grayscale_pixels) / pixel_count / 255.0
    dark_pixel_ratio = (
        sum(pixel <= DEFAULT_DARK_PIXEL_THRESHOLD for pixel in grayscale_pixels)
        / pixel_count
    )
    bright_pixel_ratio = (
        sum(pixel >= DEFAULT_BRIGHT_PIXEL_THRESHOLD for pixel in grayscale_pixels)
        / pixel_count
    )

    distance_from_balanced = abs(mean_luminance - 0.5) / 0.5
    clipping_penalty = max(dark_pixel_ratio, bright_pixel_ratio)
    score = max(0.0, 1.0 - (distance_from_balanced * 0.75) - (clipping_penalty * 0.25))

    is_low_exposure = (
        mean_luminance < DEFAULT_LOW_EXPOSURE_THRESHOLD
        or dark_pixel_ratio >= DEFAULT_CLIPPED_PIXEL_RATIO
    )
    is_high_exposure = (
        mean_luminance > DEFAULT_HIGH_EXPOSURE_THRESHOLD
        or bright_pixel_ratio >= DEFAULT_CLIPPED_PIXEL_RATIO
    )

    return ExposureScoreResult(
        score=score,
        mean_luminance=mean_luminance,
        dark_pixel_ratio=dark_pixel_ratio,
        bright_pixel_ratio=bright_pixel_ratio,
        is_low_exposure=is_low_exposure,
        is_high_exposure=is_high_exposure,
        width=width,
        height=height,
    )
