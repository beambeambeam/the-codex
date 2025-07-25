from fastapi import Depends

from ..auth.dependencies import get_current_user
from ..collection.dependencies import get_collection_service
from ..collection.service import CollectionService
from ..document.dependencies import get_document_service
from ..document.service import DocumentService
from ..models.user import User
from .agent import rag_agent
from .core import (
    DocumentClusteringService,
    DocumentIngestorService,
    KnowledgeGraphExtractor,
    TextEmbedder,
    # call_llm,
    call_llm_async,
)
from .core.embedding.embedding import MODEL_BACKEND_MAP
from .core.prompts.prompt_manager import render_knowledge_graph_extraction_prompt


def get_knowledge_graph_extractor() -> KnowledgeGraphExtractor:
    """
    Returns an instance of KnowledgeGraphExtractor with the necessary dependencies.
    """
    llm_caller = call_llm_async
    prompt_renderer = render_knowledge_graph_extraction_prompt

    return KnowledgeGraphExtractor(
        llm_caller=llm_caller, prompt_renderer=prompt_renderer
    )


def get_text_embedder() -> TextEmbedder:
    """
    Returns an instance of TextEmbedder with the necessary dependencies.
    """
    model = "FlukeTJ/bge-m3-m2v-distilled-256"
    backend = MODEL_BACKEND_MAP.get(model, None)
    if backend is None:
        raise ValueError(f"Unsupported model: {model}")

    return TextEmbedder(
        model_name=model,
        backend=backend,
        cache_folder="cache_models",  # For sentence_transformers
    )


def get_document_ingestor(
    user: User = Depends(get_current_user),
    document_service: DocumentService = Depends(get_document_service),
    text_embedder: TextEmbedder = Depends(get_text_embedder),
    graph_extractor: KnowledgeGraphExtractor = Depends(get_knowledge_graph_extractor),
) -> DocumentIngestorService:
    """
    Returns an instance of DocumentIngestor with the necessary dependencies.
    """
    return DocumentIngestorService(
        document_service=document_service,
        text_embedder=text_embedder,
        kg_extractor=graph_extractor,
    )


def get_document_clustering_service(
    document_service: DocumentService = Depends(get_document_service),
) -> DocumentClusteringService:
    """
    Returns an instance of DocumentClusteringService with the necessary dependencies.
    """
    return DocumentClusteringService(
        document_service=document_service,
    )


def get_rag_agent(
    user: User = Depends(get_current_user),
    document_service: DocumentService = Depends(get_document_service),
    text_embedder: TextEmbedder = Depends(get_text_embedder),
    collection_service: CollectionService = Depends(get_collection_service),
) -> rag_agent:
    """
    Returns an instance of rag_agent with the necessary dependencies.
    """
    return rag_agent(
        current_user=user,
        document_service=document_service,
        collection_service=collection_service,
        embedding_model=text_embedder,
    )
