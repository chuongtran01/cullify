from math import sqrt

DEFAULT_GROUP_SIMILARITY_THRESHOLD = 0.88


class ImageGroupingService:
    def __init__(
        self,
        similarity_threshold: float = DEFAULT_GROUP_SIMILARITY_THRESHOLD,
    ) -> None:
        self.similarity_threshold = similarity_threshold

    def group(
        self,
        image_ids: list[str],
        embeddings: dict[str, list[float]],
    ) -> list[list[str]]:
        normalized = {
            image_id: vector
            for image_id, embedding in embeddings.items()
            if (vector := self._normalize(embedding)) is not None
        }
        assigned: set[str] = set()
        groups: list[list[str]] = []

        for image_id in image_ids:
            if image_id in assigned:
                continue

            if image_id not in normalized:
                assigned.add(image_id)
                groups.append([image_id])
                continue

            group = self._collect_similar_group(
                image_id,
                image_ids,
                normalized,
                assigned,
            )
            groups.append(group)

        return groups

    def _collect_similar_group(
        self,
        seed_image_id: str,
        image_ids: list[str],
        normalized: dict[str, list[float]],
        assigned: set[str],
    ) -> list[str]:
        group = [seed_image_id]
        assigned.add(seed_image_id)

        changed = True
        while changed:
            changed = False
            for candidate_id in image_ids:
                if candidate_id in assigned or candidate_id not in normalized:
                    continue

                if any(
                    self._cosine_similarity(normalized[candidate_id], normalized[member_id])
                    >= self.similarity_threshold
                    for member_id in group
                ):
                    assigned.add(candidate_id)
                    group.append(candidate_id)
                    changed = True

        return group

    def _normalize(self, vector: list[float]) -> list[float] | None:
        norm = sqrt(sum(value * value for value in vector))
        if norm == 0:
            return None

        return [value / norm for value in vector]

    def _cosine_similarity(self, left: list[float], right: list[float]) -> float:
        return sum(left_value * right_value for left_value, right_value in zip(left, right))
