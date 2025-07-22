from enum import Enum
from typing import Any, Optional

from ..document.schemas import ChunkSearchResponse
from ..document.service import DocumentServiceSearch as DocumentService
from .core import TextEmbedder, call_llm
from .pocketflow_custom import Node
from .schemas import SharedStore

# Order: EmbedQueryNode -> SearchPgvectorNode -> GenerateResponseNode


class NodeStatus(str, Enum):
    DEFAULT = "default"  # Default status for nodes
    RETRY = "retry"  # Status to indicate a retry is needed
    ERROR = "error"  # Status to indicate an error occurred


class EmbedQueryNode(Node):
    def __init__(self, embedding_model: TextEmbedder, name="", max_retries=1, wait=0):
        super().__init__(name, max_retries, wait)
        self.embedding_model = embedding_model

    def prep(self, shared: SharedStore) -> Optional[str]:
        user_question = shared.user_question
        if not user_question:
            print("EmbedQueryNode: No user question found in shared store.")
            return None
        return user_question

    def exec(self, question: Optional[str]) -> Optional[list[float]]:
        if not question:
            return None
        try:
            return self.embedding_model.get_embedding(question)
        except Exception as e:
            print(
                f"EmbedQueryNode: Error generating embedding for question '{question[:30]}...': {e}"
            )
            return None

    def post(self, shared: SharedStore, prep_res: Any, exec_res: Optional[list[float]]):
        shared.query_embedding = exec_res  # exec_res is List[float] or None
        if exec_res is None:
            print(
                "EmbedQueryNode: Embedding generation failed or no question provided."
            )
        else:
            print("EmbedQueryNode: Query embedding stored in shared store.")
        return NodeStatus.DEFAULT.value


class SearchPgvectorNode(Node):
    def __init__(
        self, document_service: DocumentService, name="", max_retries=3, wait=0, TOP_K=5
    ):
        super().__init__(name, max_retries, wait)
        self.document_service = document_service
        self.TOP_K = TOP_K

    def prep(self, shared: SharedStore) -> Optional[dict[str, Any]]:
        if shared.query_embedding is None:
            print("SearchPgvectorNode: No query embedding found in shared store.")
            return None
        return {
            "embedding": shared.query_embedding,
            "collection_id": shared.chat_session.collection_id,
            "top_k": self.TOP_K,
        }

    def exec(self, inputs: dict[str, Any]) -> list[ChunkSearchResponse]:
        if inputs.get("embedding") is None:
            return []
        try:
            retrieved_docs = self.document_service.search_collection_chunks(
                collection_id=inputs.get("collection_id"),
                query_embedding=inputs.get("embedding"),
                top_k=inputs.get("top_k"),
            )
            print(
                f"SearchPgvectorNode: Retrieved {len(retrieved_docs)} documents from DB."
            )
            return retrieved_docs
        except Exception as e:
            print(f"SearchPgvectorNode: Error searching documents in DB: {e}")
            return []

    def post(
        self,
        shared: SharedStore,
        prep_res: Any,
        exec_res: list[ChunkSearchResponse],
    ):
        shared.retrieved_contexts = exec_res
        if exec_res is None:
            print("SearchPgvectorNode: No relevant contexts retrieved.")
        else:
            print(
                f"SearchPgvectorNode: Stored {len(exec_res)} retrieved contexts in shared store."
            )
        return NodeStatus.DEFAULT.value


class GenerateResponseNode(Node):
    def prep(self, shared: SharedStore) -> Optional[dict[str, Any]]:
        retrieved_contexts: list[ChunkSearchResponse] = shared.retrieved_contexts

        return {
            "contexts": retrieved_contexts,
        }

    def exec(self, inputs: dict[str, Any]) -> str:
        if not inputs.get("contexts"):
            return "I'm sorry, I couldn't process your request due to missing contexts."

        contexts: list[ChunkSearchResponse] = inputs["contexts"]

        context_str_parts = []
        for ctx_chunk in contexts:
            context_str_parts.append(f"Content: {ctx_chunk.chunk_text}")

        print(f"GenerateResponseNode: Calling LLM with {len(contexts)} contexts.")
        try:
            llm_answer = call_llm(context_str_parts)
            return llm_answer
        except Exception as e:
            print(f"GenerateResponseNode: Error calling LLM: {e}")
            return "I encountered an error trying to generate a response."

    def post(self, shared: SharedStore, prep_res: Any, exec_res: str):
        shared.llm_answer = exec_res
        print(f"GenerateResponseNode: LLM response generated: {exec_res[:50]}...")
        return NodeStatus.DEFAULT.value
