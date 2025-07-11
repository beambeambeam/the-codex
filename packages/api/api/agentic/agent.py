from abc import ABC, abstractmethod

from ..collection.dependencies import CollectionService
from ..document.service import DocumentServiceSearch as DocumentService
from ..models.user import User
from .core import (
    TextEmbedder,
)
from .node import (
    EmbedQueryNode,
    GenerateResponseNode,
    GetInputAppendHistoryNode,
    SearchPgvectorNode,
)
from .pocketflow_custom import Flow  # PocketFlow custom components
from .schemas import (
    ChatHistory,
    ChatMessage,
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
        self.shared_data.chat_history = self.get_current_chat(collection_chat_id)
        self.shared_data.chat_session = self.collection_service.get_collection_chat(
            collection_chat_id=collection_chat_id
        )
        self.shared_data.current_user = self.current_user

        self.shared_data.user_question = user_question
        self.flow.run(shared=self.shared_data)

        return self.shared_data

    def get_current_chat(self, collection_chat_id: str) -> ChatHistory:
        """
        Get the current chat based on the provided chat ID.
        This method can be used to retrieve the chat context for the agent.
        """
        chat_history = self.collection_service.get_chat_history_list(
            collection_chat_id=collection_chat_id, limit=100
        )

        # format into a list of ChatMessage objects
        return ChatHistory(
            messages=[
                ChatMessage(role=msg.role, content=msg.content) for msg in chat_history
            ]
        )

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

    def create_online_rag_flow(self) -> Flow:
        """
        Creates and returns a PocketFlow for the online RAG process.
        """
        input_node = GetInputAppendHistoryNode(
            collection_service=self.collection_service
        )
        embed_q_node = EmbedQueryNode(embedding_model=self.embedding_model)
        search_db_node = SearchPgvectorNode(
            document_service=self.document_service, TOP_K=5
        )
        generate_ans_node = GenerateResponseNode(
            collection_service=self.collection_service
        )

        input_node >> embed_q_node
        embed_q_node >> search_db_node
        search_db_node >> generate_ans_node

        online_flow = Flow(start=input_node, name="Online_RAG_Query_Flow", debug=True)
        return online_flow
