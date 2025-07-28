from fastapi import APIRouter, Depends, HTTPException, UploadFile, status

from api.agentic.agent import rag_agent
from api.agentic.schemas import AgentResponse
from api.chat.dependencies import get_chat_or_404
from api.document.schemas import DocumentCreate, DocumentResponse
from api.models.chat import CollectionChat
from api.storage import storage_service

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
    get_rag_agent,
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
    description: str = None,
):
    """
    Ingest documents into the system.
    This endpoint allows users to upload documents for processing and storage.
    """

    file_name = file_name or input_file.filename

    try:
        # Read the file content once and store it
        file_content = await input_file.read()

        # Validate that content is not empty
        if not file_content:
            raise HTTPException(status_code=400, detail="Uploaded file is empty")

        formatted_input = FileInput(
            name=file_name,
            file_name=file_name,
            content=file_content,
            type=input_file.content_type or "application/octet-stream",
            is_path=False,
        )

        stored_path = await storage_service.upload_file_to_storage(
            file=input_file,
        )

        # Normalize input using Pydantic model
        input_file: FileInput = normalize_file_input(formatted_input)

        # Create document record
        document = document_service.create_document(
            document_data=DocumentCreate(
                file_name=input_file.name,
                description=description,
                file_type=input_file.type,
                file_size=len(input_file.content),
                source_file_path=stored_path,
                collection_id=collection_id,
            ),
            user=current_user,
        )

        if not document:
            raise RuntimeError(
                f"Failed to create document record for {input_file.name}"
            )

        try:
            await document_ingestor.ingest_file(
                input_file=formatted_input,
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
                detail=f"Error ingesting file {input_file.name}: {str(e)}",
            ) from e

        return document

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error processing file: {str(e)}"
        ) from e


@router.post(
    "/ingest",
    response_model=DocumentResponse,
    tags=["agentic"],
    status_code=status.HTTP_201_CREATED,
)
async def ingest_documents(
    document_id: str,
    graph_extract: bool = True,
    document_ingestor: DocumentIngestorService = Depends(get_document_ingestor),
    document_service: DocumentService = Depends(get_document_service),
    current_user: User = Depends(get_current_user),
):
    """
    Ingest documents into the system.
    This endpoint allows users to upload documents for processing and storage.
    """
    document = document_service.get_document(document_id=document_id)
    file_content = storage_service.download_file_from_storage(
        object_name=document.source_file_path
    )
    if not file_content:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="File not found in storage"
        )

    # Normalize input using Pydantic model
    input_file = FileInput(
        name=document.file_name,
        file_name=document.file_name,
        content=file_content,
        type=document.file_type,
        is_path=False,
    )

    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Document not found"
        )

    try:
        await document_ingestor.ingest_file(
            input_file=input_file,
            document=document,
            graph_extract=graph_extract,
            user=current_user,
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error ingesting document: {str(e)}",
        ) from e

    return document


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


@router.post(
    "/rag_query",
    response_model=AgentResponse,
    tags=["agentic"],
    status_code=status.HTTP_200_OK,
)
async def rag_query(
    user_question: str,
    collection_chat: CollectionChat = Depends(get_chat_or_404),
    rag_agent: rag_agent = Depends(get_rag_agent),
):
    """
    Query the RAG agent with a user question and return the answer.
    """
    if not user_question:
        raise HTTPException(status_code=400, detail="User question cannot be empty")

    shared_store = rag_agent.run(
        user_question=user_question,
        collection_chat_id=collection_chat.id,
    )

    # Clear chunks text to avoid sending large data back
    if shared_store.retrieved_contexts:
        for context in shared_store.retrieved_contexts:
            context.chunk_text = (
                context.chunk_text[:100] + "..."
                if len(context.chunk_text) > 100
                else context.chunk_text
            )

    return AgentResponse(
        chat_history=shared_store.chat_history,
        retrieved_contexts=shared_store.retrieved_contexts,
    )
