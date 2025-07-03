from fastapi import Depends

from ...auth.dependencies import get_current_user
from ...document.dependencies import get_document_service
from ...document.service import DocumentService
from ...models.user import User
from .call_llm import call_llm
from .embedding.embedding import MODEL_BACKEND_MAP, TextEmbedder
from .graph.graph_extract import KnowledgeGraphExtractor
from .ingestion.document_ingest import DocumentIngestor
from .prompts.prompt_manager import render_knowledge_graph_extraction_prompt


def get_knowledge_graph_extractor() -> KnowledgeGraphExtractor:
    """
    Returns an instance of KnowledgeGraphExtractor with the necessary dependencies.
    """
    llm_caller = call_llm
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
) -> DocumentIngestor:
    """
    Returns an instance of DocumentIngestor with the necessary dependencies.
    """
    return DocumentIngestor(
        document_service=document_service,
        text_embedder=text_embedder,
        knowledge_graph_extractor=graph_extractor,
    )
