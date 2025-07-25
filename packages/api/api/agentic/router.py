from fastapi import APIRouter, Depends, HTTPException, UploadFile, status

from ..document.schemas import DocumentCreate, DocumentResponse
from ..storage import storage_service
from .core.clustering.schemas import (
    ClusteringResult,
)  # TODO: This is for quick use future will be use with database
from .core.ingestion.schemas import FileInput
from .dependencies import (
    DocumentClusteringService,
    DocumentIngestorService,
    DocumentService,
    User,
    get_current_user,
    get_document_clustering_service,
    get_document_ingestor,
    get_document_service,
)
from .utils import normalize_file_input

router = APIRouter(prefix="/agentic", tags=["agentic"])


@router.post(
    "/upload_ingest",
    response_model=DocumentResponse,
    tags=["agentic"],
    status_code=status.HTTP_201_CREATED,
)
async def upload_and_ingest_documents(
    collection_id: str,
    graph_extract: bool = True,
    document_ingestor: DocumentIngestorService = Depends(get_document_ingestor),
    document_service: DocumentService = Depends(get_document_service),
    current_user: User = Depends(get_current_user),
    *,
    input_file: UploadFile,
    file_name: str = None,
):
    """
    Ingest documents into the system.
    This endpoint allows users to upload documents for processing and storage.
    """

    try:
        # Use utility to prepare file upload (object_name, file_type, file_extension)
        object_name, file_type, _ = DocumentService.prepare_file_upload(
            input_file, current_user.id, collection_id
        )

        # Upload file to storage
        stored_path = await storage_service.upload_file_to_storage(
            input_file, object_name
        )
        await input_file.seek(0)  # Reset pointer to start for subsequent read

        # Create document record
        document = document_service.create_document(
            document_data=DocumentCreate(
                file_name=input_file.filename or "uploaded_file",
                file_type=file_type,
                source_file_path=stored_path,
                collection_id=collection_id,
            ),
            user=current_user,
        )

        if not document:
            raise RuntimeError(
                f"Failed to create document record for {input_file.filename}"
            )

        # Read file content for ingestion
        file_content = await input_file.read()
        if not file_content:
            raise HTTPException(status_code=400, detail="Uploaded file is empty")

        formatted_input = FileInput(
            name=input_file.filename or "uploaded_file",
            file_name=input_file.filename or "uploaded_file",
            content=file_content,
            type=file_type,
            is_path=False,
        )

        # Normalize input using Pydantic model
        input_file_model: FileInput = normalize_file_input(formatted_input)

        try:
            await document_ingestor.ingest_file(
                input_file=input_file_model,
                document=document,
                graph_extract=graph_extract,
                user=current_user,
            )
        except Exception as e:
            # Fallback: delete document and storage file if ingestion fails
            document_service.delete_document(document_id=document.id)
            storage_service.delete_file_from_storage(
                object_name=document.source_file_path
            )
            raise HTTPException(
                status_code=500,
                detail=f"Error ingesting file {input_file.filename}: {str(e)}",
            ) from e

        return document

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error processing file: {str(e)}"
        ) from e


@router.post(
    "/cluster_topic",
    response_model=ClusteringResult,
    tags=["agentic"],
    status_code=status.HTTP_200_OK,
)
def cluster_documents(
    collection_id: str,
    document_clustering_service: DocumentClusteringService = Depends(
        get_document_clustering_service
    ),
):
    """
    Clusters document chunks in a collection and generates descriptive topic titles.

    Parameters:
    - collection_id: The ID of the collection to process.
    - cluster_title_top_n_topics: The number of top contributing topics to use for generating a cluster title.
    - cluster_title_top_n_words: The number of keywords to extract from each contributing topic.
    """
    return document_clustering_service.cluster_documents(
        collection_id=collection_id,
        cluster_title_top_n_topics=5,
        cluster_title_top_n_words=50,
    )
