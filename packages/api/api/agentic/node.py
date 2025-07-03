from typing import Any, Optional

from ..document.service import DocumentServiceSearch as DocumentService
from ..document.schemas import ChunkSearched
from .core import DocumentIngestor, KnowledgeGraphExtractor, TextEmbedder, call_llm
from .core.dependencies import get_text_embedder
from .pocketflow_custom import Node
from .schemas import ChatMessage, SharedStore

# Order: GetUserInputNode -> EmbedQueryNode -> SearchPgvectorNode -> GenerateResponseNode


class GetInputAppendHistoryNode(Node):
    def prep(self, shared: SharedStore) -> Optional[str]:
        user_question = shared.user_question
        if not user_question:
            print("GetUserInputNode: No user question found in shared store.")
            return None
        return user_question

    def exec(self, user_question: Any) -> str:
        return user_question

    def post(self, shared: SharedStore, prep_res: Any, exec_res: str):
        shared.user_question = exec_res
        if shared.chat_history:
            shared.chat_history.append(ChatMessage(role="user", content=exec_res))
        print(f"GetUserInputNode: Received question: '{exec_res}'")
        return "default"


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
        return "default"


class SearchPgvectorNode(Node):
    def __init__(
        self, document_service: DocumentService, name="", max_retries=1, wait=0
    ):
        super().__init__(name, max_retries, wait)
        self.document_service = document_service

    def prep(self, shared: SharedStore) -> Optional[dict[str, Any]]:
        query_embedding = shared.query_embedding
        if query_embedding is None:
            print("SearchPgvectorNode: No query embedding found in shared store.")
            return None
        return {
            "embedding": query_embedding,
            "collection_id": shared.collection_id,
            "top_k": 5,
        }

    def exec(self, inputs: dict[str, Any]) -> list[ChunkSearched]:
        if inputs["embedding"] is None:
            return []
        try:
            retrieved_docs = self.document_service.search_chunks(
                collection_id=inputs["collection_id"],
                query_embedding=inputs["embedding"],
                top_k=inputs["top_k"],
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
        exec_res: list[ChunkSearched],
    ):
        shared.retrieved_contexts = exec_res
        if exec_res is None:
            print("SearchPgvectorNode: No relevant contexts retrieved.")
        else:
            print(
                f"SearchPgvectorNode: Stored {len(exec_res)} retrieved contexts in shared store."
            )
        return "default"


class GenerateResponseNode(Node):
    def prep(self, shared: SharedStore) -> Optional[dict[str, Any]]:
        user_question = shared.user_question
        retrieved_contexts: list[ChunkSearched] = shared.retrieved_contexts
        return {"question": user_question, "contexts": retrieved_contexts}

    def exec(self, inputs: dict[str, Any]) -> str:
        if not inputs.get("question"):
            return (
                "I'm sorry, I couldn't process your request due to missing information."
            )

        question = inputs["question"]
        contexts: list[ChunkSearched] = inputs["contexts"]

        context_str_parts = []
        for ctx_chunk in contexts:
            context_str_parts.append(f"Content: {ctx_chunk.chunk_text}")
        context_str = "\n\n---\n\n".join(context_str_parts)

        if not contexts:
            prompt = f"Please answer the following question: {question}\n\n(No specific context documents were found for this question.)"
        else:
            prompt = (
                f"Based on the following context, please answer the question.\n\n"
                f"Context Documents:\n{context_str}\n\n"
                f"Question: {question}\n\nAnswer:"
            )

        print(f"\nGenerateResponseNode: Prompting LLM (length: {len(prompt)} chars)...")
        try:
            llm_answer = call_llm(prompt)
            return llm_answer
        except Exception as e:
            print(f"GenerateResponseNode: Error calling LLM: {e}")
            return "I encountered an error trying to generate a response."

    def post(self, shared: SharedStore, prep_res: Any, exec_res: str):
        shared.llm_answer = exec_res
        if shared.chat_history and shared.user_question:
            shared.chat_history.append(ChatMessage(role="assistant", content=exec_res))
        return "default"
