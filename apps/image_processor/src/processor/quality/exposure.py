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


def calculate_exposure_score_from_pixels(
    grayscale_pixels: Sequence[int],
    *,
    width: int,
    height: int,
    dark_pixel_threshold: int = DEFAULT_DARK_PIXEL_THRESHOLD,
    bright_pixel_threshold: int = DEFAULT_BRIGHT_PIXEL_THRESHOLD,
    low_exposure_threshold: float = DEFAULT_LOW_EXPOSURE_THRESHOLD,
    high_exposure_threshold: float = DEFAULT_HIGH_EXPOSURE_THRESHOLD,
    clipped_pixel_ratio: float = DEFAULT_CLIPPED_PIXEL_RATIO,
) -> ExposureScoreResult:
    """Calculate a normalized exposure quality score from 8-bit grayscale pixels."""
    if width < 1 or height < 1:
        raise ValueError("exposure score requires an image at least 1x1 pixels")
    if dark_pixel_threshold < 0 or dark_pixel_threshold > 255:
        raise ValueError("dark_pixel_threshold must be between 0 and 255")
    if bright_pixel_threshold < 0 or bright_pixel_threshold > 255:
        raise ValueError("bright_pixel_threshold must be between 0 and 255")
    if low_exposure_threshold < 0.0 or low_exposure_threshold > 1.0:
        raise ValueError("low_exposure_threshold must be between 0.0 and 1.0")
    if high_exposure_threshold < 0.0 or high_exposure_threshold > 1.0:
        raise ValueError("high_exposure_threshold must be between 0.0 and 1.0")
    if clipped_pixel_ratio < 0.0 or clipped_pixel_ratio > 1.0:
        raise ValueError("clipped_pixel_ratio must be between 0.0 and 1.0")

    expected_pixels = width * height
    if len(grayscale_pixels) != expected_pixels:
        raise ValueError(
            f"expected {expected_pixels} pixels for {width}x{height}, "
            f"got {len(grayscale_pixels)}"
        )

    pixel_count = len(grayscale_pixels)
    mean_luminance = sum(grayscale_pixels) / pixel_count / 255.0
    dark_pixel_ratio = (
        sum(pixel <= dark_pixel_threshold for pixel in grayscale_pixels)
        / pixel_count
    )
    bright_pixel_ratio = (
        sum(pixel >= bright_pixel_threshold for pixel in grayscale_pixels)
        / pixel_count
    )

    distance_from_balanced = abs(mean_luminance - 0.5) / 0.5
    clipping_penalty = max(dark_pixel_ratio, bright_pixel_ratio)
    score = max(0.0, 1.0 - (distance_from_balanced * 0.75) - (clipping_penalty * 0.25))

    is_low_exposure = (
        mean_luminance < low_exposure_threshold
        or dark_pixel_ratio >= clipped_pixel_ratio
    )
    is_high_exposure = (
        mean_luminance > high_exposure_threshold
        or bright_pixel_ratio >= clipped_pixel_ratio
    )

    return ExposureScoreResult(
        score=score,
        mean_luminance=mean_luminance,
        dark_pixel_ratio=dark_pixel_ratio,
        bright_pixel_ratio=bright_pixel_ratio,
        is_low_exposure=is_low_exposure,
        is_high_exposure=is_high_exposure,
    )
