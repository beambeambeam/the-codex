from typing import Any, Literal, Optional

from api.chat.schemas import CollectionChatHistoryCreate, CollectionChatReferenceCreate
from api.chat.service import ChatService
from api.document.schemas import ChunkSearchResponse
from api.document.service import DocumentServiceSearch as DocumentService
from api.models.chat import CollectionChatReference
from api.models.user import User

from .core import TextEmbedder, call_llm, call_structured_llm
from .core.prompts import render_collection_rag_agent_prompt
from .pocketflow_custom import Node
from .schemas import ChatHistory, ChatMessage, NodeStatus, SharedStore, UserIntent

# Order: EmbedQueryNode -> SearchPgvectorNode -> GenerateResponseNode


class CollectionNode(Node):
    """
    Node to save data to the collection service.
    This node can be used to save any data that needs to be persisted across nodes.
    """

    def __init__(self, chat_service: ChatService, name="", max_retries=1, wait=0):
        super().__init__(name, max_retries, wait)
        self.chat_service = chat_service

    def _save_context_references(
        self,
        collection_chat_history_id: str,
        context_references: list[ChunkSearchResponse],
        context_type: Literal["chunk", "graph"] = "chunk",
    ) -> list[CollectionChatReference]:
        """
        Save context references to the database.
        This method can be used to persist context references after processing.
        """
        saved_references = []
        for context in context_references:
            reference_data = CollectionChatReferenceCreate(
                collection_chat_history_id=collection_chat_history_id,
                document_id=context.document_id,
                chunk_id=context.id,
                type=context_type,
            )
            reference = self.chat_service.create_reference(reference_data)
            saved_references.append(reference)
        return saved_references

    def _save_chat_message(
        self,
        collection_chat_id: str,
        current_user: User,
        message: ChatMessage,
    ):
        """
        Save the current chat history to the database.
        This method can be used to persist the chat history after processing.
        """
        chat_message = CollectionChatHistoryCreate(
            role=message.role,
            content=message.content,
            collection_chat_id=collection_chat_id,
        )

        created_message = self.chat_service.create_history(chat_message, current_user)
        if message.retrieved_contexts:
            self._save_context_references(
                collection_chat_history_id=created_message.id,
                context_references=message.retrieved_contexts,
            )

        return created_message

    def save_chat_history(
        self,
        collection_chat_id: str,
        current_user: User,
        chat_history: ChatHistory,
    ) -> CollectionChatHistoryCreate:
        for message in chat_history.messages:
            self._save_chat_message(
                collection_chat_id=collection_chat_id,
                current_user=current_user,
                message=message,
            )
        return chat_history


class GetInputAppendHistoryNode(Node):
    """
    Node to get user input and append it to chat history if available.
    """

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
        new_message = ChatMessage(
            collection_chat_id=shared.chat_session.id,
            role="user",
            content=exec_res,
        )
        shared.new_chat_history.messages.append(new_message)
        shared.chat_history.messages.append(new_message)

        print(f"GetUserInputNode: Received question: '{exec_res}'")
        return NodeStatus.DEFAULT.value


