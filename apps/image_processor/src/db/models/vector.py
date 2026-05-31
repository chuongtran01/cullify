from typing import Any

from sqlalchemy.types import UserDefinedType


class PgVector(UserDefinedType):
    cache_ok = True

    def __init__(self, dimension: int) -> None:
        self.dimension = dimension

    def get_col_spec(self, **_kwargs: Any) -> str:
        return f"vector({self.dimension})"

    def bind_processor(self, _dialect: Any):
        def process(value: list[float] | tuple[float, ...] | None) -> str | None:
            if value is None:
                return None
            if len(value) != self.dimension:
                raise ValueError(
                    f"expected vector dimension {self.dimension}, got {len(value)}"
                )
            return "[" + ",".join(str(float(item)) for item in value) + "]"

        return process

    def result_processor(self, _dialect: Any, _coltype: Any):
        def process(value: Any) -> list[float] | None:
            if value is None:
                return None
            if isinstance(value, list):
                return [float(item) for item in value]
            if isinstance(value, str):
                return [
                    float(item)
                    for item in value.strip("[]").split(",")
                    if item.strip()
                ]
            return value

        return process
