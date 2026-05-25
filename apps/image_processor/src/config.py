from dataclasses import dataclass
import os
from pathlib import Path

from dotenv import load_dotenv


DEFAULT_IMAGE_PROCESSING_QUEUE_NAME = "image-processing"
DEFAULT_R2_REGION = "auto"


def load_environment() -> None:
    worker_root = Path(__file__).resolve().parents[1]
    repo_root = Path(__file__).resolve().parents[3]
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
class R2Settings:
    account_id: str
    access_key_id: str
    secret_access_key: str
    bucket_name: str
    endpoint: str
    region: str


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

    def r2_settings(self) -> R2Settings:
        account_id = _require_env("R2_ACCOUNT_ID")
        endpoint = f"https://{account_id}.r2.cloudflarestorage.com"

        return R2Settings(
            account_id=account_id,
            access_key_id=_require_env("R2_ACCESS_KEY_ID"),
            secret_access_key=_require_env("R2_SECRET_ACCESS_KEY"),
            bucket_name=_require_env("R2_BUCKET_NAME"),
            endpoint=endpoint,
            region=os.getenv("R2_REGION", DEFAULT_R2_REGION),
        )


def _require_env(name: str) -> str:
    value = os.getenv(name)

    if not value:
        raise RuntimeError(f"{name} is not set")

    return value
