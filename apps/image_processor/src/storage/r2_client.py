from pathlib import Path
from typing import BinaryIO

import boto3
from botocore.client import BaseClient

from image_processor.config import R2Settings


class R2Client:
    def __init__(self, settings: R2Settings) -> None:
        self.settings = settings
        self.client: BaseClient = boto3.client(
            "s3",
            region_name=settings.region,
            endpoint_url=settings.endpoint,
            aws_access_key_id=settings.access_key_id,
            aws_secret_access_key=settings.secret_access_key,
        )

    def download_bytes(self, object_key: str) -> bytes:
        response = self.client.get_object(
            Bucket=self.settings.bucket_name,
            Key=object_key,
        )

        return response["Body"].read()

    def download_file(self, object_key: str, destination: str | Path) -> None:
        self.client.download_file(
            self.settings.bucket_name,
            object_key,
            str(destination),
        )

    def upload_bytes(
        self,
        object_key: str,
        data: bytes,
        content_type: str | None = None,
    ) -> None:
        self.client.put_object(
            Bucket=self.settings.bucket_name,
            Key=object_key,
            Body=data,
            **({"ContentType": content_type} if content_type else {}),
        )

    def upload_file(
        self,
        object_key: str,
        source: str | Path,
        content_type: str | None = None,
    ) -> None:
        kwargs = (
            {"ExtraArgs": {"ContentType": content_type}} if content_type else {}
        )

        self.client.upload_file(
            str(source),
            self.settings.bucket_name,
            object_key,
            **kwargs,
        )

    def upload_fileobj(
        self,
        object_key: str,
        source: BinaryIO,
        content_type: str | None = None,
    ) -> None:
        kwargs = (
            {"ExtraArgs": {"ContentType": content_type}} if content_type else {}
        )

        self.client.upload_fileobj(
            source,
            self.settings.bucket_name,
            object_key,
            **kwargs,
        )
