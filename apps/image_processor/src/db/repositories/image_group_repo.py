from datetime import UTC, datetime
from uuid import uuid4

from sqlalchemy import delete, update
from sqlalchemy.orm import sessionmaker

from image_processor.db.models import Image, ImageGroup


class ImageGroupRepository:
    def __init__(self, session_factory: sessionmaker) -> None:
        self.session_factory = session_factory

    def replace_for_collection(
        self,
        collection_id: str,
        image_groups: list[list[str]],
    ) -> None:
        now = datetime.now(UTC)

        with self.session_factory.begin() as session:
            session.execute(
                update(Image)
                .where(Image.collection_id == collection_id)
                .values(group_id=None)
            )
            session.execute(
                delete(ImageGroup).where(ImageGroup.collection_id == collection_id)
            )

            for image_ids in image_groups:
                if len(image_ids) <= 1:
                    continue

                group = ImageGroup(
                    id=str(uuid4()),
                    collection_id=collection_id,
                    image_count=len(image_ids),
                    created_at=now,
                    updated_at=now,
                )
                session.add(group)
                session.flush()

                session.execute(
                    update(Image)
                    .where(Image.collection_id == collection_id)
                    .where(Image.id.in_(image_ids))
                    .values(group_id=group.id)
                )
