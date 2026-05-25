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


def calculate_blur_score_from_pixels(
    grayscale_pixels: Sequence[int],
    *,
    width: int,
    height: int,
    threshold: float = DEFAULT_BLUR_THRESHOLD,
) -> BlurScoreResult:
    """Calculate blur score from 8-bit grayscale pixels."""
    if width < 3 or height < 3:
        raise ValueError("blur score requires an image at least 3x3 pixels")

    expected_pixels = width * height
    if len(grayscale_pixels) != expected_pixels:
        raise ValueError(
            f"expected {expected_pixels} pixels for {width}x{height}, "
            f"got {len(grayscale_pixels)}"
        )

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
