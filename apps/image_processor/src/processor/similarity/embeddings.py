from __future__ import annotations

from dataclasses import dataclass
from typing import Any


DEFAULT_EMBEDDING_MODEL = "ViT-B-32"
DEFAULT_EMBEDDING_PRETRAINED = "laion2b_s34b_b79k"
DEFAULT_EMBEDDING_DIMENSION = 512


@dataclass(frozen=True)
class ImageEmbeddingResult:
    vector: list[float]
    model: str
    version: str
    dimension: int
    raw: dict[str, Any]


class ImageEmbeddingAnalyzer:
    def __init__(
        self,
        *,
        model_name: str = DEFAULT_EMBEDDING_MODEL,
        pretrained: str = DEFAULT_EMBEDDING_PRETRAINED,
        dimension: int = DEFAULT_EMBEDDING_DIMENSION,
        device: str | None = None,
    ) -> None:
        self.model_name = model_name
        self.pretrained = pretrained
        self.dimension = dimension
        self.device = device
        self._model: Any | None = None
        self._preprocess: Any | None = None
        self._torch: Any | None = None
        self._device: str | None = None

    @property
    def model(self) -> str:
        return "openclip"

    @property
    def version(self) -> str:
        return f"{self.model_name}/{self.pretrained}"

    def analyze_image(self, image: Any) -> ImageEmbeddingResult:
        torch, model, preprocess, device = self._load_model()

        try:
            from PIL import ImageOps
        except ImportError as exc:
            raise RuntimeError(
                "Pillow is required to generate image embeddings."
            ) from exc

        prepared_image = ImageOps.exif_transpose(image).convert("RGB")
        image_tensor = preprocess(prepared_image).unsqueeze(0).to(device)

        with torch.no_grad():
            features = model.encode_image(image_tensor)
            features = features / features.norm(dim=-1, keepdim=True)

        vector = [float(value) for value in features.squeeze(0).cpu().tolist()]
        if len(vector) != self.dimension:
            raise RuntimeError(
                f"expected {self.dimension}-dimension embedding, got {len(vector)}"
            )

        return ImageEmbeddingResult(
            vector=vector,
            model=self.model,
            version=self.version,
            dimension=len(vector),
            raw={
                "provider": "open_clip",
                "modelName": self.model_name,
                "pretrained": self.pretrained,
                "dimension": len(vector),
                "device": device,
                "normalized": True,
            },
        )

    def _load_model(self) -> tuple[Any, Any, Any, str]:
        if self._model is not None and self._preprocess is not None:
            if self._torch is None or self._device is None:
                raise RuntimeError("embedding model cache is incomplete")
            return self._torch, self._model, self._preprocess, self._device

        try:
            import open_clip
            import torch
        except ImportError as exc:
            raise RuntimeError(
                "open-clip-torch and torch are required to generate image embeddings."
            ) from exc

        device = self.device or ("cuda" if torch.cuda.is_available() else "cpu")
        model, _, preprocess = open_clip.create_model_and_transforms(
            self.model_name,
            pretrained=self.pretrained,
            device=device,
        )
        model.eval()

        self._torch = torch
        self._model = model
        self._preprocess = preprocess
        self._device = device

        return torch, model, preprocess, device
