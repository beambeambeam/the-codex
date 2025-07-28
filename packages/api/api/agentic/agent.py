from abc import ABC, abstractmethod

from api.chat.service import ChatService
from api.document.service import DocumentServiceSearch as DocumentService
from api.models.user import User

from .core import (
    TextEmbedder,
)
from .node import (
    EmbedQueryNode,
    GenerateResponseFromContextNode,
    GenerateResponseNode,
    GetInputAppendHistoryNode,
    GetUserIntentNode,
    SaveChatHistoryNode,
    SearchPgvectorNode,
)
from .pocketflow_custom import Flow  # PocketFlow custom components
from .schemas import (
    INTENT,
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
        chat_service: ChatService,
        embedding_model: TextEmbedder,
        current_user: User,
    ):
        # Initialize Services
        self.document_service = document_service
        self.chat_service = chat_service
        self.embedding_model = embedding_model
        self.current_user = current_user

        self.shared_data: SharedStore = SharedStore()
        self.flow: Flow = self.create_online_rag_flow()

    def get_current_chat_history(self, collection_chat_id: str) -> ChatHistory:
        """
        Retrieve the current chat history for the given collection chat ID.
        This method fetches the chat history from the chat service.
        """
        chat_history = self.chat_service.list_histories(collection_chat_id)
        return ChatHistory(
            messages=[ChatMessage.model_validate(history) for history in chat_history]
        )

    def run(self, collection_chat_id: str, user_question: str) -> SharedStore:
        """
        Run the RAG agent with the provided user question.
        This method initializes the shared data and runs the flow.
        """
        self.reset_shared_data()
        self.shared_data.current_user = self.current_user

        self.shared_data.user_question = user_question
        self.shared_data.chat_session = self.chat_service.get_chat(collection_chat_id)
        self.shared_data.chat_history = self.get_current_chat_history(
            collection_chat_id
        )
        self.flow.run(shared=self.shared_data)

        return self.shared_data

    def reset_shared_data(self):
        """
        Reset the shared data to its initial state.
        """
        self.shared_data = SharedStore()
        print("Shared data has been reset.")

    def create_online_rag_flow(self, intent: INTENT = None) -> Flow:
        """
        Creates and returns a PocketFlow for the online RAG process.
        """
        input_node = GetInputAppendHistoryNode()
        get_intent_node = GetUserIntentNode()
        embed_q_node = EmbedQueryNode(embedding_model=self.embedding_model)
        search_db_node = SearchPgvectorNode(document_service=self.document_service)
        generate_ans_node = GenerateResponseNode()
        generate_ans_based_on_context_node = GenerateResponseFromContextNode()
        save_chat_node = SaveChatHistoryNode(
            chat_service=self.chat_service,
        )

        if intent:
            input_node >> embed_q_node
            embed_q_node >> search_db_node
            search_db_node >> generate_ans_node
            generate_ans_node >> save_chat_node

        else:
            input_node >> get_intent_node
            (
                get_intent_node - INTENT.DOCUMENT_QA
                >> embed_q_node
                >> search_db_node
                >> generate_ans_based_on_context_node
                >> save_chat_node
            )
            get_intent_node - INTENT.GENERIC_QA >> generate_ans_node
            (
                get_intent_node - INTENT.SUMMARIZATION
                >> embed_q_node
                >> search_db_node
                >> generate_ans_based_on_context_node
                >> save_chat_node
            )

        online_flow = Flow(start=input_node, name="Online_RAG_Query_Flow", debug=True)
        return online_flow
