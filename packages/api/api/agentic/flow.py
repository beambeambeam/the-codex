from typing import Literal

from api.chat.service import ChatService
from api.document.service import DocumentServiceSearch as DocumentService
from api.models.enum import ChatStatus

from .core import (
    TextEmbedder,
)
from .node import (
    EmbedQueryNode,
    GenerateResponseFromContextNode,
    GetInputAppendHistoryNode,
    GetLatestContextReferenceNode,
    GetUserIntentNode,
    SaveChatHistoryNode,
    SaveStatusNode,
    SearchCollectionNode,
    SearchDocumentNode,
)
from .pocketflow_custom import Flow
from .schemas import (
    INTENT,
)


def create_collection_rag_flow(
    document_service: DocumentService,
    chat_service: ChatService,
    embedding_model: TextEmbedder,
    debug: bool = True,
) -> Flow:
    """
    Creates and returns a PocketFlow for the online RAG process.
    """
    input_processing = create_input_processing_flow(chat_service=chat_service)
    get_user_intent = create_get_user_intent_flow(chat_service=chat_service)
    embed_search = create_embed_search_flow(
        document_service=document_service,
        embedding_model=embedding_model,
        flow_type="collection",
    )
    get_latest_reference = create_get_last_context_flow(chat_service=chat_service)
    generate_ans_based_on_context = create_generate_ans_based_on_context_flow(
        chat_service=chat_service
    )
    save_history = create_save_history_flow(chat_service=chat_service)

    input_processing >> get_user_intent
    (
        get_user_intent - INTENT.FETCH_DOCUMENT_QA
        >> embed_search
        >> generate_ans_based_on_context
        >> save_history
    )
    (
        get_user_intent - INTENT.LAST_DOCUMENT_QA
        >> get_latest_reference
        >> generate_ans_based_on_context
        >> save_history
    )
    (
        get_user_intent - INTENT.GENERIC_QA
        >> generate_ans_based_on_context
        >> save_history
    )
    (
        get_user_intent - INTENT.SUMMARIZATION
        >> embed_search
        >> generate_ans_based_on_context
        >> save_history
    )

    flow = Flow(start=input_processing, name="collection_rag_flow", debug=debug)
    return flow


def create_document_rag_flow(
    document_service: DocumentService,
    chat_service: ChatService,
    embedding_model: TextEmbedder,
    debug: bool = True,
) -> Flow:
    """
    Creates and returns a PocketFlow for the online RAG process.
    """
    input_processing = create_input_processing_flow(chat_service=chat_service)
    embed_search = create_embed_search_flow(
        document_service=document_service,
        embedding_model=embedding_model,
        flow_type="document",
    )
    generate_ans_based_on_context = create_generate_ans_based_on_context_flow(
        chat_service=chat_service
    )
    save_history = create_save_history_flow(chat_service=chat_service)

    input_processing >> embed_search >> generate_ans_based_on_context >> save_history

    flow = Flow(start=input_processing, name="document_rag_flow", debug=debug)
    return flow


# Input Processing Flow
def create_input_processing_flow(chat_service: ChatService):
    input_node = GetInputAppendHistoryNode()

    # status save node
    awaiting_input_status_node = SaveStatusNode(
        chat_service=chat_service, status=ChatStatus.awaiting_user_input
    )
    processing_input_status_node = SaveStatusNode(
        chat_service=chat_service, status=ChatStatus.processing_input
    )

    awaiting_input_status_node >> input_node >> processing_input_status_node

    flow = Flow(start=awaiting_input_status_node, name="get_input_flow")
    return flow


# get intent flow
def create_get_user_intent_flow(chat_service: ChatService):
    """
    Creates a flow for getting the user's intent.
    """
    get_user_intent_node = GetUserIntentNode(chat_service=chat_service)

    flow = Flow(start=get_user_intent_node, name="get_user_intent_flow")
    return flow


# Get Context flow
def create_embed_search_flow(
    document_service: DocumentService,
    embedding_model: TextEmbedder,
    flow_type: Literal["document", "collection"],
):
    """
    Creates a flow for embedding and searching documents.
    """
    embed_q_node = EmbedQueryNode(embedding_model=embedding_model)
    search_document_node = SearchDocumentNode(document_service=document_service)
    search_collection_node = SearchCollectionNode(document_service=document_service)

    if flow_type == "collection":
        embed_q_node >> search_collection_node
    else:
        embed_q_node >> search_document_node

    flow = Flow(start=embed_q_node, name="document_embed_search_flow")
    return flow


def create_get_last_context_flow(chat_service: ChatService):
    """
    Creates a flow for getting the last context.
    """
    get_latest_reference_node = GetLatestContextReferenceNode(chat_service=chat_service)
    generate_ans_based_on_context_node = GenerateResponseFromContextNode()

    get_latest_reference_node >> generate_ans_based_on_context_node

    flow = Flow(start=get_latest_reference_node, name="get_last_context_flow")
    return flow


# generate ans based on context node
def create_generate_ans_based_on_context_flow(chat_service: ChatService):
    """
    Creates a node for generating answers based on context.
    """
    generate_ans_based_on_context_node = GenerateResponseFromContextNode()
    responding_status_node = SaveStatusNode(
        chat_service=chat_service, status=ChatStatus.responding
    )
    response_completed_status_node = SaveStatusNode(
        chat_service=chat_service, status=ChatStatus.response_complete
    )

    (
        responding_status_node
        >> generate_ans_based_on_context_node
        >> response_completed_status_node
    )

    return Flow(
        start=responding_status_node,
        name="generate_ans_based_on_context_flow",
    )


# Save Chat History Flow
def create_save_history_flow(
    chat_service: ChatService,
):
    """
    Creates a flow for saving chat history.
    """
    save_chat_node = SaveChatHistoryNode(chat_service=chat_service)
    session_ended_status_node = SaveStatusNode(
        chat_service=chat_service, status=ChatStatus.session_ended
    )

    save_chat_node >> session_ended_status_node

    flow = Flow(start=save_chat_node, name="save_history_flow")
    return flow
