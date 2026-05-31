from __future__ import annotations

from dataclasses import dataclass
from typing import Annotated, Sequence


DEFAULT_BLUR_THRESHOLD = 100.0
DEFAULT_MAX_DIMENSION = 1_000


@dataclass(frozen=True)
class BlurScoreResult:
    score: Annotated[
        float,
        "Variance of the Laplacian; higher values indicate a sharper image.",
    ]
    is_blurry: Annotated[
        bool,
        "True when the blur score falls below the configured blur threshold.",
    ]


@dataclass(frozen=True)
class FocusScoreResult:
    score: Annotated[
        float,
        "Tenengrad focus score; higher values indicate a better-focused image.",
    ]
    is_out_of_focus: Annotated[
        bool,
        "True when the focus score falls below the configured focus threshold.",
    ]


@dataclass(frozen=True)
class MotionBlurScoreResult:
    score: Annotated[
        float,
        "Directional blur score; higher values indicate stronger motion blur.",
    ]
    has_motion_blur: Annotated[
        bool,
        "True when directional blur exceeds the configured motion blur threshold.",
    ]


def calculate_blur_score_from_pixels(
    grayscale_pixels: Sequence[int],
    *,
    width: int,
    height: int,
    threshold: float = DEFAULT_BLUR_THRESHOLD,
) -> BlurScoreResult:
    """Calculate blur score from 8-bit grayscale pixels."""
    _validate_grayscale_pixels(grayscale_pixels, width=width, height=height)

    values: list[float] = []

    for y in range(1, height - 1):
        row_offset = y * width
        previous_row_offset = (y - 1) * width
        next_row_offset = (y + 1) * width

        for x in range(1, width - 1):
            center = grayscale_pixels[row_offset + x]
            laplacian = (
                grayscale_pixels[previous_row_offset + x]
                + grayscale_pixels[row_offset + x - 1]
                - 4 * center
                + grayscale_pixels[row_offset + x + 1]
                + grayscale_pixels[next_row_offset + x]
            )
            values.append(float(laplacian))

    mean = sum(values) / len(values)
    variance = sum((value - mean) ** 2 for value in values) / len(values)

    return BlurScoreResult(
        score=variance,
        is_blurry=variance < threshold,
    )


def calculate_focus_score_from_pixels(
    grayscale_pixels: Sequence[int],
    *,
    width: int,
    height: int,
    threshold: float = DEFAULT_BLUR_THRESHOLD,
) -> FocusScoreResult:
    """Calculate a Tenengrad focus score from 8-bit grayscale pixels."""
    _validate_grayscale_pixels(grayscale_pixels, width=width, height=height)

    squared_gradients: list[float] = []

    for y in range(1, height - 1):
        row_offset = y * width
        previous_row_offset = (y - 1) * width
        next_row_offset = (y + 1) * width

        for x in range(1, width - 1):
            gx = (
                -grayscale_pixels[previous_row_offset + x - 1]
                + grayscale_pixels[previous_row_offset + x + 1]
                - 2 * grayscale_pixels[row_offset + x - 1]
                + 2 * grayscale_pixels[row_offset + x + 1]
                - grayscale_pixels[next_row_offset + x - 1]
                + grayscale_pixels[next_row_offset + x + 1]
            )
            gy = (
                grayscale_pixels[previous_row_offset + x - 1]
                + 2 * grayscale_pixels[previous_row_offset + x]
                + grayscale_pixels[previous_row_offset + x + 1]
                - grayscale_pixels[next_row_offset + x - 1]
                - 2 * grayscale_pixels[next_row_offset + x]
                - grayscale_pixels[next_row_offset + x + 1]
            )
            squared_gradients.append(float(gx * gx + gy * gy))

    score = sum(squared_gradients) / len(squared_gradients)

    return FocusScoreResult(
        score=score,
        is_out_of_focus=score < threshold,
    )


def calculate_motion_blur_score_from_pixels(
    grayscale_pixels: Sequence[int],
    *,
    width: int,
    height: int,
    threshold: float = DEFAULT_BLUR_THRESHOLD,
) -> MotionBlurScoreResult:
    """Calculate a directional motion blur score from 8-bit grayscale pixels."""
    _validate_grayscale_pixels(grayscale_pixels, width=width, height=height)

    horizontal_high_frequency = 0.0
    vertical_high_frequency = 0.0

    for y in range(1, height - 1):
        row_offset = y * width
        previous_row_offset = (y - 1) * width
        next_row_offset = (y + 1) * width

        for x in range(1, width - 1):
            center = grayscale_pixels[row_offset + x]
            horizontal_high_frequency += abs(
                grayscale_pixels[row_offset + x - 1]
                - 2 * center
                + grayscale_pixels[row_offset + x + 1]
            )
            vertical_high_frequency += abs(
                grayscale_pixels[previous_row_offset + x]
                - 2 * center
                + grayscale_pixels[next_row_offset + x]
            )

    total_high_frequency = horizontal_high_frequency + vertical_high_frequency
    if total_high_frequency == 0:
        return MotionBlurScoreResult(score=0.0, has_motion_blur=False)

    directional_imbalance = (
        abs(horizontal_high_frequency - vertical_high_frequency)
        / total_high_frequency
    )
    score = directional_imbalance * 200.0

    return MotionBlurScoreResult(
        score=score,
        has_motion_blur=score >= threshold,
    )


def _validate_grayscale_pixels(
    grayscale_pixels: Sequence[int],
    *,
    width: int,
    height: int,
) -> None:
    if width < 3 or height < 3:
        raise ValueError("quality scoring requires an image at least 3x3 pixels")

    expected_pixels = width * height
    if len(grayscale_pixels) != expected_pixels:
        raise ValueError(
            f"expected {expected_pixels} pixels for {width}x{height}, "
            f"got {len(grayscale_pixels)}"
        )
