from dataclasses import dataclass
from datetime import datetime

import psycopg
from psycopg.rows import class_row


@dataclass(frozen=True)
class BatchRecord:
    id: str
    status: str
    created_at: datetime
    updated_at: datetime


@dataclass(frozen=True)
class ImageRecord:
    id: str
    batch_id: str
    file_name: str
    mime_type: str
    size_bytes: int
    object_key: str
    status: str
    created_at: datetime
    uploaded_at: datetime | None


class ImageProcessingDatabase:
    def __init__(self, database_url: str) -> None:
        self.database_url = database_url

    def get_batch(self, batch_id: str) -> BatchRecord | None:
        with psycopg.connect(self.database_url, row_factory=class_row(BatchRecord)) as connection:
            with connection.cursor() as cursor:
                cursor.execute(
                    """
                    SELECT
                      id::text AS id,
                      status::text AS status,
                      "createdAt" AS created_at,
                      "updatedAt" AS updated_at
                    FROM "Batch"
                    WHERE id = %s::uuid
                    """,
                    (batch_id,),
                )

                return cursor.fetchone()

    def list_uploaded_images_for_batch(self, batch_id: str) -> list[ImageRecord]:
        with psycopg.connect(self.database_url, row_factory=class_row(ImageRecord)) as connection:
            with connection.cursor() as cursor:
                cursor.execute(
                    """
                    SELECT
                      id::text AS id,
                      "batchId"::text AS batch_id,
                      "fileName" AS file_name,
                      "mimeType" AS mime_type,
                      "sizeBytes" AS size_bytes,
                      "objectKey" AS object_key,
                      status::text AS status,
                      "createdAt" AS created_at,
                      "uploadedAt" AS uploaded_at
                    FROM "Image"
                    WHERE "batchId" = %s::uuid
                      AND status = 'UPLOADED'
                    ORDER BY "createdAt" ASC
                    """,
                    (batch_id,),
                )

                return list(cursor.fetchall())
