"""File upload router using MinIO storage."""

from fastapi import APIRouter, Depends, HTTPException, UploadFile, status
from fastapi.responses import Response

from ..auth.dependencies import get_current_user
from ..models.user import User
from ..storage import minio_service

router = APIRouter(prefix="/files", tags=["files"])


@router.post("/upload")
async def upload_file(
    user: User = Depends(get_current_user),
    *,
    file: UploadFile,
) -> dict:
    """Upload a file to MinIO storage."""
    try:
        # Generate a unique filename with user prefix
        object_name = f"users/{user.id}/{file.filename}"

        # Upload file to MinIO
        stored_path = await minio_service.upload_file(file, object_name)

        return {
            "message": "File uploaded successfully",
            "filename": file.filename,
            "stored_path": stored_path,
            "content_type": file.content_type,
            "size": file.size,
        }
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
        # Check if user has access to this file (basic check for user prefix)
        if not object_name.startswith(f"users/{user.id}/"):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied to this file",
            )

        # Download file from MinIO
        content = minio_service.download_file(object_name)

        # Get filename from object name
        filename = object_name.split("/")[-1]

        return Response(
            content=content,
            media_type="application/octet-stream",
            headers={"Content-Disposition": f"attachment; filename={filename}"},
        )
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
        # Check if user has access to this file
        if not object_name.startswith(f"users/{user.id}/"):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied to this file",
            )

        # Delete file from MinIO
        success = minio_service.delete_file(object_name)

        if success:
            return {"message": "File deleted successfully"}
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="File not found",
            )
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
        # List files with user prefix
        prefix = f"users/{user.id}/"
        files = minio_service.list_files(prefix=prefix)

        # Remove the prefix from file names for cleaner response
        user_files = [f.replace(prefix, "") for f in files]

        return user_files
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
        # Check if user has access to this file
        if not object_name.startswith(f"users/{user.id}/"):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied to this file",
            )

        # Get presigned URL
        url = minio_service.get_file_url(object_name, expires_in=expires_in)

        return {
            "url": url,
            "expires_in": expires_in,
            "object_name": object_name,
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate file URL: {str(e)}",
        ) from e
