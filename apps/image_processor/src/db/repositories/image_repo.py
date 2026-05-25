from sqlalchemy import select
from sqlalchemy.orm import sessionmaker

from image_processor.db.models import Image, ImageUploadStatus
from image_processor.db.session import session_scope


class ImageRepository:
    def __init__(self, session_factory: sessionmaker) -> None:
        self.session_factory = session_factory

    def list_uploaded_for_batch(self, batch_id: str) -> list[Image]:
        with session_scope(self.session_factory) as session:
            return list(
                session.scalars(
                    select(Image)
                    .where(
                        Image.batch_id == batch_id,
                        Image.status == ImageUploadStatus.UPLOADED,
                    )
                    .order_by(Image.created_at.asc())
                ).all()
            )
