from abc import ABC, abstractmethod
from typing import Literal

from loguru import logger

from api.chat.service import ChatService
from api.collection.service import CollectionService
from api.document.service import DocumentServiceSearch as DocumentService
from api.models.user import User

from .core import (
    TextEmbedder,
)
from .flow import (
    create_collection_rag_flow,
    create_document_rag_flow,
)
from .pocketflow_custom import Flow  # PocketFlow custom components
from .schemas import (
    ChatHistoryResponse,
    ChatMessageResponse,
    SharedStore,  # Adjust relative import
)


class agentic_base(ABC):
    """
    Base class for Agentic components.
    This class provides a common interface for all agentic components.
    """

    @abstractmethod
    def run(self, *args, **kwargs):
        """
        Run the agentic component with the provided arguments.
        This method should be implemented by subclasses.
        """
        pass


class rag_agent(agentic_base):
    """
    A class representing the RAG (Retrieval-Augmented Generation) agent.
    This class encapsulates the logic for handling online RAG queries.
    """

    def __init__(
        self,
        collection_service: CollectionService,
        document_service: DocumentService,
        chat_service: ChatService,
        embedding_model: TextEmbedder,
        current_user: User,
    ):
        # Initialize Services
        self.collection_service = collection_service
        self.document_service = document_service
        self.chat_service = chat_service
        self.embedding_model = embedding_model
        self.current_user = current_user

        self.shared_data: SharedStore = SharedStore()
        self.flow: Flow = None

    def get_current_chat_history(self, collection_chat_id: str) -> ChatHistoryResponse:
        """
        Retrieve the current chat history for the given collection chat ID.
        This method fetches the chat history from the chat service.
        """
        chat_history = self.chat_service.list_histories(collection_chat_id)
        return ChatHistoryResponse(
            messages=[
                ChatMessageResponse.model_validate(history) for history in chat_history
            ]
        )

    def run(
        self, collection_chat_id: str, user_question: str, references: list[str] = None
    ) -> SharedStore:
        """
        Run the RAG agent with the provided user question.
        This method initializes the shared data and runs the flow.
        """
        if references is None:
            references = []
        if self.flow is None:
            raise ValueError("Flow is not initialized. Please create a flow first.")

        self.reset_shared_data()
        self.shared_data.current_user = self.current_user

        self.shared_data.user_question = user_question
        self.shared_data.chat_session = self.chat_service.get_chat(collection_chat_id)

        # get current information of asking collection
        self.shared_data.chat_history = self.get_current_chat_history(
            collection_chat_id
        )
        self.shared_data.current_collection = self.collection_service.get_collection(
            self.shared_data.chat_session.collection_id
        )
        self.shared_data.current_documents = (
            self.document_service.get_collection_documents(
                collection_id=self.shared_data.current_collection.id
            )
        )
        self.shared_data.document_references_id = references

        logger.info(
            f"Running RAG agent for user: {self.current_user.username}, "
            f"collection: {self.shared_data.current_collection.name}, "
            f"question: {user_question}"
        )

        self.flow.run(shared=self.shared_data)

        return self.shared_data

    def reset_shared_data(self):
        """
        Reset the shared data to its initial state.
        """
        self.shared_data = SharedStore()
        print("Shared data has been reset.")

    def create_flow(
        self, flow_type: Literal["collection", "document"] = "collection"
    ) -> None:
        """
        Creates and returns a PocketFlow based on the specified flow type.
        """
        if flow_type == "collection":
            logger.info("Creating collection RAG flow")
            self.flow = create_collection_rag_flow(
                document_service=self.document_service,
                chat_service=self.chat_service,
                embedding_model=self.embedding_model,
                debug=True,
            )
        elif flow_type == "document":
            logger.info("Creating document RAG flow")
            self.flow = create_document_rag_flow(
                document_service=self.document_service,
                chat_service=self.chat_service,
                embedding_model=self.embedding_model,
                debug=True,
            )
        else:
            raise ValueError(f"Unknown flow type: {flow_type}")
