from fastapi import APIRouter, Depends, HTTPException, UploadFile, status

from ..document.schemas import DocumentResponse
from ..storage import storage_service
from .core.ingestion.schemas import FileInput
from .dependencies import (
    DocumentIngestorService,
    User,
    get_current_user,
    get_document_ingestor,
)

router = APIRouter(prefix="/agentic", tags=["agentic"])


@router.post(
    "/ingest", response_model=DocumentResponse, status_code=status.HTTP_201_CREATED
)
async def upload_and_ingest_documents(
    collection_id: str,
    graph_extract: bool = True,
    document_ingestor: DocumentIngestorService = Depends(get_document_ingestor),
    current_user: User = Depends(get_current_user),
    *,
    input_file: UploadFile,
    file_name: str = None,
):
    """
    Ingest documents into the system.
    This endpoint allows users to upload documents for processing and storage.
    """
    from uuid import uuid4

    file_name = file_name or input_file.filename

    try:
        # Read the file content once and store it
        file_content = await input_file.read()

        # Validate that content is not empty
        if not file_content:
            raise HTTPException(status_code=400, detail="Uploaded file is empty")

        file_extension = ""
        if input_file.filename and "." in input_file.filename:
            file_extension = "." + input_file.filename.split(".")[-1].lower()

        uuid_filename = str(uuid4()) + file_extension

        object_name = (
            f"users/{current_user.id}/collections/{collection_id}/{uuid_filename}"
        )

        stored_path = await storage_service.upload_file_to_storage(
            file=input_file,
            object_name=object_name,
        )

        formatted_input = FileInput(
            name=file_name,
            file_name=file_name,
            content=file_content,
            type=input_file.content_type or "application/octet-stream",
            is_path=False,
        )

        document_record = await document_ingestor.ingest_file(
            input_file=formatted_input,
            save_path=stored_path,
            collection_id=collection_id,
            graph_extract=graph_extract,
            user=current_user,
        )

        if not document_record:
            raise HTTPException(status_code=500, detail="Failed to ingest document")

        return document_record

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error processing file: {str(e)}"
        ) from e
