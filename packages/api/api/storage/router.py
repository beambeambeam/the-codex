"""File upload router using MinIO storage."""

from fastapi import APIRouter, Depends, HTTPException, UploadFile, status
from fastapi.responses import Response

from ..auth.dependencies import get_current_user
from ..models.user import User
from .service import storage_service

router = APIRouter(prefix="/files", tags=["files"])


@router.post("/upload")
async def upload_file(
    user: User = Depends(get_current_user),
    *,
    file: UploadFile,
) -> dict:
    """Upload a file to MinIO storage."""
    try:
        return await storage_service.upload_file(user, file)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to upload file: {str(e)}",
        ) from e


@router.get("/download/{object_name:path}")
async def download_file(
    object_name: str,
    user: User = Depends(get_current_user),
) -> Response:
    """Download a file from MinIO storage."""
    try:
        return storage_service.download_file(user, object_name)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to download file: {str(e)}",
        ) from e


@router.delete("/delete/{object_name:path}")
async def delete_file(
    object_name: str,
    user: User = Depends(get_current_user),
) -> dict:
    """Delete a file from MinIO storage."""
    try:
        return storage_service.delete_file(user, object_name)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete file: {str(e)}",
        ) from e


@router.get("/list")
async def list_user_files(
    user: User = Depends(get_current_user),
) -> list[str]:
    """List all files for the current user."""
    try:
        return storage_service.list_user_files(user)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to list files: {str(e)}",
        ) from e


@router.get("/url/{object_name:path}")
async def get_file_url(
    object_name: str,
    expires_in: int = 3600,
    user: User = Depends(get_current_user),
) -> dict:
    """Get a presigned URL for a file."""
    try:
        return storage_service.get_file_url(user, object_name, expires_in=expires_in)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate file URL: {str(e)}",
        ) from e
