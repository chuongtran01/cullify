from typing import Annotated, Any, Protocol, TypedDict


PROCESS_COLLECTION_JOB_NAME = "process-collection"


class ProcessCollectionJobData(TypedDict):
    message: Annotated[str, "Human-readable job message for logs/debugging."]
    collectionId: Annotated[str, "Upload collection/collection id to process."]


class BullMQJob(Protocol):
    id: Annotated[str | None, "BullMQ job id, when provided by the queue."]
    name: Annotated[str, "BullMQ job name."]
    data: Annotated[dict[str, Any], "Raw BullMQ job payload."]
