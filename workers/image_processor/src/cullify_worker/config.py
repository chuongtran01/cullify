from dataclasses import dataclass
import os


DEFAULT_IMAGE_PROCESSING_QUEUE_NAME = "image-processing"


@dataclass(frozen=True)
class WorkerSettings:
    redis_url: str
    queue_name: str
    log_level: str

    @classmethod
    def from_environment(cls) -> "WorkerSettings":
        return cls(
            redis_url=os.getenv("REDIS_URL", "redis://localhost:6379"),
            queue_name=os.getenv(
                "IMAGE_WORKER_QUEUE",
                DEFAULT_IMAGE_PROCESSING_QUEUE_NAME,
            ),
            log_level=os.getenv("IMAGE_WORKER_LOG_LEVEL", "INFO"),
        )
