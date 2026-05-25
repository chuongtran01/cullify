from typing import Annotated, Any, Protocol, TypedDict


PROCESS_UPLOAD_SESSION_JOB_NAME = "process-upload-session"


class ProcessUploadSessionJobData(TypedDict):
    message: Annotated[str, "Human-readable job message for logs/debugging."]
    sessionId: Annotated[str, "Upload session/batch id to process."]


class BullMQJob(Protocol):
    id: Annotated[str | None, "BullMQ job id, when provided by the queue."]
    name: Annotated[str, "BullMQ job name."]
    data: Annotated[dict[str, Any], "Raw BullMQ job payload."]
