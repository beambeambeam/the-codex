import asyncio

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    UploadFile,
    status,
)

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
    response_model=list[DocumentResponse],
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
    input_files: list[UploadFile],
):
    """
    Ingest multiple documents into the system.
    This endpoint allows users to upload multiple documents for processing and storage.
    Returns as soon as document records are created; ingestion continues in the background.
    """
    created_documents = []
    errors = []
    for input_file in input_files:
        try:
            object_name, file_type, _ = DocumentService.prepare_file_upload(
                input_file, current_user.id, collection_id
            )
            stored_path = await storage_service.upload_file_to_storage(
                input_file, object_name
            )
            await input_file.seek(0)
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
            input_file_model: FileInput = normalize_file_input(formatted_input)
            # Schedule ingestion concurrently using asyncio
            asyncio.create_task(
                document_ingestor.ingest_file(
                    input_file=input_file_model,
                    document=document,
                    graph_extract=graph_extract,
                    user=current_user,
                )
            )
            created_documents.append(document)
        except Exception as e:
            errors.append({"file": input_file.filename, "error": str(e)})
    if not created_documents:
        raise HTTPException(
            status_code=500, detail=f"No documents created. Errors: {errors}"
        )
    return created_documents


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
