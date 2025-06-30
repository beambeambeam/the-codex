"""Service for file storage operations using MinIO."""

from fastapi import HTTPException, UploadFile, status
from fastapi.responses import Response

from ..models.user import User
from . import minio_service


class StorageService:
    """Service for file storage operations."""

    async def upload_file(self, user: User, file: UploadFile) -> dict:
        object_name = f"users/{user.id}/{file.filename}"
        stored_path = await minio_service.upload_file(file, object_name)
        return {
            "message": "File uploaded successfully",
            "filename": file.filename,
            "stored_path": stored_path,
            "content_type": file.content_type,
            "size": file.size,
        }

    def download_file(self, user: User, object_name: str) -> Response:
        if not object_name.startswith(f"users/{user.id}/"):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied to this file",
            )
        content = minio_service.download_file(object_name)
        filename = object_name.split("/")[-1]
        return Response(
            content=content,
            media_type="application/octet-stream",
            headers={"Content-Disposition": f"attachment; filename={filename}"},
        )

    def delete_file(self, user: User, object_name: str) -> dict:
        if not object_name.startswith(f"users/{user.id}/"):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied to this file",
            )
        success = minio_service.delete_file(object_name)
        if success:
            return {"message": "File deleted successfully"}
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="File not found",
            )

    def list_user_files(self, user: User) -> list[str]:
        prefix = f"users/{user.id}/"
        files = minio_service.list_files(prefix=prefix)
        user_files = [f.replace(prefix, "") for f in files]
        return user_files

    def get_file_url(
        self, user: User, object_name: str, expires_in: int = 3600
    ) -> dict:
        if not object_name.startswith(f"users/{user.id}/"):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied to this file",
            )
        url = minio_service.get_file_url(object_name, expires_in=expires_in)
        return {
            "url": url,
            "expires_in": expires_in,
            "object_name": object_name,
        }


storage_service = StorageService()
