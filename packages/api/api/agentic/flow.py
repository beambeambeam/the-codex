from .node import (
    EmbedQueryNode,
    GenerateResponseFromContextNode,
    GetInputAppendHistoryNode,
    GetLatestContextReferenceNode,
    GetUserIntentNode,
    SaveChatHistoryNode,
    SearchCollectionNode,
    SearchDocumentNode,
)
from .pocketflow_custom import Flow
from .schemas import (
    INTENT,
    ChatHistoryResponse,
    ChatMessageResponse,
    SharedStore,  # Adjust relative import
)


def create_collection_rag_flow(embedding_model, document_service, chat_service) -> Flow:
    """
    Creates and returns a PocketFlow for the online RAG process.
    """
    input_node = GetInputAppendHistoryNode()
    get_intent_node = GetUserIntentNode()
    embed_q_node = EmbedQueryNode(embedding_model=embedding_model)
    search_collection_node = SearchCollectionNode(document_service=document_service)
    get_latest_reference_node = GetLatestContextReferenceNode(
        chat_service=chat_service,
    )
    generate_ans_based_on_context_node = GenerateResponseFromContextNode()
    save_chat_node = SaveChatHistoryNode(
        chat_service=chat_service,
    )

    input_node >> get_intent_node
    (
        get_intent_node - INTENT.FETCH_DOCUMENT_QA
        >> embed_q_node
        >> search_collection_node
        >> generate_ans_based_on_context_node
        >> save_chat_node
    )
    (
        get_intent_node - INTENT.LAST_DOCUMENT_QA
        >> get_latest_reference_node
        >> generate_ans_based_on_context_node
        >> save_chat_node
    )
    (
        get_intent_node - INTENT.GENERIC_QA
        >> generate_ans_based_on_context_node
        >> save_chat_node
    )
    (
        get_intent_node - INTENT.SUMMARIZATION
        >> embed_q_node
        >> search_collection_node
        >> generate_ans_based_on_context_node
        >> save_chat_node
    )

    flow = Flow(start=input_node, name="collection_rag_flow", debug=True)
    return flow


def create_document_rag_flow(embedding_model, document_service, chat_service) -> Flow:
    """
    Creates and returns a PocketFlow for the online RAG process.
    """
    input_node = GetInputAppendHistoryNode()
    get_intent_node = GetUserIntentNode()
    embed_q_node = EmbedQueryNode(embedding_model=embedding_model)
    search_document_node = SearchDocumentNode(document_service=document_service)
    get_latest_reference_node = GetLatestContextReferenceNode(
        chat_service=chat_service,
    )
    generate_ans_based_on_context_node = GenerateResponseFromContextNode()

    save_chat_node = SaveChatHistoryNode(
        chat_service=chat_service,
    )

    input_node >> get_intent_node
    (
        get_intent_node - INTENT.FETCH_DOCUMENT_QA
        >> embed_q_node
        >> search_document_node
        >> generate_ans_based_on_context_node
        >> save_chat_node
    )
    (
        get_intent_node - INTENT.LAST_DOCUMENT_QA
        >> get_latest_reference_node
        >> generate_ans_based_on_context_node
        >> save_chat_node
    )
    (
        get_intent_node - INTENT.GENERIC_QA
        >> generate_ans_based_on_context_node
        >> save_chat_node
    )
    (
        get_intent_node - INTENT.SUMMARIZATION
        >> embed_q_node
        >> search_document_node
        >> generate_ans_based_on_context_node
        >> save_chat_node
    )

    flow = Flow(start=input_node, name="document_rag_flow", debug=True)
    return flow
