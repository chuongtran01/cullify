from typing import Any, Protocol, TypedDict


PROCESS_UPLOAD_SESSION_JOB_NAME = "process-upload-session"


class ProcessUploadSessionJobData(TypedDict):
    message: str
    sessionId: str


class BullMQJob(Protocol):
    id: str | None
    name: str
    data: dict[str, Any]
