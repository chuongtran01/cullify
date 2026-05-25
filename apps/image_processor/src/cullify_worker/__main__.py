import asyncio

from cullify_worker.config import WorkerSettings
from cullify_worker.worker import ImageWorker


def main() -> int:
    settings = WorkerSettings.from_environment()
    worker = ImageWorker(settings=settings)
    asyncio.run(worker.run())
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
