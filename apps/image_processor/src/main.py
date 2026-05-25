import asyncio

from image_processor.config import WorkerSettings
from image_processor.mq.consumer import ImageWorker


def main() -> int:
    settings = WorkerSettings.from_environment()
    worker = ImageWorker(settings=settings)
    asyncio.run(worker.run())
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
