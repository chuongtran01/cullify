from dataclasses import dataclass
import os
from pathlib import Path

from dotenv import load_dotenv


DEFAULT_IMAGE_PROCESSING_QUEUE_NAME = "image-processing"


def load_environment() -> None:
    worker_root = Path(__file__).resolve().parents[2]
    repo_root = Path(__file__).resolve().parents[4]
    web_app_root = repo_root / "apps" / "web"

    for env_file in (
        worker_root / ".env.local",
        worker_root / ".env",
        web_app_root / ".env.local",
        web_app_root / ".env",
        repo_root / ".env",
    ):
        load_dotenv(env_file)


@dataclass(frozen=True)
class WorkerSettings:
    database_url: str
    redis_url: str
    queue_name: str
    log_level: str

    @classmethod
    def from_environment(cls) -> "WorkerSettings":
        load_environment()

        database_url = os.getenv("DATABASE_URL")

        if not database_url:
            raise RuntimeError("DATABASE_URL is not set")

        return cls(
            database_url=database_url,
            redis_url=os.getenv("REDIS_URL", "redis://localhost:6379"),
            queue_name=os.getenv(
                "IMAGE_WORKER_QUEUE",
                DEFAULT_IMAGE_PROCESSING_QUEUE_NAME,
            ),
            log_level=os.getenv("IMAGE_WORKER_LOG_LEVEL", "INFO"),
        )
