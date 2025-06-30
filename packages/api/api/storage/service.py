"""Service for file storage operations using MinIO."""

import io
from typing import Optional

from fastapi import HTTPException, UploadFile, status
from fastapi.responses import Response
from minio import Minio
from minio.error import S3Error

from ..config import get_settings
from ..models.user import User


class StorageService:
    """Service for file storage operations using MinIO."""

    def __init__(self):
        """Initialize storage service."""
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

    def ensure_bucket_exists(self, bucket_name: Optional[str] = None) -> None:
        """Ensure the bucket exists."""
        if bucket_name is None:
            bucket_name = self.settings.MINIO_BUCKET_NAME

        try:
            if not self.client.bucket_exists(bucket_name):
                self.client.make_bucket(bucket_name)
        except S3Error as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to create bucket: {e}",
            ) from e

    # High-level user-scoped methods
    async def upload_file(self, user: User, file: UploadFile) -> dict:
        """Upload a file for a specific user."""
        object_name = f"users/{user.id}/{file.filename}"
        stored_path = await self.upload_file_to_storage(file, object_name)
        return {
            "message": "File uploaded successfully",
            "filename": file.filename,
            "stored_path": stored_path,
            "content_type": file.content_type,
            "size": file.size,
        }

    def download_file(self, user: User, object_name: str) -> Response:
        """Download a file for a specific user."""
        if not object_name.startswith(f"users/{user.id}/"):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied to this file",
            )
        content = self.download_file_from_storage(object_name)
        filename = object_name.split("/")[-1]
        return Response(
            content=content,
            media_type="application/octet-stream",
            headers={"Content-Disposition": f"attachment; filename={filename}"},
        )

    def delete_file(self, user: User, object_name: str) -> dict:
        """Delete a file for a specific user."""
        if not object_name.startswith(f"users/{user.id}/"):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied to this file",
            )
        success = self.delete_file_from_storage(object_name)
        if success:
            return {"message": "File deleted successfully"}
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="File not found",
            )

    def list_user_files(self, user: User) -> list[str]:
        """List all files for a specific user."""
        prefix = f"users/{user.id}/"
        files = self.list_files(prefix=prefix)
        user_files = [f.replace(prefix, "") for f in files]
        return user_files

    def get_file_url(
        self, user: User, object_name: str, expires_in: int = 3600
    ) -> dict:
        """Get a presigned URL for a user's file."""
        if not object_name.startswith(f"users/{user.id}/"):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied to this file",
            )
        url = self.get_file_url_from_storage(object_name, expires_in=expires_in)
        return {
            "url": url,
            "expires_in": expires_in,
            "object_name": object_name,
        }

    # Low-level storage methods (for direct use by other services)
    async def upload_file_to_storage(
        self,
        file: UploadFile,
        object_name: Optional[str] = None,
        bucket_name: Optional[str] = None,
    ) -> str:
        """
        Upload a file to MinIO storage.

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
            self.ensure_bucket_exists(bucket_name)

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

    def upload_file_from_fileobj(
        self,
        bucket_name: str,
        object_name: str,
        file_obj,
        length: Optional[int] = None,
        content_type: Optional[str] = None,
    ) -> None:
        """
        Upload a file from a file-like object to MinIO.

        Args:
            bucket_name: The bucket to upload to
            object_name: The name to store the file as
            file_obj: File-like object to upload
            length: Length of the data (if known)
            content_type: Content type of the file
        """
        try:
            # Ensure bucket exists
            self.ensure_bucket_exists(bucket_name)

            # If length is not provided, try to get it from the file object
            if (
                length is None
                and hasattr(file_obj, "seek")
                and hasattr(file_obj, "tell")
            ):
                current_pos = file_obj.tell()
                file_obj.seek(0, 2)  # Seek to end
                length = file_obj.tell()
                file_obj.seek(current_pos)  # Seek back to original position

            # Upload file
            self.client.put_object(
                bucket_name=bucket_name,
                object_name=object_name,
                data=file_obj,
                length=length or -1,
                content_type=content_type,
            )

        except S3Error as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to upload file: {e}",
            ) from e

    def download_file_from_storage(
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

    def delete_file_from_storage(
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

    def get_file_url_from_storage(
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


storage_service = StorageService()
