from dataclasses import dataclass
import os
from pathlib import Path
from typing import Annotated

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
    account_id: Annotated[str, "Cloudflare account id used to build the R2 endpoint."]
    access_key_id: Annotated[str, "R2 access key id used for S3-compatible auth."]
    secret_access_key: Annotated[
        str,
        "R2 secret access key used for S3-compatible auth.",
    ]
    bucket_name: Annotated[str, "R2 bucket that stores uploaded source images."]
    endpoint: Annotated[str, "S3-compatible R2 endpoint URL."]
    region: Annotated[str, "S3-compatible region value for the R2 client."]


@dataclass(frozen=True)
class WorkerSettings:
    database_url: Annotated[str, "Database URL used by the image worker."]
    redis_url: Annotated[str, "Redis URL used by BullMQ."]
    queue_name: Annotated[str, "BullMQ queue name consumed by the worker."]
    log_level: Annotated[str, "Worker log verbosity setting."]

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