class GetUserIntentNode(Node):
    """
    Node to determine the user's intent based on the question.
    This node can be used to classify the user's query into predefined intents.
    """

    def prep(self, shared: SharedStore) -> Optional[str]:
        user_question = shared.user_question
        if not user_question:
            print("GetUserIntentNode: No user question found in shared store.")
            return None
        return user_question

    def exec(self, user_question: str) -> UserIntent:
        user_intent = call_structured_llm(
            prompt=f"You are an intent classifier. Classify the following question: {user_question}",
            model=UserIntent,
            max_retries=3,
        )
        return user_intent

    def post(self, shared: SharedStore, prep_res: Any, exec_res: UserIntent):
        shared.user_intent = exec_res
        print(
            f"GetUserIntentNode: Identified intent: {exec_res.intent.value} with confidence {exec_res.confidence}"
        )
        return exec_res.intent


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
            print(
                f"EmbedQueryNode: Embedding vector length: {len(exec_res)} Query embedding stored in shared store."
            )
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
    """
    Node to generate a generic answer based on the user's question.
    This node can be used to provide a response when no specific intent is identified.
    """

    def prep(self, shared: SharedStore) -> Optional[str]:
        chat_history = shared.chat_history
        if not chat_history:
            print("GenericAnswerNode: No user question found in shared store.")
            return None
        return chat_history

    def exec(self, chat_history: ChatHistory) -> str:
        return call_llm(chat_history)

    def post(self, shared: SharedStore, prep_res: Any, exec_res: str):
        shared.llm_answer = exec_res
        print(f"GenericAnswerNode: Generated answer: {exec_res[:50]}...")

        new_message = ChatMessage(
            collection_chat_id=shared.chat_session.id,
            role="user",
            content=exec_res,
        )
        shared.new_chat_history.messages.append(new_message)
        shared.chat_history.messages.append(new_message)

        return NodeStatus.DEFAULT.value


class GenerateResponseFromContextNode(Node):
    def prep(self, shared: SharedStore) -> Optional[dict[str, Any]]:
        return {
            "contexts": shared.retrieved_contexts,
            "chat_history": shared.chat_history.model_copy(deep=True),
            "question": shared.user_question,
            "collection_chat_id": shared.chat_session.id,
        }

    def exec(self, inputs: dict[str, Any]) -> str:
        if not inputs.get("contexts"):
            return "I'm sorry, I couldn't process your request due to missing contexts."

        contexts: list[ChunkSearchResponse] = inputs["contexts"]

        context_str_parts = []
        for ctx_chunk in contexts:
            context_str_parts.append(ctx_chunk.chunk_text)

        prompt = render_collection_rag_agent_prompt(
            question=inputs["question"],
            contexts=context_str_parts,
        )

        # Temporarily append the user question to the chat history
        chat_history: ChatHistory = inputs["chat_history"]

        chat_history.messages.append(
            ChatMessage(
                collection_chat_id=inputs["collection_chat_id"],
                role="user",
                content=prompt,
            )
        )

        print(f"GenerateResponseNode: Calling LLM with {len(contexts)} contexts.")
        try:
            llm_answer = call_llm(chat_history)
            return llm_answer
        except Exception as e:
            print(f"GenerateResponseNode: Error calling LLM: {e}")
            return "I encountered an error trying to generate a response."

    def post(self, shared: SharedStore, prep_res: Any, exec_res: str):
        shared.llm_answer = exec_res
        print(f"GenerateResponseNode: LLM response generated: {exec_res[:1000]}...")

        new_message = ChatMessage(
            collection_chat_id=shared.chat_session.id,
            role="user",
            content=exec_res,
            retrieved_contexts=shared.retrieved_contexts,
        )
        shared.new_chat_history.messages.append(new_message)
        shared.chat_history.messages.append(new_message)

        return NodeStatus.DEFAULT.value


class SaveChatHistoryNode(CollectionNode):
    """
    Node to save the chat history and context references after processing.
    This node can be used to persist the chat history and context references.
    """

    def prep(self, shared: SharedStore) -> Optional[dict[str, Any]]:
        return {
            "chat_history": shared.new_chat_history,
            "collection_chat_id": shared.chat_session.id,
            "current_user": shared.current_user,
        }

    def exec(self, inputs: dict[str, Any]) -> None:
        self.save_chat_history(
            collection_chat_id=inputs["collection_chat_id"],
            current_user=inputs["current_user"],
            chat_history=inputs["chat_history"],
        )

    def post(self, shared: SharedStore, prep_res: Any, exec_res: None):
        print("SaveChatHistoryNode: Chat history and context references saved.")
        return NodeStatus.DEFAULT.value
