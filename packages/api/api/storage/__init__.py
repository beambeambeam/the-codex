"""MinIO service for file storage operations."""

import io
from typing import Optional

from fastapi import HTTPException, UploadFile, status
from minio import Minio
from minio.error import S3Error

from ..config import get_settings


class MinIOService:
    """Service for MinIO file storage operations."""

    def __init__(self):
        """Initialize MinIO service."""
        self.settings = get_settings()
        self._client = None

    @property
    def client(self) -> Minio:
        """Get MinIO client instance."""
        if self._client is None:
            self._client = Minio(
                endpoint=self.settings.MINIO_ENDPOINT,
                access_key=self.settings.MINIO_ACCESS_KEY,
                secret_key=self.settings.MINIO_SECRET_KEY,
                secure=self.settings.MINIO_SECURE,
            )
        return self._client

    def ensure_bucket_exists(self) -> None:
        """Ensure the default bucket exists."""
        try:
            if not self.client.bucket_exists(self.settings.MINIO_BUCKET_NAME):
                self.client.make_bucket(self.settings.MINIO_BUCKET_NAME)
        except S3Error as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to create bucket: {e}",
            ) from e

    async def upload_file(
        self,
        file: UploadFile,
        object_name: Optional[str] = None,
        bucket_name: Optional[str] = None,
    ) -> str:
        """
        Upload a file to MinIO.

        Args:
            file: The file to upload
            object_name: The name to store the file as (defaults to file.filename)
            bucket_name: The bucket to upload to (defaults to settings bucket)

        Returns:
            The object name/path in MinIO
        """
        if bucket_name is None:
            bucket_name = self.settings.MINIO_BUCKET_NAME

        if object_name is None:
            object_name = file.filename

        if not object_name:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="File name is required",
            )

        try:
            # Ensure bucket exists
            self.ensure_bucket_exists()

            # Read file content
            content = await file.read()
            content_stream = io.BytesIO(content)

            # Upload file
            self.client.put_object(
                bucket_name=bucket_name,
                object_name=object_name,
                data=content_stream,
                length=len(content),
                content_type=file.content_type,
            )

            return object_name

        except S3Error as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to upload file: {e}",
            ) from e

    def download_file(
        self,
        object_name: str,
        bucket_name: Optional[str] = None,
    ) -> bytes:
        """
        Download a file from MinIO.

        Args:
            object_name: The name of the object to download
            bucket_name: The bucket to download from (defaults to settings bucket)

        Returns:
            The file content as bytes
        """
        if bucket_name is None:
            bucket_name = self.settings.MINIO_BUCKET_NAME

        try:
            response = self.client.get_object(bucket_name, object_name)
            content = response.read()
            return content

        except S3Error as e:
            if e.code == "NoSuchKey":
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="File not found",
                ) from e
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to download file: {e}",
            ) from e
        finally:
            if "response" in locals():
                response.close()

    def delete_file(
        self,
        object_name: str,
        bucket_name: Optional[str] = None,
    ) -> bool:
        """
        Delete a file from MinIO.

        Args:
            object_name: The name of the object to delete
            bucket_name: The bucket to delete from (defaults to settings bucket)

        Returns:
            True if successful
        """
        if bucket_name is None:
            bucket_name = self.settings.MINIO_BUCKET_NAME

        try:
            self.client.remove_object(bucket_name, object_name)
            return True

        except S3Error as e:
            if e.code == "NoSuchKey":
                # File doesn't exist, consider it deleted
                return True
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to delete file: {e}",
            ) from e

    def get_file_url(
        self,
        object_name: str,
        bucket_name: Optional[str] = None,
        expires_in: int = 3600,
    ) -> str:
        """
        Get a presigned URL for a file.

        Args:
            object_name: The name of the object
            bucket_name: The bucket name (defaults to settings bucket)
            expires_in: URL expiration time in seconds (default 1 hour)

        Returns:
            The presigned URL
        """
        if bucket_name is None:
            bucket_name = self.settings.MINIO_BUCKET_NAME

        try:
            url = self.client.presigned_get_object(
                bucket_name=bucket_name,
                object_name=object_name,
                expires=expires_in,
            )
            return url

        except S3Error as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to generate file URL: {e}",
            ) from e

    def list_files(
        self,
        prefix: Optional[str] = None,
        bucket_name: Optional[str] = None,
    ) -> list[str]:
        """
        List files in a bucket.

        Args:
            prefix: Filter files by prefix
            bucket_name: The bucket to list from (defaults to settings bucket)

        Returns:
            List of object names
        """
        if bucket_name is None:
            bucket_name = self.settings.MINIO_BUCKET_NAME

        try:
            objects = self.client.list_objects(
                bucket_name=bucket_name,
                prefix=prefix,
                recursive=True,
            )
            return [obj.object_name for obj in objects]

        except S3Error as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to list files: {e}",
            ) from e

    def file_exists(
        self,
        object_name: str,
        bucket_name: Optional[str] = None,
    ) -> bool:
        """
        Check if a file exists in MinIO.

        Args:
            object_name: The name of the object to check
            bucket_name: The bucket to check in (defaults to settings bucket)

        Returns:
            True if file exists
        """
        if bucket_name is None:
            bucket_name = self.settings.MINIO_BUCKET_NAME

        try:
            self.client.stat_object(bucket_name, object_name)
            return True
        except S3Error:
            return False


# Global MinIO service instance
minio_service = MinIOService()
