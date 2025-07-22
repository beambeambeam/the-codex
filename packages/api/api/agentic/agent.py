from abc import ABC, abstractmethod

from ..collection.dependencies import CollectionService
from ..document.service import DocumentServiceSearch as DocumentService
from ..models.user import User
from .core import (
    TextEmbedder,
)
from .pocketflow_custom import Flow  # PocketFlow custom components
from .schemas import (
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
        document_service: DocumentService,
        collection_service: CollectionService,
        embedding_model: TextEmbedder,
        current_user: User,
    ):
        # Initialize Services
        self.document_service = document_service
        self.collection_service = collection_service
        self.embedding_model = embedding_model
        self.current_user = current_user

        self.shared_data: SharedStore = SharedStore()
        self.flow: Flow = self.create_online_rag_flow()

    def run(self, collection_chat_id: str, user_question: str) -> SharedStore:
        """
        Run the RAG agent with the provided user question.
        This method initializes the shared data and runs the flow.
        """
        self.reset_shared_data()
        self.shared_data.current_user = self.current_user

        self.shared_data.user_question = user_question
        self.flow.run(shared=self.shared_data)

        return self.shared_data

    def reset_shared_data(self):
        """
        Reset the shared data to its initial state.
        """
        self.shared_data = SharedStore()
        print("Shared data has been reset.")

    def change_collection_id(self, collection_id: str):
        """
        Change the collection ID in the shared data.
        """
        self.shared_data.collection_id = collection_id
        print(f"Collection ID changed to: {collection_id}")
