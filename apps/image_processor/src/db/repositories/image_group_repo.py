from datetime import UTC, datetime
from uuid import uuid4

from sqlalchemy import delete
from sqlalchemy.orm import sessionmaker

from image_processor.db.models import GroupImage, ImageGroup


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
                delete(ImageGroup).where(ImageGroup.collection_id == collection_id)
            )

            for image_ids in image_groups:
                if not image_ids:
                    continue

                group = ImageGroup(
                    id=str(uuid4()),
                    collection_id=collection_id,
                    image_count=len(image_ids),
                    created_at=now,
                    updated_at=now,
                )
                session.add(group)

                for image_id in image_ids:
                    session.add(
                        GroupImage(
                            id=str(uuid4()),
                            group_id=group.id,
                            image_id=image_id,
                            created_at=now,
                        )
                    )
