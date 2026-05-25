import unittest

from image_processor.processor.quality import calculate_exposure_score_from_pixels


class ExposureScoreTest(unittest.TestCase):
    def test_balanced_image_has_high_exposure_score(self) -> None:
        result = calculate_exposure_score_from_pixels(
            [128] * 25,
            width=5,
            height=5,
        )

        self.assertGreater(result.score, 0.99)
        self.assertFalse(result.is_low_exposure)
        self.assertFalse(result.is_high_exposure)

    def test_dark_image_is_low_exposure(self) -> None:
        result = calculate_exposure_score_from_pixels(
            [10] * 25,
            width=5,
            height=5,
        )

        self.assertLess(result.score, 0.3)
        self.assertTrue(result.is_low_exposure)
        self.assertFalse(result.is_high_exposure)

    def test_bright_image_is_high_exposure(self) -> None:
        result = calculate_exposure_score_from_pixels(
            [245] * 25,
            width=5,
            height=5,
        )

        self.assertLess(result.score, 0.3)
        self.assertFalse(result.is_low_exposure)
        self.assertTrue(result.is_high_exposure)

    def test_exposure_thresholds_can_be_tuned(self) -> None:
        result = calculate_exposure_score_from_pixels(
            [80] * 25,
            width=5,
            height=5,
            low_exposure_threshold=0.4,
        )

        self.assertTrue(result.is_low_exposure)

    def test_rejects_mismatched_pixel_count(self) -> None:
        with self.assertRaises(ValueError):
            calculate_exposure_score_from_pixels([0, 1, 2], width=3, height=3)


if __name__ == "__main__":
    unittest.main()
