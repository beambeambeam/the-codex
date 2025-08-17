import asyncio

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    UploadFile,
    status,
)

from api.agentic.agent import rag_agent
from api.agentic.schemas import AgentResponse, RAGQueryRequest
from api.auth.schemas import UserResponse
from api.chat.dependencies import get_chat_or_404
from api.clustering.schemas import ClusteringResponse
from api.document.schemas import (
    DocumentCreate,
    DocumentResponse,
    DocumentResponseTruncated,
)
from api.models.chat import CollectionChat
from api.storage import storage_service

from .core.ingestion.schemas import FileInput
from .dependencies import (
    DocumentIngestorService,
    DocumentService,
    TopicModellingService,
    User,
    get_current_user,
    get_document_ingestor,
    get_document_service,
    get_rag_agent,
    get_topic_modelling_service,
)
from .utils import normalize_file_input

router = APIRouter(prefix="/agentic", tags=["agentic"])


@router.post(
    "/upload_ingest",
    response_model=list[DocumentResponseTruncated],
    tags=["agentic"],
    status_code=status.HTTP_201_CREATED,
)
async def upload_and_ingest_documents(
    collection_id: str,
    document_ingestor: DocumentIngestorService = Depends(get_document_ingestor),
    document_service: DocumentService = Depends(get_document_service),
    topic_modelling_service: TopicModellingService = Depends(
        get_topic_modelling_service
    ),
    current_user: User = Depends(get_current_user),
    *,
    input_files: list[UploadFile],
):
    """
    Ingest multiple documents into the system.
    This endpoint allows users to upload multiple documents for processing and storage.
    Returns after all documents have been ingested and clustering has been completed.
    """
    created_documents = []
    errors = []
    for input_file in input_files:
        try:
            object_name, file_type, _ = DocumentService.prepare_file_upload(
                input_file, current_user.id, collection_id
            )

            # Read file content once at the beginning
            file_content = await input_file.read()
            if not file_content:
                raise HTTPException(
                    status_code=400,
                    detail=f"Uploaded file is empty: {input_file.filename}",
                )

            # Rewind the file to be read again by the storage service
            await input_file.seek(0)

            stored_path = await storage_service.upload_file_to_storage(
                input_file, object_name
            )

            document = document_service.create_document(
                document_data=DocumentCreate(
                    file_name=input_file.filename or "uploaded_file",
                    file_type=file_type,
                    file_size=len(file_content),
                    source_file_path=stored_path,
                    collection_id=collection_id,
                ),
                user=current_user,
            )
            if not document:
                raise RuntimeError(
                    f"Failed to create document record for {input_file.filename}"
                )
            formatted_input = FileInput(
                name=input_file.filename or "uploaded_file",
                file_name=input_file.filename or "uploaded_file",
                content=file_content,
                type=file_type,
                is_path=False,
            )
            input_file_model: FileInput = normalize_file_input(formatted_input)

            # detach user/ document
            current_user = UserResponse.model_validate(current_user)
            current_document = DocumentResponse.model_validate(document)

            # Ingest the document
            await document_ingestor.ingest_file(
                input_file=input_file_model,
                document=current_document,
                graph_extract=False,
                user=current_user,
            )
            created_documents.append(document)
        except Exception as e:
            errors.append({"file": input_file.filename, "error": str(e)})
    if not created_documents:
        raise HTTPException(
            status_code=500, detail=f"No documents created. Errors: {errors}"
        )

    # Trigger clustering after a short delay
    await asyncio.sleep(2)
    try:
        await topic_modelling_service.cluster_and_store_documents(
            collection_id=collection_id,
            user=current_user,
            cluster_title_top_n_topics=5,
            cluster_title_top_n_words=50,
            title_generated_methods="by_summaries",
        )
    except Exception as e:
        print(f"Automatic clustering failed for collection {collection_id}: {str(e)}")

    return created_documents


@router.post(
    "/graph_extract/{document_id}",
    response_model=DocumentResponseTruncated,
    tags=["agentic"],
    status_code=status.HTTP_200_OK,
)
async def graph_extract(
    document_id: str,
    document_service: DocumentService = Depends(get_document_service),
    document_ingestor: DocumentIngestorService = Depends(get_document_ingestor),
    current_user: User = Depends(get_current_user),
):
    """
    Extracts a knowledge graph from the documents in a collection.
    """
    document = document_service.get_document(document_id)
    if not document:
        raise HTTPException(
            status_code=404, detail=f"Document with ID {document_id} not found"
        )

    if document.is_graph_extracted:
        raise HTTPException(
            status_code=400,
            detail=f"Knowledge graph already extracted for document {document_id}",
        )

    # Extract knowledge graph from the document
    full_text = document.document or ""
    if not full_text:
        raise HTTPException(
            status_code=400, detail="Document content is empty or not available"
        )

    kg = await document_ingestor._extract_and_store_knowledge_graph(
        full_text=full_text,
        title=document.title,
        description=document.description,
        document_id=document.id,
        user=current_user,
    )

    document_ingestor._merge_and_store_collection_knowledge_graph(
        kg=kg,
        collection_id=document.collection_id,
        user=current_user,
    )

    if not document:
        raise HTTPException(
            status_code=404, detail=f"Document with ID {document_id} not found"
        )

    return document


@router.post(
    "/cluster_topic",
    response_model=ClusteringResponse,
    tags=["agentic"],
    status_code=status.HTTP_200_OK,
)
async def cluster_documents(
    collection_id: str,
    topic_modelling_service: TopicModellingService = Depends(
        get_topic_modelling_service
    ),
    user: User = Depends(get_current_user),
):
    """
    Clusters document chunks in a collection and generates descriptive topic titles.

    Parameters:
    - collection_id: The ID of the collection to process.
    - cluster_title_top_n_topics: The number of top contributing topics to use for generating a cluster title.
    - cluster_title_top_n_words: The number of keywords to extract from each contributing topic.
    """
    return await topic_modelling_service.cluster_and_store_documents(
        collection_id=collection_id,
        user=user,
        cluster_title_top_n_topics=5,
        cluster_title_top_n_words=50,
        title_generated_methods="by_summaries",
    )


@router.post(
    "/rag_query",
    response_model=AgentResponse,
    tags=["agentic"],
    status_code=status.HTTP_200_OK,
)
async def rag_query(
    request: RAGQueryRequest,
    collection_chat: CollectionChat = Depends(get_chat_or_404),
    rag_agent: rag_agent = Depends(get_rag_agent),
):
    """
    Query the RAG agent with a user question and return the answer.
    """
    if not request.user_question:
        raise HTTPException(status_code=400, detail="User question cannot be empty")

    if request.reference:
        rag_agent.create_flow(flow_type="document")
    else:
        rag_agent.create_flow(flow_type="collection")

    shared_store = rag_agent.run(
        user_question=request.user_question,
        collection_chat_id=collection_chat.id,
        references=request.reference,
    )

    return AgentResponse(
        chat_history=shared_store.chat_history,
        retrieved_contexts=shared_store.retrieved_contexts,
    )
