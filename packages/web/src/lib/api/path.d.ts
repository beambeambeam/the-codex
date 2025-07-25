export interface paths {
  "/v1/health/": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** Health Check */
    get: operations["health_check_v1_health__get"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/auth/register": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * Register
     * @description Register a new user with enhanced cookie session.
     */
    post: operations["register_auth_register_post"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/auth/login": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * Login
     * @description Login user and create session with remember me option.
     */
    post: operations["login_auth_login_post"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/auth/logout": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * Logout
     * @description Logout user and invalidate session.
     */
    post: operations["logout_auth_logout_post"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/auth/me": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * Get Current User Info
     * @description Get current authenticated user information.
     */
    get: operations["get_current_user_info_auth_me_get"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/auth/session": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * Get Session Info
     * @description Get current session information.
     */
    get: operations["get_session_info_auth_session_get"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/auth/sessions": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post?: never;
    /**
     * Cleanup Expired Sessions
     * @description Clean up expired sessions (admin only for demo).
     */
    delete: operations["cleanup_expired_sessions_auth_sessions_delete"];
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/auth/refresh": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * Refresh Session
     * @description Refresh the current session token.
     */
    post: operations["refresh_session_auth_refresh_post"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/auth/logout-all": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * Logout All Sessions
     * @description Logout from all sessions for the current user.
     */
    post: operations["logout_all_sessions_auth_logout_all_post"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/auth/session-info": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * Get Detailed Session Info
     * @description Get detailed session information from cookie.
     */
    get: operations["get_detailed_session_info_auth_session_info_get"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/collections/": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * List User Collections
     * @description List all collections for the current user.
     */
    get: operations["list_user_collections_collections__get"];
    put?: never;
    /**
     * Create Collection
     * @description Create a new collection.
     */
    post: operations["create_collection_collections__post"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/collections/{collection_id}": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * Get Collection
     * @description Get a collection with all details.
     */
    get: operations["get_collection_collections__collection_id__get"];
    /**
     * Update Collection
     * @description Update a collection.
     */
    put: operations["update_collection_collections__collection_id__put"];
    post?: never;
    /**
     * Delete Collection
     * @description Delete a collection.
     */
    delete: operations["delete_collection_collections__collection_id__delete"];
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/collections/{collection_id}/documents": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * List Collection Documents
     * @description List all documents in a collection.
     */
    get: operations["list_collection_documents_collections__collection_id__documents_get"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/collections/chats": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * Create Collection Chat
     * @description Create a new collection chat.
     */
    post: operations["create_collection_chat_collections_chats_post"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/collections/{collection_id}/chats": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * List Collection Chats
     * @description List all chats for a collection.
     */
    get: operations["list_collection_chats_collections__collection_id__chats_get"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/collections/chats/{collection_chat_id}": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * Get Collection Chat
     * @description Get a specific collection chat.
     */
    get: operations["get_collection_chat_collections_chats__collection_chat_id__get"];
    /**
     * Update Collection Chat
     * @description Update a collection chat.
     */
    put: operations["update_collection_chat_collections_chats__collection_chat_id__put"];
    post?: never;
    /**
     * Delete Collection Chat
     * @description Delete a collection chat.
     */
    delete: operations["delete_collection_chat_collections_chats__collection_chat_id__delete"];
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/collections/chats/{collection_chat_id}/history": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * List Collection Chat History
     * @description Get a collection chat with history.
     */
    get: operations["list_collection_chat_history_collections_chats__collection_chat_id__history_get"];
    put?: never;
    /**
     * Add Chat History
     * @description Add a message to chat history.
     */
    post: operations["add_chat_history_collections_chats__collection_chat_id__history_post"];
    /**
     * Clear Chat History
     * @description Clear chat history for a collection chat.
     */
    delete: operations["clear_chat_history_collections_chats__collection_chat_id__history_delete"];
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/collections/history/{history_id}": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * Get Chat History
     * @description Get a specific chat history item.
     */
    get: operations["get_chat_history_collections_history__history_id__get"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/collections/history/{history_id}/edit": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * Edit Chat History
     * @description Edit a chat history item.
     */
    post: operations["edit_chat_history_collections_history__history_id__edit_post"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/collections/relations": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * Create Collection Relation
     * @description Create a new collection relation.
     */
    post: operations["create_collection_relation_collections_relations_post"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/collections/{collection_id}/relations": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * List Collection Relations
     * @description List all relations for a collection with nodes and edges.
     */
    get: operations["list_collection_relations_collections__collection_id__relations_get"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/collections/relations/{relation_id}": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * Get Collection Relation
     * @description Get a collection relation with nodes and edges.
     */
    get: operations["get_collection_relation_collections_relations__relation_id__get"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/collections/relations/{relation_id}/nodes": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * Create Collection Node
     * @description Create a new collection node.
     */
    post: operations["create_collection_node_collections_relations__relation_id__nodes_post"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/collections/relations/{relation_id}/edges": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * Create Collection Edge
     * @description Create a new collection edge.
     */
    post: operations["create_collection_edge_collections_relations__relation_id__edges_post"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/documents/upload": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * Upload Document
     * @description Upload a document file and create a document record.
     */
    post: operations["upload_document_documents_upload_post"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/documents/": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * List User Documents
     * @description List all documents for the current user.
     */
    get: operations["list_user_documents_documents__get"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/documents/{document_id}": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * Get Document
     * @description Get a document with all details.
     */
    get: operations["get_document_documents__document_id__get"];
    /**
     * Update Document
     * @description Update a document.
     */
    put: operations["update_document_documents__document_id__put"];
    post?: never;
    /**
     * Delete Document
     * @description Delete a document.
     */
    delete: operations["delete_document_documents__document_id__delete"];
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/documents/{document_id}/chunks": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * List Document Chunks
     * @description List all chunks for a document.
     */
    get: operations["list_document_chunks_documents__document_id__chunks_get"];
    put?: never;
    /**
     * Create Chunk
     * @description Create a new chunk for a document.
     */
    post: operations["create_chunk_documents__document_id__chunks_post"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/documents/{document_id}/chunks/search": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * Search Document Chunks
     * @description Search for chunks in a document.
     */
    post: operations["search_document_chunks_documents__document_id__chunks_search_post"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/documents/collection/{collection_id}/chunks/search": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * Search Collection Chunks
     * @description Search for chunks in a collection.
     */
    post: operations["search_collection_chunks_documents_collection__collection_id__chunks_search_post"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/documents/collection/{collection_id}/documents/search": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * Search Collection Documents
     * @description Search for documents in a collection.
     */
    post: operations["search_collection_documents_documents_collection__collection_id__documents_search_post"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/documents/chats": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * Create Document Chat
     * @description Create a new document chat.
     */
    post: operations["create_document_chat_documents_chats_post"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/documents/{document_id}/chats": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * List Document Chats
     * @description List all chats for a document.
     */
    get: operations["list_document_chats_documents__document_id__chats_get"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/documents/chats/{chat_id}": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * Get Document Chat
     * @description Get a document chat with history.
     */
    get: operations["get_document_chat_documents_chats__chat_id__get"];
    /**
     * Update Document Chat
     * @description Update a document chat.
     */
    put: operations["update_document_chat_documents_chats__chat_id__put"];
    post?: never;
    /**
     * Delete Document Chat
     * @description Delete a document chat.
     */
    delete: operations["delete_document_chat_documents_chats__chat_id__delete"];
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/documents/chats/{chat_id}/history": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * Get Chat History
     * @description Get chat history for a document chat.
     */
    get: operations["get_chat_history_documents_chats__chat_id__history_get"];
    put?: never;
    /**
     * Add Chat History
     * @description Add a message to chat history.
     */
    post: operations["add_chat_history_documents_chats__chat_id__history_post"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/documents/relations": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * Create Document Relation
     * @description Create a new document relation.
     */
    post: operations["create_document_relation_documents_relations_post"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/documents/graph": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * Create Document Graph
     * @description Create a document relation with nodes and edges.
     */
    get: operations["create_document_graph_documents_graph_get"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/documents/{document_id}/relations": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * List Document Relations
     * @description List all relations for a document with nodes and edges.
     */
    get: operations["list_document_relations_documents__document_id__relations_get"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/documents/relations/{relation_id}": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * Get Document Relation
     * @description Get a document relation with nodes and edges.
     */
    get: operations["get_document_relation_documents_relations__relation_id__get"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/documents/relations/{relation_id}/nodes": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * Create Document Node
     * @description Create a new document node.
     */
    post: operations["create_document_node_documents_relations__relation_id__nodes_post"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/documents/relations/{relation_id}/edges": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * Create Document Edge
     * @description Create a new document edge.
     */
    post: operations["create_document_edge_documents_relations__relation_id__edges_post"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/agentic/upload_ingest": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * Upload And Ingest Documents
     * @description Ingest documents into the system.
     *     This endpoint allows users to upload documents for processing and storage.
     */
    post: operations["upload_and_ingest_documents_agentic_upload_ingest_post"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/agentic/ingest": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * Ingest Documents
     * @description Ingest documents into the system.
     *     This endpoint allows users to upload documents for processing and storage.
     */
    post: operations["ingest_documents_agentic_ingest_post"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/agentic/cluster_topic": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * Cluster Documents
     * @description Clusters document chunks in a collection and generates descriptive topic titles.
     *
     *     Parameters:
     *     - collection_id: The ID of the collection to process.
     *     - cluster_title_top_n_topics: The number of top contributing topics to use for generating a cluster title.
     *     - cluster_title_top_n_words: The number of keywords to extract from each contributing topic.
     */
    post: operations["cluster_documents_agentic_cluster_topic_post"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/agentic/rag_query": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * Rag Query
     * @description Query the RAG agent with a user question and return the answer.
     */
    post: operations["rag_query_agentic_rag_query_post"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/queue/health": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * Check Queue Health
     * @description Check RabbitMQ connection health.
     */
    get: operations["check_queue_health_queue_health_get"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/queue/initialize": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * Initialize Queues
     * @description Initialize default queues (admin only).
     */
    post: operations["initialize_queues_queue_initialize_post"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/queue/stats/{queue_type}": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * Get Queue Stats
     * @description Get statistics for a specific queue.
     */
    get: operations["get_queue_stats_queue_stats__queue_type__get"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/queue/purge/{queue_type}": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * Purge Queue
     * @description Purge all messages from a queue (admin only).
     */
    post: operations["purge_queue_queue_purge__queue_type__post"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/queue/debug/{queue_type}": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * Debug Queue Info
     * @description Debug endpoint to check queue information (admin only).
     */
    get: operations["debug_queue_info_queue_debug__queue_type__get"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/queue/peek/{queue_type}": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * Peek Queue Message
     * @description Peek at a message in the queue (consumes one message for testing).
     */
    get: operations["peek_queue_message_queue_peek__queue_type__get"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/queue/test-publish": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * Test Publish
     * @description Test endpoint to publish a message to a document, collection, or chat queue.
     */
    post: operations["test_publish_queue_test_publish_post"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/sse/events": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * Stream Events
     * @description Stream server-sent events for the authenticated user.
     */
    get: operations["stream_events_sse_events_get"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/sse/documents/{document_id}": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * Stream Document Events
     * @description Stream SSE events for a specific document.
     */
    get: operations["stream_document_events_sse_documents__document_id__get"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/sse/collections/{collection_id}": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * Stream Collection Events
     * @description Stream SSE events for a specific collection.
     */
    get: operations["stream_collection_events_sse_collections__collection_id__get"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/sse/chats/{chat_id}": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * Stream Chat Events
     * @description Stream SSE events for a specific chat.
     */
    get: operations["stream_chat_events_sse_chats__chat_id__get"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
}
export type webhooks = Record<string, never>;
export interface components {
  schemas: {
    /**
     * AgentResponse
     * @description Schema for the response from the RAG agent.
     */
    AgentResponse: {
      /** @description Conversation history including user questions and assistant responses */
      chat_history?: components["schemas"]["ChatHistory"];
      /**
       * Retrieved Contexts
       * @description List of retrieved document chunks based on the query embedding
       */
      retrieved_contexts?: components["schemas"]["ChunkSearchResponse"][];
    };
    /**
     * AuthResponse
     * @description Authentication response.
     */
    AuthResponse: {
      /** Message */
      message: string;
      user: components["schemas"]["UserResponse"];
    };
    /** Body_create_document_graph_documents_graph_get */
    Body_create_document_graph_documents_graph_get: {
      /** Nodes */
      nodes: components["schemas"]["DocumentNodeCreate"][];
      /** Edges */
      edges: components["schemas"]["DocumentEdgeCreate"][];
    };
    /** Body_upload_and_ingest_documents_agentic_upload_ingest_post */
    Body_upload_and_ingest_documents_agentic_upload_ingest_post: {
      /**
       * Input File
       * Format: binary
       */
      input_file: File;
    };
    /** Body_upload_document_documents_upload_post */
    Body_upload_document_documents_upload_post: {
      /**
       * File
       * Format: binary
       */
      file: File;
    };
    /**
     * ChatHistory
     * @description Schema for a list of chat messages.
     */
    ChatHistory: {
      /**
       * Messages
       * @description List of chat messages in the conversation
       */
      messages?: components["schemas"]["ChatMessage"][];
    };
    /**
     * ChatMessage
     * @description Schema for chat messages in the RAG system.
     */
    ChatMessage: {
      /** @description Role of the message sender (user, assistant, system) */
      role: components["schemas"]["Role"];
      /**
       * Content
       * @description message content
       */
      content: string | null;
    };
    /**
     * ChunkCreate
     * @description Schema for creating a chunk.
     */
    ChunkCreate: {
      /**
       * Chunk Text
       * @description Chunk text content
       */
      chunk_text: string;
      /**
       * Page Number
       * @description Page number
       */
      page_number?: number | null;
      /**
       * Start Char
       * @description Start character position
       */
      start_char?: number | null;
      /**
       * End Char
       * @description End character position
       */
      end_char?: number | null;
      /**
       * Token Count
       * @description Number of tokens in the chunk
       */
      token_count?: number | null;
      /**
       * Embedding
       * @description Embedding vector for the chunk
       */
      embedding: number[];
      /**
       * Document Id
       * @description Document ID this chunk belongs to
       */
      document_id: string;
    };
    /**
     * ChunkResponse
     * @description Schema for chunk response.
     */
    ChunkResponse: {
      /**
       * Chunk Text
       * @description Chunk text content
       */
      chunk_text: string;
      /**
       * Page Number
       * @description Page number
       */
      page_number?: number | null;
      /**
       * Start Char
       * @description Start character position
       */
      start_char?: number | null;
      /**
       * End Char
       * @description End character position
       */
      end_char?: number | null;
      /**
       * Token Count
       * @description Number of tokens in the chunk
       */
      token_count?: number | null;
      /** Id */
      id: string;
      /** Document Id */
      document_id: string;
      /** Embedding */
      embedding?: number[];
      /**
       * Created At
       * Format: date-time
       */
      created_at: string;
      /**
       * Updated At
       * Format: date-time
       */
      updated_at: string;
      /** Created By */
      created_by: string | null;
      /** Updated By */
      updated_by: string | null;
    };
    /**
     * ChunkSearchResponse
     * @description Schema for searched chunks.
     */
    ChunkSearchResponse: {
      /**
       * Chunk Text
       * @description Chunk text content
       */
      chunk_text: string;
      /**
       * Page Number
       * @description Page number
       */
      page_number?: number | null;
      /**
       * Start Char
       * @description Start character position
       */
      start_char?: number | null;
      /**
       * End Char
       * @description End character position
       */
      end_char?: number | null;
      /**
       * Token Count
       * @description Number of tokens in the chunk
       */
      token_count?: number | null;
      /** Id */
      id: string;
      /** Document Id */
      document_id: string;
      /** Embedding */
      embedding?: number[];
      /**
       * Created At
       * Format: date-time
       */
      created_at: string;
      /**
       * Updated At
       * Format: date-time
       */
      updated_at: string;
      /** Created By */
      created_by: string | null;
      /** Updated By */
      updated_by: string | null;
      /**
       * Distance
       * @description Distance score for similarity search
       */
      distance: number;
    };
    /**
     * ClusteringResult
     * @description Result of the clustering operation.
     */
    ClusteringResult: {
      /** Topics */
      topics: components["schemas"]["TopicCluster"][];
      /** Documents */
      documents: components["schemas"]["DocumentDistribution"][];
    };
    /**
     * CollectionChatCreate
     * @description Schema for creating a collection chat.
     */
    CollectionChatCreate: {
      /**
       * Title
       * @description Chat title
       */
      title: string;
      /**
       * Description
       * @description Chat description
       */
      description?: string | null;
      /**
       * Collection Id
       * @description Collection ID this chat belongs to
       */
      collection_id: string;
    };
    /**
     * CollectionChatHistoryCreate
     * @description Schema for creating chat history.
     */
    CollectionChatHistoryCreate: {
      /** @description Role of the message sender (user, assistant, system) */
      role: components["schemas"]["Role"];
      /**
       * Content
       * @description message content
       */
      content: string | null;
      /**
       * Collection Chat Id
       * @description Chat ID this history belongs to
       */
      collection_chat_id: string;
    };
    /**
     * CollectionChatHistoryResponse
     * @description Schema for chat history response.
     */
    CollectionChatHistoryResponse: {
      /** @description Role of the message sender (user, assistant, system) */
      role: components["schemas"]["Role"];
      /**
       * Content
       * @description message content
       */
      content: string | null;
      /** Id */
      id: string;
      /** Collection Chat Id */
      collection_chat_id: string;
      /**
       * Created At
       * Format: date-time
       */
      created_at: string;
      /** Created By */
      created_by: string | null;
    };
    /**
     * CollectionChatResponse
     * @description Schema for collection chat response.
     */
    CollectionChatResponse: {
      /**
       * Title
       * @description Chat title
       */
      title: string;
      /**
       * Description
       * @description Chat description
       */
      description?: string | null;
      /** Id */
      id: string;
      /** Collection Id */
      collection_id: string;
      /**
       * Created At
       * Format: date-time
       */
      created_at: string;
      /**
       * Updated At
       * Format: date-time
       */
      updated_at: string;
      /** Created By */
      created_by: string | null;
      /** Updated By */
      updated_by: string | null;
    };
    /**
     * CollectionChatUpdate
     * @description Schema for updating a collection chat.
     */
    CollectionChatUpdate: {
      /**
       * Title
       * @description Chat title
       */
      title?: string | null;
      /**
       * Description
       * @description Chat description
       */
      description?: string | null;
    };
    /**
     * CollectionChatWithHistory
     * @description Collection chat with history included.
     */
    CollectionChatWithHistory: {
      /**
       * Title
       * @description Chat title
       */
      title: string;
      /**
       * Description
       * @description Chat description
       */
      description?: string | null;
      /** Id */
      id: string;
      /** Collection Id */
      collection_id: string;
      /**
       * Created At
       * Format: date-time
       */
      created_at: string;
      /**
       * Updated At
       * Format: date-time
       */
      updated_at: string;
      /** Created By */
      created_by: string | null;
      /** Updated By */
      updated_by: string | null;
      /**
       * History
       * @default []
       */
      history: components["schemas"]["CollectionChatHistoryResponse"][];
    };
    /**
     * CollectionCreate
     * @description Schema for creating a collection.
     */
    CollectionCreate: {
      /**
       * Name
       * @description Collection name
       */
      name: string;
      /**
       * Description
       * @description Collection description
       */
      description?: string | null;
    };
    /**
     * CollectionDetailResponse
     * @description Detailed collection response with all nested data.
     */
    CollectionDetailResponse: {
      /**
       * Name
       * @description Collection name
       */
      name: string;
      /**
       * Description
       * @description Collection description
       */
      description?: string | null;
      /** Id */
      id: string;
      /**
       * Created At
       * Format: date-time
       */
      created_at: string;
      /**
       * Updated At
       * Format: date-time
       */
      updated_at: string;
      /** Created By */
      created_by: string | null;
      /** Updated By */
      updated_by: string | null;
      /**
       * Chats
       * @default []
       */
      chats: components["schemas"]["CollectionChatWithHistory"][];
      /**
       * Relations
       * @default []
       */
      relations: components["schemas"]["CollectionRelationWithNodes"][];
    };
    /**
     * CollectionEdgeCreate
     * @description Schema for creating a collection edge.
     */
    CollectionEdgeCreate: {
      /**
       * Label
       * @description Edge label
       */
      label: string;
      /**
       * Source
       * @description Source node ID
       */
      source: string;
      /**
       * Target
       * @description Target node ID
       */
      target: string;
      /**
       * Collection Relation Id
       * @description Relation ID this edge belongs to
       */
      collection_relation_id: string;
    };
    /**
     * CollectionEdgeResponse
     * @description Schema for collection edge response.
     */
    CollectionEdgeResponse: {
      /**
       * Label
       * @description Edge label
       */
      label: string;
      /**
       * Source
       * @description Source node ID
       */
      source: string;
      /**
       * Target
       * @description Target node ID
       */
      target: string;
      /** Id */
      id: string;
      /** Collection Relation Id */
      collection_relation_id: string;
      /**
       * Created At
       * Format: date-time
       */
      created_at: string;
      /**
       * Updated At
       * Format: date-time
       */
      updated_at: string;
      /** Created By */
      created_by: string | null;
      /** Updated By */
      updated_by: string | null;
    };
    /**
     * CollectionNodeCreate
     * @description Schema for creating a collection node.
     */
    CollectionNodeCreate: {
      /**
       * Title
       * @description Node title
       */
      title: string;
      /**
       * Description
       * @description Node description
       */
      description?: string | null;
      /**
       * Type
       * @description Node type
       */
      type: string;
      /**
       * Label
       * @description Node label
       */
      label: string;
      /**
       * Collection Relation Id
       * @description Relation ID this node belongs to
       */
      collection_relation_id: string;
    };
    /**
     * CollectionNodeResponse
     * @description Schema for collection node response.
     */
    CollectionNodeResponse: {
      /**
       * Title
       * @description Node title
       */
      title: string;
      /**
       * Description
       * @description Node description
       */
      description?: string | null;
      /**
       * Type
       * @description Node type
       */
      type: string;
      /**
       * Label
       * @description Node label
       */
      label: string;
      /** Id */
      id: string;
      /** Collection Relation Id */
      collection_relation_id: string;
      /**
       * Created At
       * Format: date-time
       */
      created_at: string;
      /**
       * Updated At
       * Format: date-time
       */
      updated_at: string;
      /** Created By */
      created_by: string | null;
      /** Updated By */
      updated_by: string | null;
    };
    /**
     * CollectionRelationCreate
     * @description Schema for creating a collection relation.
     */
    CollectionRelationCreate: {
      /**
       * Title
       * @description Relation title
       */
      title: string;
      /**
       * Description
       * @description Relation description
       */
      description?: string | null;
      /**
       * Collection Id
       * @description Collection ID this relation belongs to
       */
      collection_id: string;
    };
    /**
     * CollectionRelationResponse
     * @description Schema for collection relation response.
     */
    CollectionRelationResponse: {
      /**
       * Title
       * @description Relation title
       */
      title: string;
      /**
       * Description
       * @description Relation description
       */
      description?: string | null;
      /** Id */
      id: string;
      /** Collection Id */
      collection_id: string;
      /**
       * Created At
       * Format: date-time
       */
      created_at: string;
      /**
       * Updated At
       * Format: date-time
       */
      updated_at: string;
      /** Created By */
      created_by: string | null;
      /** Updated By */
      updated_by: string | null;
    };
    /**
     * CollectionRelationWithNodes
     * @description Collection relation with nodes and edges.
     */
    CollectionRelationWithNodes: {
      /**
       * Title
       * @description Relation title
       */
      title: string;
      /**
       * Description
       * @description Relation description
       */
      description?: string | null;
      /** Id */
      id: string;
      /** Collection Id */
      collection_id: string;
      /**
       * Created At
       * Format: date-time
       */
      created_at: string;
      /**
       * Updated At
       * Format: date-time
       */
      updated_at: string;
      /** Created By */
      created_by: string | null;
      /** Updated By */
      updated_by: string | null;
      /**
       * Nodes
       * @default []
       */
      nodes: components["schemas"]["CollectionNodeResponse"][];
      /**
       * Edges
       * @default []
       */
      edges: components["schemas"]["CollectionEdgeResponse"][];
    };
    /**
     * CollectionResponse
     * @description Schema for collection response.
     */
    CollectionResponse: {
      /**
       * Name
       * @description Collection name
       */
      name: string;
      /**
       * Description
       * @description Collection description
       */
      description?: string | null;
      /** Id */
      id: string;
      /**
       * Created At
       * Format: date-time
       */
      created_at: string;
      /**
       * Updated At
       * Format: date-time
       */
      updated_at: string;
      /** Created By */
      created_by: string | null;
      /** Updated By */
      updated_by: string | null;
    };
    /**
     * CollectionUpdate
     * @description Schema for updating a collection.
     */
    CollectionUpdate: {
      /**
       * Name
       * @description Collection name
       */
      name?: string | null;
      /**
       * Description
       * @description Collection description
       */
      description?: string | null;
    };
    /**
     * DocumentChatCreate
     * @description Schema for creating a document chat.
     */
    DocumentChatCreate: {
      /**
       * Title
       * @description Chat title
       */
      title: string;
      /**
       * Description
       * @description Chat description
       */
      description?: string | null;
      /**
       * Document Id
       * @description Document ID this chat belongs to
       */
      document_id: string;
    };
    /**
     * DocumentChatHistoryCreate
     * @description Schema for creating document chat history.
     */
    DocumentChatHistoryCreate: {
      /** @description Role of the message sender (user, assistant, system) */
      role: components["schemas"]["Role"];
      /**
       * Content
       * @description message content
       */
      content: string | null;
      /**
       * Document Chat Id
       * @description Chat ID this history belongs to
       */
      document_chat_id: string;
    };
    /**
     * DocumentChatHistoryResponse
     * @description Schema for document chat history response.
     */
    DocumentChatHistoryResponse: {
      /** @description Role of the message sender (user, assistant, system) */
      role: components["schemas"]["Role"];
      /**
       * Content
       * @description message content
       */
      content: string | null;
      /** Id */
      id: string;
      /** Document Chat Id */
      document_chat_id: string;
      /**
       * Created At
       * Format: date-time
       */
      created_at: string;
      /** Created By */
      created_by: string | null;
    };
    /**
     * DocumentChatResponse
     * @description Schema for document chat response.
     */
    DocumentChatResponse: {
      /**
       * Title
       * @description Chat title
       */
      title: string;
      /**
       * Description
       * @description Chat description
       */
      description?: string | null;
      /** Id */
      id: string;
      /** Document Id */
      document_id: string;
      /**
       * Created At
       * Format: date-time
       */
      created_at: string;
      /**
       * Updated At
       * Format: date-time
       */
      updated_at: string;
      /** Created By */
      created_by: string | null;
      /** Updated By */
      updated_by: string | null;
    };
    /**
     * DocumentChatUpdate
     * @description Schema for updating a document chat.
     */
    DocumentChatUpdate: {
      /**
       * Title
       * @description Chat title
       */
      title?: string | null;
      /**
       * Description
       * @description Chat description
       */
      description?: string | null;
    };
    /**
     * DocumentChatWithHistory
     * @description Schema for document chat with history.
     */
    DocumentChatWithHistory: {
      /**
       * Title
       * @description Chat title
       */
      title: string;
      /**
       * Description
       * @description Chat description
       */
      description?: string | null;
      /** Id */
      id: string;
      /** Document Id */
      document_id: string;
      /**
       * Created At
       * Format: date-time
       */
      created_at: string;
      /**
       * Updated At
       * Format: date-time
       */
      updated_at: string;
      /** Created By */
      created_by: string | null;
      /** Updated By */
      updated_by: string | null;
      /**
       * History
       * @default []
       */
      history: components["schemas"]["DocumentChatHistoryResponse"][];
    };
    /**
     * DocumentDetailResponse
     * @description Schema for document with all details.
     */
    DocumentDetailResponse: {
      /**
       * File Name
       * @description Document file name
       */
      file_name: string;
      /**
       * Source File Path
       * @description Source file path
       */
      source_file_path: string;
      /**
       * File Type
       * @description File type (pdf, txt, doc, etc.)
       */
      file_type: string;
      /** Id */
      id: string;
      /** Collection Id */
      collection_id: string;
      /** Is Vectorized */
      is_vectorized: boolean;
      /** Is Graph Extracted */
      is_graph_extracted: boolean;
      /**
       * Created At
       * Format: date-time
       */
      created_at: string;
      /**
       * Updated At
       * Format: date-time
       */
      updated_at: string;
      /** Created By */
      created_by: string | null;
      /** Updated By */
      updated_by: string | null;
      /**
       * Chunks
       * @default []
       */
      chunks: components["schemas"]["ChunkResponse"][];
      /**
       * Chats
       * @default []
       */
      chats: components["schemas"]["DocumentChatResponse"][];
      /**
       * Relations
       * @default []
       */
      relations: components["schemas"]["DocumentRelationWithNodes"][];
    };
    /**
     * DocumentDistribution
     * @description Represents the distribution of topics for a document.
     */
    DocumentDistribution: {
      /** Document Id */
      document_id: string;
      /** Top Topic */
      top_topic: string;
      /** Distribution */
      distribution: {
        [key: string]: number;
      };
    };
    /**
     * DocumentEdgeCreate
     * @description Schema for creating a document edge.
     */
    DocumentEdgeCreate: {
      /**
       * Label
       * @description Edge label
       */
      label: string;
      /**
       * Source
       * @description Source node ID
       */
      source: string;
      /**
       * Target
       * @description Target node ID
       */
      target: string;
      /**
       * Document Relation Id
       * @description Relation ID this edge belongs to
       */
      document_relation_id: string;
    };
    /**
     * DocumentEdgeResponse
     * @description Schema for document edge response.
     */
    DocumentEdgeResponse: {
      /**
       * Label
       * @description Edge label
       */
      label: string;
      /**
       * Source
       * @description Source node ID
       */
      source: string;
      /**
       * Target
       * @description Target node ID
       */
      target: string;
      /** Id */
      id: string;
      /** Document Relation Id */
      document_relation_id: string;
      /**
       * Created At
       * Format: date-time
       */
      created_at: string;
      /**
       * Updated At
       * Format: date-time
       */
      updated_at: string;
      /** Created By */
      created_by: string | null;
      /** Updated By */
      updated_by: string | null;
    };
    /**
     * DocumentNodeCreate
     * @description Schema for creating a document node.
     */
    DocumentNodeCreate: {
      /**
       * Title
       * @description Node title
       */
      title: string;
      /**
       * Description
       * @description Node description
       */
      description?: string | null;
      /**
       * Type
       * @description Node type
       */
      type: string;
      /**
       * Label
       * @description Node label
       */
      label: string;
      /**
       * Document Relation Id
       * @description Relation ID this node belongs to
       */
      document_relation_id: string;
    };
    /**
     * DocumentNodeResponse
     * @description Schema for document node response.
     */
    DocumentNodeResponse: {
      /**
       * Title
       * @description Node title
       */
      title: string;
      /**
       * Description
       * @description Node description
       */
      description?: string | null;
      /**
       * Type
       * @description Node type
       */
      type: string;
      /**
       * Label
       * @description Node label
       */
      label: string;
      /** Id */
      id: string;
      /** Document Relation Id */
      document_relation_id: string;
      /**
       * Created At
       * Format: date-time
       */
      created_at: string;
      /**
       * Updated At
       * Format: date-time
       */
      updated_at: string;
      /** Created By */
      created_by: string | null;
      /** Updated By */
      updated_by: string | null;
    };
    /**
     * DocumentRelationCreate
     * @description Schema for creating a document relation.
     */
    DocumentRelationCreate: {
      /**
       * Title
       * @description Relation title
       */
      title: string;
      /**
       * Description
       * @description Relation description
       */
      description?: string | null;
      /**
       * Document Id
       * @description Document ID this relation belongs to
       */
      document_id: string;
    };
    /**
     * DocumentRelationResponse
     * @description Schema for document relation response.
     */
    DocumentRelationResponse: {
      /**
       * Title
       * @description Relation title
       */
      title: string;
      /**
       * Description
       * @description Relation description
       */
      description?: string | null;
      /** Id */
      id: string;
      /** Document Id */
      document_id: string;
      /**
       * Created At
       * Format: date-time
       */
      created_at: string;
      /**
       * Updated At
       * Format: date-time
       */
      updated_at: string;
      /** Created By */
      created_by: string | null;
      /** Updated By */
      updated_by: string | null;
    };
    /**
     * DocumentRelationWithNodes
     * @description Schema for document relation with nodes and edges.
     */
    DocumentRelationWithNodes: {
      /**
       * Title
       * @description Relation title
       */
      title: string;
      /**
       * Description
       * @description Relation description
       */
      description?: string | null;
      /** Id */
      id: string;
      /** Document Id */
      document_id: string;
      /**
       * Created At
       * Format: date-time
       */
      created_at: string;
      /**
       * Updated At
       * Format: date-time
       */
      updated_at: string;
      /** Created By */
      created_by: string | null;
      /** Updated By */
      updated_by: string | null;
      /**
       * Nodes
       * @default []
       */
      nodes: components["schemas"]["DocumentNodeResponse"][];
      /**
       * Edges
       * @default []
       */
      edges: components["schemas"]["DocumentEdgeResponse"][];
    };
    /**
     * DocumentResponse
     * @description Schema for document response.
     */
    DocumentResponse: {
      /**
       * File Name
       * @description Document file name
       */
      file_name: string;
      /**
       * Source File Path
       * @description Source file path
       */
      source_file_path: string;
      /**
       * File Type
       * @description File type (pdf, txt, doc, etc.)
       */
      file_type: string;
      /** Id */
      id: string;
      /** Collection Id */
      collection_id: string;
      /** Is Vectorized */
      is_vectorized: boolean;
      /** Is Graph Extracted */
      is_graph_extracted: boolean;
      /**
       * Created At
       * Format: date-time
       */
      created_at: string;
      /**
       * Updated At
       * Format: date-time
       */
      updated_at: string;
      /** Created By */
      created_by: string | null;
      /** Updated By */
      updated_by: string | null;
    };
    /**
     * DocumentSearchResponse
     * @description Schema for searched documents.
     */
    DocumentSearchResponse: {
      /**
       * File Name
       * @description Document file name
       */
      file_name: string;
      /**
       * Source File Path
       * @description Source file path
       */
      source_file_path: string;
      /**
       * File Type
       * @description File type (pdf, txt, doc, etc.)
       */
      file_type: string;
      /** Id */
      id: string;
      /** Collection Id */
      collection_id: string;
      /** Is Vectorized */
      is_vectorized: boolean;
      /** Is Graph Extracted */
      is_graph_extracted: boolean;
      /**
       * Created At
       * Format: date-time
       */
      created_at: string;
      /**
       * Updated At
       * Format: date-time
       */
      updated_at: string;
      /** Created By */
      created_by: string | null;
      /** Updated By */
      updated_by: string | null;
      /**
       * Chunk
       * @description List of chunks with search results
       */
      chunk?: components["schemas"]["ChunkSearchResponse"][];
    };
    /**
     * DocumentUpdate
     * @description Schema for updating a document.
     */
    DocumentUpdate: {
      /**
       * File Name
       * @description Document file name
       */
      file_name?: string | null;
      /**
       * Source File Path
       * @description Source file path
       */
      source_file_path?: string | null;
      /**
       * File Type
       * @description File type
       */
      file_type?: string | null;
      /**
       * Is Vectorized
       * @description Whether document is vectorized
       */
      is_vectorized?: boolean | null;
      /**
       * Is Graph Extracted
       * @description Whether knowledge graph is extracted
       */
      is_graph_extracted?: boolean | null;
    };
    /** HTTPValidationError */
    HTTPValidationError: {
      /** Detail */
      detail?: components["schemas"]["ValidationError"][];
    };
    /**
     * QueueHealthResponse
     * @description Queue health check response.
     */
    QueueHealthResponse: {
      /** Healthy */
      healthy: boolean;
      /** Message */
      message: string;
    };
    /**
     * QueueStatsResponse
     * @description Queue statistics response.
     */
    QueueStatsResponse: {
      /** Queue Name */
      queue_name: string;
      /** Message Count */
      message_count: number;
    };
    /**
     * QueueType
     * @description Predefined queue types.
     * @enum {string}
     */
    QueueType:
      | "document_processing"
      | "collection_processing"
      | "chat_notifications"
      | "system_events";
    /**
     * Role
     * @enum {string}
     */
    Role: "user" | "assistant" | "system";
    /**
     * SessionResponse
     * @description Session response.
     */
    SessionResponse: {
      /** Id */
      id: string;
      /** Account Id */
      account_id: string | null;
      /**
       * Created At
       * Format: date-time
       */
      created_at: string;
      /** Expires At */
      expires_at: string | null;
    };
    /**
     * TestPublishRequest
     * @description Request to test publish a message to a document, collection, or chat.
     */
    TestPublishRequest: {
      /** Target Type */
      target_type: string;
      /** Target Id */
      target_id: string;
      /** Event Type */
      event_type: string;
      /** Data */
      data: {
        [key: string]: unknown;
      };
    };
    /**
     * TopicCluster
     * @description Represents a cluster of topics with associated documents.
     */
    TopicCluster: {
      /** Title */
      title: string;
      /** Id */
      id: number;
      /** Documents */
      documents: components["schemas"]["DocumentResponse"][];
    };
    /**
     * UserLoginRequest
     * @description User login request.
     */
    UserLoginRequest: {
      /** Username */
      username: string;
      /** Password */
      password: string;
    };
    /**
     * UserRegisterRequest
     * @description User registration request.
     */
    UserRegisterRequest: {
      /** Username */
      username: string;
      /**
       * Email
       * Format: email
       */
      email: string;
      /** Password */
      password: string;
    };
    /**
     * UserResponse
     * @description User response model.
     */
    UserResponse: {
      /** Id */
      id: string;
      /** Username */
      username: string;
      /** Email */
      email: string;
      /**
       * Created At
       * Format: date-time
       */
      created_at: string;
    };
    /** ValidationError */
    ValidationError: {
      /** Location */
      loc: (string | number)[];
      /** Message */
      msg: string;
      /** Error Type */
      type: string;
    };
  };
  responses: never;
  parameters: never;
  requestBodies: never;
  headers: never;
  pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
  health_check_v1_health__get: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description Successful Response */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": unknown;
        };
      };
    };
  };
  register_auth_register_post: {
    parameters: {
      query?: {
        remember_me?: boolean;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["UserRegisterRequest"];
      };
    };
    responses: {
      /** @description Successful Response */
      201: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["AuthResponse"];
        };
      };
      /** @description Validation Error */
      422: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  login_auth_login_post: {
    parameters: {
      query?: {
        remember_me?: boolean;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["UserLoginRequest"];
      };
    };
    responses: {
      /** @description Successful Response */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["AuthResponse"];
        };
      };
      /** @description Validation Error */
      422: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  logout_auth_logout_post: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: {
        session?: string | null;
      };
    };
    requestBody?: never;
    responses: {
      /** @description Successful Response */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            [key: string]: unknown;
          };
        };
      };
      /** @description Validation Error */
      422: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  get_current_user_info_auth_me_get: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: {
        session?: string | null;
      };
    };
    requestBody?: never;
    responses: {
      /** @description Successful Response */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["UserResponse"];
        };
      };
      /** @description Validation Error */
      422: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  get_session_info_auth_session_get: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: {
        session?: string | null;
      };
    };
    requestBody?: never;
    responses: {
      /** @description Successful Response */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["SessionResponse"] | null;
        };
      };
      /** @description Validation Error */
      422: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  cleanup_expired_sessions_auth_sessions_delete: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: {
        session?: string | null;
      };
    };
    requestBody?: never;
    responses: {
      /** @description Successful Response */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            [key: string]: unknown;
          };
        };
      };
      /** @description Validation Error */
      422: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  refresh_session_auth_refresh_post: {
    parameters: {
      query?: {
        extend_duration?: boolean;
      };
      header?: never;
      path?: never;
      cookie?: {
        session?: string | null;
      };
    };
    requestBody?: never;
    responses: {
      /** @description Successful Response */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            [key: string]: unknown;
          };
        };
      };
      /** @description Validation Error */
      422: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  logout_all_sessions_auth_logout_all_post: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: {
        session?: string | null;
      };
    };
    requestBody?: never;
    responses: {
      /** @description Successful Response */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            [key: string]: unknown;
          };
        };
      };
      /** @description Validation Error */
      422: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  get_detailed_session_info_auth_session_info_get: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: {
        session?: string | null;
      };
    };
    requestBody?: never;
    responses: {
      /** @description Successful Response */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            [key: string]: unknown;
          };
        };
      };
      /** @description Validation Error */
      422: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  list_user_collections_collections__get: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: {
        session?: string | null;
      };
    };
    requestBody?: never;
    responses: {
      /** @description Successful Response */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["CollectionResponse"][];
        };
      };
      /** @description Validation Error */
      422: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  create_collection_collections__post: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: {
        session?: string | null;
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["CollectionCreate"];
      };
    };
    responses: {
      /** @description Successful Response */
      201: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["CollectionResponse"];
        };
      };
      /** @description Validation Error */
      422: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  get_collection_collections__collection_id__get: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        collection_id: string;
      };
      cookie?: {
        session?: string | null;
      };
    };
    requestBody?: never;
    responses: {
      /** @description Successful Response */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["CollectionDetailResponse"];
        };
      };
      /** @description Validation Error */
      422: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  update_collection_collections__collection_id__put: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        collection_id: string;
      };
      cookie?: {
        session?: string | null;
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["CollectionUpdate"];
      };
    };
    responses: {
      /** @description Successful Response */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["CollectionResponse"];
        };
      };
      /** @description Validation Error */
      422: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  delete_collection_collections__collection_id__delete: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        collection_id: string;
      };
      cookie?: {
        session?: string | null;
      };
    };
    requestBody?: never;
    responses: {
      /** @description Successful Response */
      204: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Validation Error */
      422: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  list_collection_documents_collections__collection_id__documents_get: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        collection_id: string;
      };
      cookie?: {
        session?: string | null;
      };
    };
    requestBody?: never;
    responses: {
      /** @description Successful Response */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["DocumentResponse"][];
        };
      };
      /** @description Validation Error */
      422: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  create_collection_chat_collections_chats_post: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: {
        session?: string | null;
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["CollectionChatCreate"];
      };
    };
    responses: {
      /** @description Successful Response */
      201: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["CollectionChatResponse"];
        };
      };
      /** @description Validation Error */
      422: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  list_collection_chats_collections__collection_id__chats_get: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        collection_id: string;
      };
      cookie?: {
        session?: string | null;
      };
    };
    requestBody?: never;
    responses: {
      /** @description Successful Response */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["CollectionChatResponse"][];
        };
      };
      /** @description Validation Error */
      422: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  get_collection_chat_collections_chats__collection_chat_id__get: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        collection_chat_id: string;
      };
      cookie?: {
        session?: string | null;
      };
    };
    requestBody?: never;
    responses: {
      /** @description Successful Response */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["CollectionChatResponse"];
        };
      };
      /** @description Validation Error */
      422: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  update_collection_chat_collections_chats__collection_chat_id__put: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        collection_chat_id: string;
      };
      cookie?: {
        session?: string | null;
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["CollectionChatUpdate"];
      };
    };
    responses: {
      /** @description Successful Response */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["CollectionChatResponse"];
        };
      };
      /** @description Validation Error */
      422: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  delete_collection_chat_collections_chats__collection_chat_id__delete: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        collection_chat_id: string;
      };
      cookie?: {
        session?: string | null;
      };
    };
    requestBody?: never;
    responses: {
      /** @description Successful Response */
      204: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Validation Error */
      422: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  list_collection_chat_history_collections_chats__collection_chat_id__history_get: {
    parameters: {
      query?: {
        /** @description Number of history items to return */
        limit?: number;
        /** @description Number of history items to skip */
        offset?: number;
      };
      header?: never;
      path: {
        collection_chat_id: string;
      };
      cookie?: {
        session?: string | null;
      };
    };
    requestBody?: never;
    responses: {
      /** @description Successful Response */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["CollectionChatWithHistory"];
        };
      };
      /** @description Validation Error */
      422: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  add_chat_history_collections_chats__collection_chat_id__history_post: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: {
        session?: string | null;
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["CollectionChatHistoryCreate"];
      };
    };
    responses: {
      /** @description Successful Response */
      201: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["CollectionChatHistoryResponse"];
        };
      };
      /** @description Validation Error */
      422: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  clear_chat_history_collections_chats__collection_chat_id__history_delete: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        collection_chat_id: string;
      };
      cookie?: {
        session?: string | null;
      };
    };
    requestBody?: never;
    responses: {
      /** @description Successful Response */
      204: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Validation Error */
      422: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  get_chat_history_collections_history__history_id__get: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        history_id: string;
      };
      cookie?: {
        session?: string | null;
      };
    };
    requestBody?: never;
    responses: {
      /** @description Successful Response */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["CollectionChatHistoryResponse"];
        };
      };
      /** @description Validation Error */
      422: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  edit_chat_history_collections_history__history_id__edit_post: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        history_id: string;
      };
      cookie?: {
        session?: string | null;
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["CollectionChatHistoryCreate"];
      };
    };
    responses: {
      /** @description Successful Response */
      201: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": unknown;
        };
      };
      /** @description Validation Error */
      422: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  create_collection_relation_collections_relations_post: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: {
        session?: string | null;
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["CollectionRelationCreate"];
      };
    };
    responses: {
      /** @description Successful Response */
      201: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["CollectionRelationResponse"];
        };
      };
      /** @description Validation Error */
      422: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  list_collection_relations_collections__collection_id__relations_get: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        collection_id: string;
      };
      cookie?: {
        session?: string | null;
      };
    };
    requestBody?: never;
    responses: {
      /** @description Successful Response */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["CollectionRelationWithNodes"][];
        };
      };
      /** @description Validation Error */
      422: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  get_collection_relation_collections_relations__relation_id__get: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        relation_id: string;
      };
      cookie?: {
        session?: string | null;
      };
    };
    requestBody?: never;
    responses: {
      /** @description Successful Response */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["CollectionRelationWithNodes"];
        };
      };
      /** @description Validation Error */
      422: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  create_collection_node_collections_relations__relation_id__nodes_post: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        relation_id: string;
      };
      cookie?: {
        session?: string | null;
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["CollectionNodeCreate"];
      };
    };
    responses: {
      /** @description Successful Response */
      201: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["CollectionNodeResponse"];
        };
      };
      /** @description Validation Error */
      422: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  create_collection_edge_collections_relations__relation_id__edges_post: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        relation_id: string;
      };
      cookie?: {
        session?: string | null;
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["CollectionEdgeCreate"];
      };
    };
    responses: {
      /** @description Successful Response */
      201: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["CollectionEdgeResponse"];
        };
      };
      /** @description Validation Error */
      422: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  upload_document_documents_upload_post: {
    parameters: {
      query: {
        collection_id: string;
      };
      header?: never;
      path?: never;
      cookie?: {
        session?: string | null;
      };
    };
    requestBody: {
      content: {
        "multipart/form-data": components["schemas"]["Body_upload_document_documents_upload_post"];
      };
    };
    responses: {
      /** @description Successful Response */
      201: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["DocumentResponse"];
        };
      };
      /** @description Validation Error */
      422: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  list_user_documents_documents__get: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: {
        session?: string | null;
      };
    };
    requestBody?: never;
    responses: {
      /** @description Successful Response */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["DocumentResponse"][];
        };
      };
      /** @description Validation Error */
      422: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  get_document_documents__document_id__get: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        document_id: string;
      };
      cookie?: {
        session?: string | null;
      };
    };
    requestBody?: never;
    responses: {
      /** @description Successful Response */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["DocumentDetailResponse"];
        };
      };
      /** @description Validation Error */
      422: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  update_document_documents__document_id__put: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        document_id: string;
      };
      cookie?: {
        session?: string | null;
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["DocumentUpdate"];
      };
    };
    responses: {
      /** @description Successful Response */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["DocumentResponse"];
        };
      };
      /** @description Validation Error */
      422: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  delete_document_documents__document_id__delete: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        document_id: string;
      };
      cookie?: {
        session?: string | null;
      };
    };
    requestBody?: never;
    responses: {
      /** @description Successful Response */
      204: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Validation Error */
      422: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  list_document_chunks_documents__document_id__chunks_get: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        document_id: string;
      };
      cookie?: {
        session?: string | null;
      };
    };
    requestBody?: never;
    responses: {
      /** @description Successful Response */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ChunkResponse"][];
        };
      };
      /** @description Validation Error */
      422: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  create_chunk_documents__document_id__chunks_post: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        document_id: string;
      };
      cookie?: {
        session?: string | null;
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["ChunkCreate"];
      };
    };
    responses: {
      /** @description Successful Response */
      201: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ChunkResponse"];
        };
      };
      /** @description Validation Error */
      422: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  search_document_chunks_documents__document_id__chunks_search_post: {
    parameters: {
      query: {
        /** @description Search query for chunks */
        query: string;
      };
      header?: never;
      path: {
        document_id: string;
      };
      cookie?: {
        session?: string | null;
      };
    };
    requestBody?: never;
    responses: {
      /** @description Successful Response */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ChunkSearchResponse"][];
        };
      };
      /** @description Validation Error */
      422: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  search_collection_chunks_documents_collection__collection_id__chunks_search_post: {
    parameters: {
      query: {
        /** @description Search query for chunks */
        query: string;
      };
      header?: never;
      path: {
        collection_id: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description Successful Response */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ChunkSearchResponse"][];
        };
      };
      /** @description Validation Error */
      422: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  search_collection_documents_documents_collection__collection_id__documents_search_post: {
    parameters: {
      query: {
        /** @description Search query for documents */
        query: string;
      };
      header?: never;
      path: {
        collection_id: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description Successful Response */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["DocumentSearchResponse"][];
        };
      };
      /** @description Validation Error */
      422: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  create_document_chat_documents_chats_post: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: {
        session?: string | null;
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["DocumentChatCreate"];
      };
    };
    responses: {
      /** @description Successful Response */
      201: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["DocumentChatResponse"];
        };
      };
      /** @description Validation Error */
      422: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  list_document_chats_documents__document_id__chats_get: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        document_id: string;
      };
      cookie?: {
        session?: string | null;
      };
    };
    requestBody?: never;
    responses: {
      /** @description Successful Response */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["DocumentChatResponse"][];
        };
      };
      /** @description Validation Error */
      422: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  get_document_chat_documents_chats__chat_id__get: {
    parameters: {
      query?: {
        /** @description Number of history items to return */
        limit?: number;
        /** @description Number of history items to skip */
        offset?: number;
      };
      header?: never;
      path: {
        chat_id: string;
      };
      cookie?: {
        session?: string | null;
      };
    };
    requestBody?: never;
    responses: {
      /** @description Successful Response */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["DocumentChatWithHistory"];
        };
      };
      /** @description Validation Error */
      422: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  update_document_chat_documents_chats__chat_id__put: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        chat_id: string;
      };
      cookie?: {
        session?: string | null;
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["DocumentChatUpdate"];
      };
    };
    responses: {
      /** @description Successful Response */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["DocumentChatResponse"];
        };
      };
      /** @description Validation Error */
      422: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  delete_document_chat_documents_chats__chat_id__delete: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        chat_id: string;
      };
      cookie?: {
        session?: string | null;
      };
    };
    requestBody?: never;
    responses: {
      /** @description Successful Response */
      204: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Validation Error */
      422: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  get_chat_history_documents_chats__chat_id__history_get: {
    parameters: {
      query?: {
        /** @description Number of messages */
        limit?: number;
        /** @description Number of messages to skip */
        offset?: number;
      };
      header?: never;
      path: {
        chat_id: string;
      };
      cookie?: {
        session?: string | null;
      };
    };
    requestBody?: never;
    responses: {
      /** @description Successful Response */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["DocumentChatHistoryResponse"][];
        };
      };
      /** @description Validation Error */
      422: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  add_chat_history_documents_chats__chat_id__history_post: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        chat_id: string;
      };
      cookie?: {
        session?: string | null;
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["DocumentChatHistoryCreate"];
      };
    };
    responses: {
      /** @description Successful Response */
      201: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["DocumentChatHistoryResponse"];
        };
      };
      /** @description Validation Error */
      422: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  create_document_relation_documents_relations_post: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: {
        session?: string | null;
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["DocumentRelationCreate"];
      };
    };
    responses: {
      /** @description Successful Response */
      201: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["DocumentRelationResponse"];
        };
      };
      /** @description Validation Error */
      422: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  create_document_graph_documents_graph_get: {
    parameters: {
      query: {
        document_id: string;
      };
      header?: never;
      path?: never;
      cookie?: {
        session?: string | null;
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["Body_create_document_graph_documents_graph_get"];
      };
    };
    responses: {
      /** @description Successful Response */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["DocumentRelationResponse"];
        };
      };
      /** @description Validation Error */
      422: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  list_document_relations_documents__document_id__relations_get: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        document_id: string;
      };
      cookie?: {
        session?: string | null;
      };
    };
    requestBody?: never;
    responses: {
      /** @description Successful Response */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["DocumentRelationWithNodes"][];
        };
      };
      /** @description Validation Error */
      422: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  get_document_relation_documents_relations__relation_id__get: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        relation_id: string;
      };
      cookie?: {
        session?: string | null;
      };
    };
    requestBody?: never;
    responses: {
      /** @description Successful Response */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["DocumentRelationWithNodes"];
        };
      };
      /** @description Validation Error */
      422: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  create_document_node_documents_relations__relation_id__nodes_post: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        relation_id: string;
      };
      cookie?: {
        session?: string | null;
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["DocumentNodeCreate"];
      };
    };
    responses: {
      /** @description Successful Response */
      201: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["DocumentNodeResponse"];
        };
      };
      /** @description Validation Error */
      422: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  create_document_edge_documents_relations__relation_id__edges_post: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        relation_id: string;
      };
      cookie?: {
        session?: string | null;
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["DocumentEdgeCreate"];
      };
    };
    responses: {
      /** @description Successful Response */
      201: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["DocumentEdgeResponse"];
        };
      };
      /** @description Validation Error */
      422: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  upload_and_ingest_documents_agentic_upload_ingest_post: {
    parameters: {
      query: {
        collection_id: string;
        graph_extract?: boolean;
        file_name?: string;
      };
      header?: never;
      path?: never;
      cookie?: {
        session?: string | null;
      };
    };
    requestBody: {
      content: {
        "multipart/form-data": components["schemas"]["Body_upload_and_ingest_documents_agentic_upload_ingest_post"];
      };
    };
    responses: {
      /** @description Successful Response */
      201: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["DocumentResponse"];
        };
      };
      /** @description Validation Error */
      422: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  ingest_documents_agentic_ingest_post: {
    parameters: {
      query: {
        document_id: string;
        graph_extract?: boolean;
      };
      header?: never;
      path?: never;
      cookie?: {
        session?: string | null;
      };
    };
    requestBody?: never;
    responses: {
      /** @description Successful Response */
      201: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["DocumentResponse"];
        };
      };
      /** @description Validation Error */
      422: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  cluster_documents_agentic_cluster_topic_post: {
    parameters: {
      query: {
        collection_id: string;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description Successful Response */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ClusteringResult"];
        };
      };
      /** @description Validation Error */
      422: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  rag_query_agentic_rag_query_post: {
    parameters: {
      query: {
        user_question: string;
        collection_chat_id: string;
      };
      header?: never;
      path?: never;
      cookie?: {
        session?: string | null;
      };
    };
    requestBody?: never;
    responses: {
      /** @description Successful Response */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["AgentResponse"];
        };
      };
      /** @description Validation Error */
      422: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  check_queue_health_queue_health_get: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description Successful Response */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["QueueHealthResponse"];
        };
      };
    };
  };
  initialize_queues_queue_initialize_post: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: {
        session?: string | null;
      };
    };
    requestBody?: never;
    responses: {
      /** @description Successful Response */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": unknown;
        };
      };
      /** @description Validation Error */
      422: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  get_queue_stats_queue_stats__queue_type__get: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        queue_type: components["schemas"]["QueueType"];
      };
      cookie?: {
        session?: string | null;
      };
    };
    requestBody?: never;
    responses: {
      /** @description Successful Response */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["QueueStatsResponse"];
        };
      };
      /** @description Validation Error */
      422: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  purge_queue_queue_purge__queue_type__post: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        queue_type: components["schemas"]["QueueType"];
      };
      cookie?: {
        session?: string | null;
      };
    };
    requestBody?: never;
    responses: {
      /** @description Successful Response */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": unknown;
        };
      };
      /** @description Validation Error */
      422: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  debug_queue_info_queue_debug__queue_type__get: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        queue_type: components["schemas"]["QueueType"];
      };
      cookie?: {
        session?: string | null;
      };
    };
    requestBody?: never;
    responses: {
      /** @description Successful Response */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": unknown;
        };
      };
      /** @description Validation Error */
      422: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  peek_queue_message_queue_peek__queue_type__get: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        queue_type: components["schemas"]["QueueType"];
      };
      cookie?: {
        session?: string | null;
      };
    };
    requestBody?: never;
    responses: {
      /** @description Successful Response */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": unknown;
        };
      };
      /** @description Validation Error */
      422: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  test_publish_queue_test_publish_post: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: {
        session?: string | null;
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["TestPublishRequest"];
      };
    };
    responses: {
      /** @description Successful Response */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": unknown;
        };
      };
      /** @description Validation Error */
      422: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  stream_events_sse_events_get: {
    parameters: {
      query?: {
        /** @description Comma-separated list of channels to subscribe to */
        channels?: string | null;
      };
      header?: never;
      path?: never;
      cookie?: {
        session?: string | null;
      };
    };
    requestBody?: never;
    responses: {
      /** @description Successful Response */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": unknown;
        };
      };
      /** @description Validation Error */
      422: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  stream_document_events_sse_documents__document_id__get: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        /** @description Document ID to stream events for */
        document_id: string;
      };
      cookie?: {
        session?: string | null;
      };
    };
    requestBody?: never;
    responses: {
      /** @description Successful Response */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": unknown;
        };
      };
      /** @description Validation Error */
      422: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  stream_collection_events_sse_collections__collection_id__get: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        /** @description Collection ID to stream events for */
        collection_id: string;
      };
      cookie?: {
        session?: string | null;
      };
    };
    requestBody?: never;
    responses: {
      /** @description Successful Response */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": unknown;
        };
      };
      /** @description Validation Error */
      422: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  stream_chat_events_sse_chats__chat_id__get: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        /** @description Chat ID to stream events for */
        chat_id: string;
      };
      cookie?: {
        session?: string | null;
      };
    };
    requestBody?: never;
    responses: {
      /** @description Successful Response */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": unknown;
        };
      };
      /** @description Validation Error */
      422: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
}
