import unittest

from image_processor.processor.quality import calculate_compression_score_from_pixels


class CompressionScoreTest(unittest.TestCase):
    def test_smooth_image_has_high_compression_score(self) -> None:
        pixels = [128] * 256

        result = calculate_compression_score_from_pixels(
            pixels,
            width=16,
            height=16,
        )

        self.assertEqual(result.blockiness_score, 0.0)
        self.assertEqual(result.score, 1.0)
        self.assertFalse(result.has_compression_artifacts)

    def test_blocky_image_detects_compression_artifacts(self) -> None:
        pixels = []

        for y in range(16):
            for x in range(16):
                pixels.append(0 if (x < 8 and y < 8) or (x >= 8 and y >= 8) else 255)

        result = calculate_compression_score_from_pixels(
            pixels,
            width=16,
            height=16,
        )

        self.assertGreater(result.blockiness_score, 0.5)
        self.assertLess(result.score, 0.1)
        self.assertTrue(result.has_compression_artifacts)

    def test_compression_threshold_can_be_tuned(self) -> None:
        pixels = [0 if x < 8 else 20 for _y in range(16) for x in range(16)]

        result = calculate_compression_score_from_pixels(
            pixels,
            width=16,
            height=16,
            blockiness_threshold=0.1,
        )

        self.assertFalse(result.has_compression_artifacts)

    def test_rejects_mismatched_pixel_count(self) -> None:
        with self.assertRaises(ValueError):
            calculate_compression_score_from_pixels([0, 1, 2], width=3, height=3)


if __name__ == "__main__":
    unittest.main()
