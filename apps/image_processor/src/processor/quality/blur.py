from __future__ import annotations

from dataclasses import dataclass
from io import BytesIO
from pathlib import Path
from typing import Sequence


DEFAULT_BLUR_THRESHOLD = 100.0
DEFAULT_MAX_DIMENSION = 1_000


@dataclass(frozen=True)
class BlurScoreResult:
    score: float
    threshold: float
    is_blurry: bool
    width: int
    height: int


def calculate_blur_score(
    image_path: str | Path,
    *,
    threshold: float = DEFAULT_BLUR_THRESHOLD,
    max_dimension: int = DEFAULT_MAX_DIMENSION,
) -> BlurScoreResult:
    """Calculate image sharpness using variance of the Laplacian.

    Higher scores mean sharper images. Scores below the threshold are treated
    as blurry. The threshold is intentionally configurable because useful
    cutoffs vary by source resolution and camera pipeline.
    """
    try:
        from PIL import Image
    except ImportError as exc:
        raise RuntimeError(
            "Pillow is required to calculate blur scores from image files. "
            "Install the image processor dependencies first."
        ) from exc

    if max_dimension < 3:
        raise ValueError("max_dimension must be at least 3 pixels")

    with Image.open(image_path) as image:
        grayscale = image.convert("L")
        grayscale.thumbnail((max_dimension, max_dimension))
        width, height = grayscale.size
        pixels = list(grayscale.getdata())

    return calculate_blur_score_from_pixels(
        pixels,
        width=width,
        height=height,
        threshold=threshold,
    )


def calculate_blur_score_from_bytes(
    image_bytes: bytes,
    *,
    threshold: float = DEFAULT_BLUR_THRESHOLD,
    max_dimension: int = DEFAULT_MAX_DIMENSION,
) -> BlurScoreResult:
    """Calculate blur score from encoded image bytes."""
    try:
        from PIL import Image
    except ImportError as exc:
        raise RuntimeError(
            "Pillow is required to calculate blur scores from image bytes. "
            "Install the image processor dependencies first."
        ) from exc

    if max_dimension < 3:
        raise ValueError("max_dimension must be at least 3 pixels")

    with Image.open(BytesIO(image_bytes)) as image:
        grayscale = image.convert("L")
        grayscale.thumbnail((max_dimension, max_dimension))
        width, height = grayscale.size
        pixels = list(grayscale.getdata())

    return calculate_blur_score_from_pixels(
        pixels,
        width=width,
        height=height,
        threshold=threshold,
    )


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
        threshold=threshold,
        is_blurry=variance < threshold,
        width=width,
        height=height,
    )
