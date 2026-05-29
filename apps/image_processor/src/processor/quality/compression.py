from __future__ import annotations

from dataclasses import dataclass
from typing import Annotated, Sequence


DEFAULT_BLOCK_SIZE = 8
DEFAULT_BLOCKINESS_THRESHOLD = 0.06


@dataclass(frozen=True)
class CompressionScoreResult:
    score: Annotated[
        float,
        "Normalized compression quality score from 0.0 to 1.0; higher is better.",
    ]
    blockiness_score: Annotated[
        float,
        "Normalized excess edge strength at JPEG-style block boundaries.",
    ]
    has_compression_artifacts: Annotated[
        bool,
        "True when block boundary artifacts exceed the configured threshold.",
    ]


def calculate_compression_score_from_pixels(
    grayscale_pixels: Sequence[int],
    *,
    width: int,
    height: int,
    block_size: int = DEFAULT_BLOCK_SIZE,
    blockiness_threshold: float = DEFAULT_BLOCKINESS_THRESHOLD,
) -> CompressionScoreResult:
    """Estimate JPEG-style compression artifacts from 8-bit grayscale pixels."""
    if width < 2 or height < 2:
        raise ValueError("compression score requires an image at least 2x2 pixels")
    if block_size < 2:
        raise ValueError("block_size must be at least 2 pixels")
    if blockiness_threshold < 0.0 or blockiness_threshold > 1.0:
        raise ValueError("blockiness_threshold must be between 0.0 and 1.0")

    expected_pixels = width * height
    if len(grayscale_pixels) != expected_pixels:
        raise ValueError(
            f"expected {expected_pixels} pixels for {width}x{height}, "
            f"got {len(grayscale_pixels)}"
        )

    boundary_diffs: list[int] = []
    interior_diffs: list[int] = []

    for y in range(height):
        row_offset = y * width
        for x in range(1, width):
            diff = abs(
                grayscale_pixels[row_offset + x]
                - grayscale_pixels[row_offset + x - 1]
            )
            if x % block_size == 0:
                boundary_diffs.append(diff)
            else:
                interior_diffs.append(diff)

    for y in range(1, height):
        row_offset = y * width
        previous_row_offset = (y - 1) * width
        for x in range(width):
            diff = abs(
                grayscale_pixels[row_offset + x]
                - grayscale_pixels[previous_row_offset + x]
            )
            if y % block_size == 0:
                boundary_diffs.append(diff)
            else:
                interior_diffs.append(diff)

    boundary_mean = _mean(boundary_diffs)
    interior_mean = _mean(interior_diffs)
    blockiness_score = max(0.0, boundary_mean - interior_mean) / 255.0
    score = max(0.0, 1.0 - (blockiness_score / max(blockiness_threshold, 0.001)))

    return CompressionScoreResult(
        score=score,
        blockiness_score=blockiness_score,
        has_compression_artifacts=blockiness_score >= blockiness_threshold,
    )


def _mean(values: Sequence[int]) -> float:
    if not values:
        return 0.0

    return sum(values) / len(values)
