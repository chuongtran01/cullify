import unittest
from unittest.mock import patch

from image_processor.processor.quality import (
    BlurScoreResult,
    ImageQualityAnalyzer,
    calculate_blur_score_from_pixels,
)


class BlurScoreTest(unittest.TestCase):
    def test_flat_image_has_zero_blur_score(self) -> None:
        result = calculate_blur_score_from_pixels(
            [128] * 25,
            width=5,
            height=5,
            threshold=100.0,
        )

        self.assertEqual(result.score, 0.0)
        self.assertTrue(result.is_blurry)

    def test_high_frequency_image_scores_sharper_than_flat_image(self) -> None:
        flat = calculate_blur_score_from_pixels(
            [128] * 25,
            width=5,
            height=5,
        )
        checkerboard = calculate_blur_score_from_pixels(
            [
                0,
                255,
                0,
                255,
                0,
                255,
                0,
                255,
                0,
                255,
                0,
                255,
                0,
                255,
                0,
                255,
                0,
                255,
                0,
                255,
                0,
                255,
                0,
                255,
                0,
            ],
            width=5,
            height=5,
        )

        self.assertGreater(checkerboard.score, flat.score)
        self.assertFalse(checkerboard.is_blurry)

    def test_rejects_mismatched_pixel_count(self) -> None:
        with self.assertRaises(ValueError):
            calculate_blur_score_from_pixels([0, 1, 2], width=3, height=3)

    def test_analyzer_returns_quality_result_from_blur_score(self) -> None:
        analyzer = ImageQualityAnalyzer()

        with patch(
            "image_processor.processor.quality.analyzer.calculate_blur_score_from_bytes",
            return_value=BlurScoreResult(
                score=42.0,
                threshold=100.0,
                is_blurry=True,
                width=10,
                height=20,
            ),
        ) as calculate_blur:
            result = analyzer.analyze(b"encoded-image-bytes")

        calculate_blur.assert_called_once_with(b"encoded-image-bytes")
        self.assertEqual(result.blur_score, 42.0)
        self.assertEqual(result.blur_threshold, 100.0)
        self.assertTrue(result.is_blurry)
        self.assertEqual(result.width, 10)
        self.assertEqual(result.height, 20)


if __name__ == "__main__":
    unittest.main()
