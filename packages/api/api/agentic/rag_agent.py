from fastapi import Depends

from ..document.service import DocumentServiceSearch as DocumentService
from .core import (
    KnowledgeGraphExtractor,
    TextEmbedder,
)
from .dependencies import (
    get_document_service,
    get_knowledge_graph_extractor,
    get_text_embedder,
)
from .node import (
    EmbedQueryNode,
    GenerateResponseNode,
    GetInputAppendHistoryNode,
    SearchPgvectorNode,
)
from .pocketflow_custom import Flow  # PocketFlow custom components
from .schemas import SharedStore  # Adjust relative import


class rag_agent:
    """
    A class representing the RAG (Retrieval-Augmented Generation) agent.
    This class encapsulates the logic for handling online RAG queries.
    """

    def __init__(
        self,
        collection_id: str,
        document_service: DocumentService = Depends(get_document_service),
        embedding_model: TextEmbedder = Depends(get_text_embedder),
        kg_extractor: KnowledgeGraphExtractor = Depends(get_knowledge_graph_extractor),
    ):
        # Initialize Services
        self.document_service = document_service
        self.embedding_model = embedding_model
        self.kg_extractor = kg_extractor

        self.shared_data: SharedStore = SharedStore()
        self.flow: Flow = self.create_online_rag_flow()

        self.shared_data.collection_id = collection_id

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

    def run(self, user_question: str):
        """
        Run the RAG flow with the provided user question and collection ID.
        """
        self.shared_data.user_question = user_question

        # Run the flow with the shared data
        self.flow.run(shared=self.shared_data)

    def create_online_rag_flow(self) -> Flow:
        """
        Creates and returns a PocketFlow for the online RAG process.
        """
        input_node = GetInputAppendHistoryNode()
        embed_q_node = EmbedQueryNode(embedding_model=self.embedding_model)
        search_db_node = SearchPgvectorNode(document_service=self.document_service)
        generate_ans_node = GenerateResponseNode()

        input_node >> embed_q_node
        embed_q_node >> search_db_node
        search_db_node >> generate_ans_node

        online_flow = Flow(start=input_node, name="Online_RAG_Query_Flow", debug=True)
        return online_flow
