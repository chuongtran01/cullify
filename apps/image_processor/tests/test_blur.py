import unittest

from image_processor.processor.quality import calculate_blur_score_from_pixels


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


if __name__ == "__main__":
    unittest.main()
