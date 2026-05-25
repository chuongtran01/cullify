import unittest
from unittest.mock import patch

from image_processor.processor.quality import (
    BlurScoreResult,
    ExposureScoreResult,
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

        with patch.object(
            analyzer,
            "_load_grayscale_pixels",
            return_value=([128] * 200, 10, 20),
        ) as load_pixels:
            with patch(
                "image_processor.processor.quality.analyzer.calculate_blur_score_from_pixels",
                return_value=BlurScoreResult(
                    score=42.0,
                    is_blurry=True,
                ),
            ) as calculate_blur:
                with patch(
                    "image_processor.processor.quality.analyzer.calculate_exposure_score_from_pixels",
                    return_value=ExposureScoreResult(
                        score=0.8,
                        mean_luminance=0.45,
                        dark_pixel_ratio=0.1,
                        bright_pixel_ratio=0.0,
                        is_low_exposure=False,
                        is_high_exposure=False,
                    ),
                ) as calculate_exposure:
                    result = analyzer.analyze(b"encoded-image-bytes")

        load_pixels.assert_called_once_with(b"encoded-image-bytes")
        calculate_blur.assert_called_once_with([128] * 200, width=10, height=20)
        calculate_exposure.assert_called_once_with([128] * 200, width=10, height=20)
        self.assertEqual(result.blur_score, 42.0)
        self.assertTrue(result.is_blurry)
        self.assertEqual(result.exposure_score, 0.8)
        self.assertEqual(result.mean_luminance, 0.45)
        self.assertFalse(result.is_low_exposure)
        self.assertEqual(result.width, 10)
        self.assertEqual(result.height, 20)


if __name__ == "__main__":
    unittest.main()
