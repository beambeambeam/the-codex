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
  "/auth/users/search": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * Search Users
     * @description Search for users by username or email.
     */
    get: operations["search_users_auth_users_search_get"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/collections/{collection_id}/permissions": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * List Collection Permissions
     * @description List all permissions for a collection.
     */
    get: operations["list_collection_permissions_collections__collection_id__permissions_get"];
    put?: never;
    /**
     * Grant Permission
     * @description Grant permission to a user for a collection.
     */
    post: operations["grant_permission_collections__collection_id__permissions_post"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/collections/{collection_id}/permissions/{user_id}": {
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
     * Revoke Permission
     * @description Revoke permission from a user for a collection.
     */
    delete: operations["revoke_permission_collections__collection_id__permissions__user_id__delete"];
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/collections/{collection_id}/permissions/me": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * Get My Permission
     * @description Get current user's permission for a collection.
     */
    get: operations["get_my_permission_collections__collection_id__permissions_me_get"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/collections/{collection_id}/permissions/logs": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * Get Permission Logs
     * @description Get permission audit logs for a collection.
     */
    get: operations["get_permission_logs_collections__collection_id__permissions_logs_get"];
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
  "/collections/search": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * Search Collection By Name
     * @description Search for collections by name or description.
     */
    get: operations["search_collection_by_name_collections_search_get"];
    put?: never;
    post?: never;
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
  "/collections/{collection_id}/clustering": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * Get Collection Clustering
     * @description Get all clusterings for a collection, including virtual clusterings by file type and date.
     */
    get: operations["get_collection_clustering_collections__collection_id__clustering_get"];
    put?: never;
    post?: never;
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
  "/collections/{collection_id}/search/users": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * Search Users For Collection
     * @description Search for users by username or email, excluding those already in the collection.
     */
    get: operations["search_users_for_collection_collections__collection_id__search_users_get"];
    put?: never;
    post?: never;
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
    /**
     * Search Documents By Name
     * @description Search for documents in a collection by name or description.
     */
    get: operations["search_documents_by_name_documents_collection__collection_id__documents_search_get"];
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
     * @description Ingest multiple documents into the system.
     *     This endpoint allows users to upload multiple documents for processing and storage.
     *     Returns as soon as document records are created; ingestion continues in the background.
     */
    post: operations["upload_and_ingest_documents_agentic_upload_ingest_post"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/agentic/graph_extract/{document_id}": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * Graph Extract
     * @description Extracts a knowledge graph from the documents in a collection.
     */
    post: operations["graph_extract_agentic_graph_extract__document_id__post"];
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
  "/sse/system": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * Stream System Events
     * @description Stream system events.
     */
    get: operations["stream_system_events_sse_system_get"];
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
  "/chats/": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** List Chats */
    get: operations["list_chats_chats__get"];
    put?: never;
    /**
     * Create Chat With Rag
     * @description Create a new chat and trigger RAG processing in the background.
     */
    post: operations["create_chat_with_rag_chats__post"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/chats/search": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * Search Chats By Title
     * @description Search for chats in a collection by title.
     */
    get: operations["search_chats_by_title_chats_search_get"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/chats/{chat_id}": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * Get Chat
     * @description Get chat with its history by chat ID.
     */
    get: operations["get_chat_chats__chat_id__get"];
    /** Update Chat */
    put: operations["update_chat_chats__chat_id__put"];
    post?: never;
    /** Delete Chat */
    delete: operations["delete_chat_chats__chat_id__delete"];
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/clustering/": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** List Clusterings */
    get: operations["list_clusterings_clustering__get"];
    put?: never;
    /** Create Clustering */
    post: operations["create_clustering_clustering__post"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/clustering/{clustering_id}": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** Get Clustering */
    get: operations["get_clustering_clustering__clustering_id__get"];
    /** Update Clustering */
    put: operations["update_clustering_clustering__clustering_id__put"];
    post?: never;
    /** Delete Clustering */
    delete: operations["delete_clustering_clustering__clustering_id__delete"];
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/clustering/{clustering_id}/topics": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** List Clustering Topics */
    get: operations["list_clustering_topics_clustering__clustering_id__topics_get"];
    put?: never;
    /** Create Clustering Topic */
    post: operations["create_clustering_topic_clustering__clustering_id__topics_post"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/clustering/topics/{topic_id}": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** Get Clustering Topic */
    get: operations["get_clustering_topic_clustering_topics__topic_id__get"];
    /** Update Clustering Topic */
    put: operations["update_clustering_topic_clustering_topics__topic_id__put"];
    post?: never;
    /** Delete Clustering Topic */
    delete: operations["delete_clustering_topic_clustering_topics__topic_id__delete"];
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/clustering/topics/{topic_id}/children": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** List Clustering Children */
    get: operations["list_clustering_children_clustering_topics__topic_id__children_get"];
    put?: never;
    /** Create Clustering Child */
    post: operations["create_clustering_child_clustering_topics__topic_id__children_post"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/clustering/children/{child_id}": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** Get Clustering Child */
    get: operations["get_clustering_child_clustering_children__child_id__get"];
    /** Update Clustering Child */
    put: operations["update_clustering_child_clustering_children__child_id__put"];
    post?: never;
    /** Delete Clustering Child */
    delete: operations["delete_clustering_child_clustering_children__child_id__delete"];
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
      chat_history?: components["schemas"]["ChatHistoryResponse"];
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
      /** Input Files */
      input_files: File[];
    };
    /**
     * ChatHistoryResponse
     * @description Schema for a list of chat messages.
     */
    ChatHistoryResponse: {
      /**
       * Messages
       * @description List of chat messages in the conversation
       */
      messages?: components["schemas"]["ChatMessageResponse"][];
    };
    /**
     * ChatMessageResponse
     * @description Schema for chat messages in the RAG system.
     */
    ChatMessageResponse: {
      /**
       * Collection Chat Id
       * @description Collection Chat ID
       */
      collection_chat_id?: string;
      /** @description Role of the message sender (user/assistant/system) */
      role: components["schemas"]["Role"];
      /**
       * Content
       * @description Content of the chat message
       */
      content: string;
      /**
       * Id
       * @description Unique identifier for the chat message
       */
      id: string;
      /**
       * Created By
       * @description Username of the user who created the chat message
       */
      created_by: string | null;
      /**
       * Created At
       * Format: date-time
       * @description Timestamp when the chat message was created
       */
      created_at: string;
      /**
       * Retrieved Contexts
       * @description List of context references retrieved for the chat message
       */
      retrieved_contexts?: components["schemas"]["ChunkSearchResponse"][];
    };
    /**
     * ChatStatus
     * @enum {string}
     */
    ChatStatus:
      | "NEW_SESSION"
      | "AWAITING_USER_INPUT"
      | "PROCESSING_INPUT"
      | "RESPONDING"
      | "RESPONSE_COMPLETE"
      | "ERROR_STATE"
      | "SESSION_ENDED";
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
    /** ClusteringChildCreate */
    ClusteringChildCreate: {
      /**
       * Clustering Topic Id
       * @description Clustering Topic ID
       */
      clustering_topic_id: string;
      /**
       * Target
       * @description Document ID
       */
      target: string;
    };
    /** ClusteringChildResponse */
    ClusteringChildResponse: {
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
       * Clustering Topic Id
       * @description Clustering Topic ID
       */
      clustering_topic_id: string;
      /**
       * Target
       * @description Document ID
       */
      target: string;
      /**
       * Created By Username
       * @description Get the username of the creator.
       */
      readonly created_by_username: string | null;
      /**
       * Updated By Username
       * @description Get the username of the updater.
       */
      readonly updated_by_username: string | null;
    };
    /** ClusteringChildUpdate */
    ClusteringChildUpdate: {
      /**
       * Target
       * @description Document ID
       */
      target?: string | null;
    };
    /** ClusteringCreate */
    ClusteringCreate: {
      /**
       * Collection Id
       * @description Collection ID
       */
      collection_id: string;
      /**
       * Search Word
       * @description Search word
       */
      search_word?: string | null;
      /**
       * Title
       * @description Clustering title
       */
      title: string;
      /**
       * Description
       * @description Clustering description
       */
      description?: string | null;
    };
    /** ClusteringResponse */
    ClusteringResponse: {
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
       * Collection Id
       * @description Collection ID
       */
      collection_id: string;
      /**
       * Search Word
       * @description Search word
       */
      search_word?: string | null;
      /**
       * Title
       * @description Clustering title
       */
      title: string;
      /**
       * Description
       * @description Clustering description
       */
      description?: string | null;
      /**
       * Created By Username
       * @description Get the username of the creator.
       */
      readonly created_by_username: string | null;
      /**
       * Updated By Username
       * @description Get the username of the updater.
       */
      readonly updated_by_username: string | null;
    };
    /** ClusteringTopicCreate */
    ClusteringTopicCreate: {
      /**
       * Clustering Id
       * @description Clustering ID
       */
      clustering_id: string;
      /**
       * Title
       * @description Topic title
       */
      title: string;
      /**
       * Description
       * @description Topic description
       */
      description?: string | null;
    };
    /** ClusteringTopicResponse */
    ClusteringTopicResponse: {
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
       * Clustering Id
       * @description Clustering ID
       */
      clustering_id: string;
      /**
       * Title
       * @description Topic title
       */
      title: string;
      /**
       * Description
       * @description Topic description
       */
      description?: string | null;
      /**
       * Created By Username
       * @description Get the username of the creator.
       */
      readonly created_by_username: string | null;
      /**
       * Updated By Username
       * @description Get the username of the updater.
       */
      readonly updated_by_username: string | null;
    };
    /** ClusteringTopicUpdate */
    ClusteringTopicUpdate: {
      /**
       * Title
       * @description Topic title
       */
      title?: string | null;
      /**
       * Description
       * @description Topic description
       */
      description?: string | null;
    };
    /**
     * ClusteringTopicWithDocuments
     * @description Topic with documents for enhanced clustering response.
     */
    ClusteringTopicWithDocuments: {
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
      /** Clustering Id */
      clustering_id: string;
      /** Title */
      title: string;
      /** Description */
      description: string | null;
      /** Documents */
      documents: components["schemas"]["DocumentResponse"][];
      /**
       * Created By Username
       * @description Get the username of the creator.
       */
      readonly created_by_username: string | null;
      /**
       * Updated By Username
       * @description Get the username of the updater.
       */
      readonly updated_by_username: string | null;
    };
    /** ClusteringUpdate */
    ClusteringUpdate: {
      /**
       * Search Word
       * @description Search word
       */
      search_word?: string | null;
      /**
       * Title
       * @description Clustering title
       */
      title?: string | null;
      /**
       * Description
       * @description Clustering description
       */
      description?: string | null;
    };
    /** CollectionChatCreate */
    CollectionChatCreate: {
      /**
       * Collection Id
       * @description Collection ID
       */
      collection_id: string;
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
      /** Message */
      message: string;
      /** Reference */
      reference: string[];
    };
    /** CollectionChatHistoryResponse */
    CollectionChatHistoryResponse: {
      /**
       * Collection Chat Id
       * @description Collection Chat ID
       */
      collection_chat_id: string;
      /** @description Role of the message sender (user/assistant/system) */
      role: components["schemas"]["Role"];
      /**
       * Content
       * @description Content of the chat message
       */
      content: string;
      /** Id */
      id: string;
      /**
       * Created By
       * @description Username of the user who created the message
       */
      created_by?: string | null;
      /**
       * Created At
       * Format: date-time
       */
      created_at: string;
    };
    /** CollectionChatResponse */
    CollectionChatResponse: {
      /**
       * Collection Id
       * @description Collection ID
       */
      collection_id: string;
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
      /**
       * Created By
       * @description Username of the user who created the chat
       */
      created_by?: string | null;
      /**
       * Created At
       * Format: date-time
       */
      created_at: string;
      /**
       * Updated By
       * @description Username of the user who last updated the chat
       */
      updated_by?: string | null;
      /**
       * Updated At
       * Format: date-time
       */
      updated_at: string;
      status: components["schemas"]["ChatStatus"];
    };
    /** CollectionChatUpdate */
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
      /** @description Chat status */
      status?: components["schemas"]["ChatStatus"] | null;
    };
    /** CollectionChatWithHistoryResponse */
    CollectionChatWithHistoryResponse: {
      /**
       * Collection Id
       * @description Collection ID
       */
      collection_id: string;
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
      /**
       * Created By
       * @description Username of the user who created the chat
       */
      created_by?: string | null;
      /**
       * Created At
       * Format: date-time
       */
      created_at: string;
      /**
       * Updated By
       * @description Username of the user who last updated the chat
       */
      updated_by?: string | null;
      /**
       * Updated At
       * Format: date-time
       */
      updated_at: string;
      status: components["schemas"]["ChatStatus"];
      /**
       * Histories
       * @description Chat history messages
       */
      histories?: components["schemas"]["CollectionChatHistoryResponse"][];
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
     * @description Schema for collection response. created_by and updated_by are usernames, not UUIDs.
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
       * Title
       * @description Document title
       */
      title?: string | null;
      /**
       * Document
       * @description Document content
       */
      document?: string | null;
      /**
       * Description
       * @description Document description
       */
      description?: string | null;
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
      /**
       * File Size
       * @description File size in bytes
       */
      file_size?: number | null;
      /** Id */
      id: string;
      /** Collection Id */
      collection_id: string;
      /** Is Vectorized */
      is_vectorized: boolean;
      /** Is Graph Extracted */
      is_graph_extracted: boolean;
      status: components["schemas"]["IngestionStatus"];
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
       * Minio File Url
       * @description Presigned MinIO file URL for iframe usage
       */
      minio_file_url?: string | null;
      /**
       * Chunks
       * @default []
       */
      chunks: components["schemas"]["ChunkResponse"][];
      /**
       * Relations
       * @default []
       */
      relations: components["schemas"]["DocumentRelationWithNodes"][];
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
       * Title
       * @description Document title
       */
      title?: string | null;
      /**
       * Document
       * @description Document content
       */
      document?: string | null;
      /**
       * Description
       * @description Document description
       */
      description?: string | null;
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
      /**
       * File Size
       * @description File size in bytes
       */
      file_size?: number | null;
      /** Id */
      id: string;
      /** Collection Id */
      collection_id: string;
      /** Is Vectorized */
      is_vectorized: boolean;
      /** Is Graph Extracted */
      is_graph_extracted: boolean;
      status: components["schemas"]["IngestionStatus"];
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
       * Minio File Url
       * @description Presigned MinIO file URL for iframe usage
       */
      minio_file_url?: string | null;
    };
    /**
     * DocumentResponseTruncated
     * @description Schema for truncated document response.
     */
    DocumentResponseTruncated: {
      /**
       * File Name
       * @description Document file name
       */
      file_name: string;
      /**
       * Title
       * @description Document title
       */
      title?: string | null;
      /**
       * Document
       * @description Document content
       */
      document?: string | null;
      /**
       * Description
       * @description Document description
       */
      description?: string | null;
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
      /**
       * File Size
       * @description File size in bytes
       */
      file_size?: number | null;
      /** Id */
      id: string;
      /** Collection Id */
      collection_id: string;
      /** Is Vectorized */
      is_vectorized: boolean;
      /** Is Graph Extracted */
      is_graph_extracted: boolean;
      status: components["schemas"]["IngestionStatus"];
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
       * Minio File Url
       * @description Presigned MinIO file URL for iframe usage
       */
      minio_file_url?: string | null;
    };
    /**
     * DocumentSearchResponseTruncated
     * @description Schema for truncated searched documents.
     */
    DocumentSearchResponseTruncated: {
      /**
       * File Name
       * @description Document file name
       */
      file_name: string;
      /**
       * Title
       * @description Document title
       */
      title?: string | null;
      /**
       * Document
       * @description Document content
       */
      document?: string | null;
      /**
       * Description
       * @description Document description
       */
      description?: string | null;
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
      /**
       * File Size
       * @description File size in bytes
       */
      file_size?: number | null;
      /** Id */
      id: string;
      /** Collection Id */
      collection_id: string;
      /** Is Vectorized */
      is_vectorized: boolean;
      /** Is Graph Extracted */
      is_graph_extracted: boolean;
      status: components["schemas"]["IngestionStatus"];
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
       * Minio File Url
       * @description Presigned MinIO file URL for iframe usage
       */
      minio_file_url?: string | null;
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
       * Title
       * @description Document title
       */
      title?: string | null;
      /**
       * Document
       * @description Document content
       */
      document?: string | null;
      /**
       * Description
       * @description Document description
       */
      description?: string | null;
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
       * File Size
       * @description File size in bytes
       */
      file_size?: number | null;
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
      /**
       * Summary
       * @description Document summary
       */
      summary?: string | null;
      /** @description Document ingestion status */
      status?: components["schemas"]["IngestionStatus"] | null;
    };
    /**
     * EnhancedClusteringResponse
     * @description Enhanced clustering response with topics and documents.
     */
    EnhancedClusteringResponse: {
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
      /** Collection Id */
      collection_id: string;
      /** Search Word */
      search_word: string | null;
      /** Title */
      title: string;
      /** Description */
      description: string | null;
      /** Topics */
      topics: components["schemas"]["ClusteringTopicWithDocuments"][];
      /**
       * Created By Username
       * @description Get the username of the creator.
       */
      readonly created_by_username: string | null;
      /**
       * Updated By Username
       * @description Get the username of the updater.
       */
      readonly updated_by_username: string | null;
    };
    /** HTTPValidationError */
    HTTPValidationError: {
      /** Detail */
      detail?: components["schemas"]["ValidationError"][];
    };
    /**
     * IngestionStatus
     * @enum {string}
     */
    IngestionStatus: "pending" | "processing" | "ready" | "failed";
    /**
     * PermissionGrantRequest
     * @description Request schema for granting permission.
     */
    PermissionGrantRequest: {
      /** User Id */
      user_id: string;
      /**
       * Permission Level
       * @default edit
       * @enum {string}
       */
      permission_level: "edit" | "owner";
    };
    /**
     * PermissionLogWithUserResponse
     * @description Response schema for permission log with user details.
     */
    PermissionLogWithUserResponse: {
      /** Id */
      id: string;
      /** Collection Id */
      collection_id: string;
      /** User Id */
      user_id: string;
      /** Username */
      username: string;
      /** Email */
      email: string;
      /**
       * Action
       * @enum {string}
       */
      action: "granted" | "revoked";
      /**
       * Permission Level
       * @enum {string}
       */
      permission_level: "edit" | "owner";
      /** Performed By */
      performed_by: string;
      /** Performer Username */
      performer_username: string;
      /**
       * Created At
       * Format: date-time
       */
      created_at: string;
    };
    /**
     * PermissionResponse
     * @description Response schema for permission.
     */
    PermissionResponse: {
      /** Id */
      id: string;
      /** Collection Id */
      collection_id: string;
      /** User Id */
      user_id: string;
      /**
       * Permission Level
       * @enum {string}
       */
      permission_level: "edit" | "owner";
      /** Granted By */
      granted_by: string;
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
     * RAGQueryRequest
     * @description Schema for RAG query request body.
     */
    RAGQueryRequest: {
      /**
       * User Question
       * @description The user's question or query for the RAG system
       */
      user_question: string;
      /**
       * Reference
       * @description Optional list of document references to use for the query
       */
      reference?: string[];
    };
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
     * UserPermissionResponse
     * @description Response schema for user permission with user details.
     */
    UserPermissionResponse: {
      /** Id */
      id: string;
      /** Collection Id */
      collection_id: string;
      /** User Id */
      user_id: string;
      /** Username */
      username: string;
      /** Email */
      email: string;
      /**
       * Permission Level
       * @enum {string}
       */
      permission_level: "edit" | "owner";
      /** Granted By */
      granted_by: string;
      /** Granter Username */
      granter_username: string;
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
    /**
     * UserSearchResponse
     * @description User search response model.
     */
    UserSearchResponse: {
      /** Id */
      id: string;
      /** Username */
      username: string;
      /** Email */
      email: string;
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
  search_users_auth_users_search_get: {
    parameters: {
      query: {
        /** @description Search query for users by username or email */
        query: string;
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
          "application/json": components["schemas"]["UserSearchResponse"][];
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
  list_collection_permissions_collections__collection_id__permissions_get: {
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
          "application/json": components["schemas"]["UserPermissionResponse"][];
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
  grant_permission_collections__collection_id__permissions_post: {
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
        "application/json": components["schemas"]["PermissionGrantRequest"];
      };
    };
    responses: {
      /** @description Successful Response */
      201: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["PermissionResponse"];
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
  revoke_permission_collections__collection_id__permissions__user_id__delete: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        collection_id: string;
        user_id: string;
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
  get_my_permission_collections__collection_id__permissions_me_get: {
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
          "application/json": components["schemas"]["PermissionResponse"];
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
  get_permission_logs_collections__collection_id__permissions_logs_get: {
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
          "application/json": components["schemas"]["PermissionLogWithUserResponse"][];
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
  search_collection_by_name_collections_search_get: {
    parameters: {
      query?: {
        /** @description Search query for collections by name/description. Leave empty to return all collections. */
        query?: string;
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
          "application/json": components["schemas"]["DocumentResponseTruncated"][];
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
  get_collection_clustering_collections__collection_id__clustering_get: {
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
          "application/json": components["schemas"]["EnhancedClusteringResponse"][];
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
  search_users_for_collection_collections__collection_id__search_users_get: {
    parameters: {
      query: {
        /** @description Search query for users by username or email */
        query: string;
      };
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
          "application/json": components["schemas"]["UserSearchResponse"][];
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
          "application/json": components["schemas"]["DocumentResponseTruncated"][];
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
          "application/json": components["schemas"]["DocumentResponseTruncated"];
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
  search_documents_by_name_documents_collection__collection_id__documents_search_get: {
    parameters: {
      query: {
        /** @description Search query for documents by name/description */
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
          "application/json": components["schemas"]["DocumentResponseTruncated"][];
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
          "application/json": components["schemas"]["DocumentSearchResponseTruncated"][];
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
          "application/json": components["schemas"]["DocumentResponseTruncated"][];
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
  graph_extract_agentic_graph_extract__document_id__post: {
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
          "application/json": components["schemas"]["DocumentResponseTruncated"];
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
          "application/json": components["schemas"]["ClusteringResponse"];
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
        chat_id: string;
      };
      header?: never;
      path?: never;
      cookie?: {
        session?: string | null;
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["RAGQueryRequest"];
      };
    };
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
  stream_system_events_sse_system_get: {
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
  list_chats_chats__get: {
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
  create_chat_with_rag_chats__post: {
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
  search_chats_by_title_chats_search_get: {
    parameters: {
      query: {
        collection_id: string;
        /** @description Search query for chats by title */
        query: string;
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
  get_chat_chats__chat_id__get: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        chat_id: string;
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
          "application/json": components["schemas"]["CollectionChatWithHistoryResponse"];
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
  update_chat_chats__chat_id__put: {
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
  delete_chat_chats__chat_id__delete: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        chat_id: string;
      };
      cookie?: never;
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
  list_clusterings_clustering__get: {
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
          "application/json": components["schemas"]["ClusteringResponse"][];
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
  create_clustering_clustering__post: {
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
        "application/json": components["schemas"]["ClusteringCreate"];
      };
    };
    responses: {
      /** @description Successful Response */
      201: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ClusteringResponse"];
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
  get_clustering_clustering__clustering_id__get: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        clustering_id: string;
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
          "application/json": components["schemas"]["ClusteringResponse"];
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
  update_clustering_clustering__clustering_id__put: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        clustering_id: string;
      };
      cookie?: {
        session?: string | null;
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["ClusteringUpdate"];
      };
    };
    responses: {
      /** @description Successful Response */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ClusteringResponse"];
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
  delete_clustering_clustering__clustering_id__delete: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        clustering_id: string;
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
  list_clustering_topics_clustering__clustering_id__topics_get: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        clustering_id: string;
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
          "application/json": components["schemas"]["ClusteringTopicResponse"][];
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
  create_clustering_topic_clustering__clustering_id__topics_post: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        clustering_id: string;
      };
      cookie?: {
        session?: string | null;
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["ClusteringTopicCreate"];
      };
    };
    responses: {
      /** @description Successful Response */
      201: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ClusteringTopicResponse"];
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
  get_clustering_topic_clustering_topics__topic_id__get: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        topic_id: string;
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
          "application/json": components["schemas"]["ClusteringTopicResponse"];
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
  update_clustering_topic_clustering_topics__topic_id__put: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        topic_id: string;
      };
      cookie?: {
        session?: string | null;
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["ClusteringTopicUpdate"];
      };
    };
    responses: {
      /** @description Successful Response */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ClusteringTopicResponse"];
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
  delete_clustering_topic_clustering_topics__topic_id__delete: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        topic_id: string;
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
  list_clustering_children_clustering_topics__topic_id__children_get: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        topic_id: string;
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
          "application/json": components["schemas"]["ClusteringChildResponse"][];
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
  create_clustering_child_clustering_topics__topic_id__children_post: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        topic_id: string;
      };
      cookie?: {
        session?: string | null;
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["ClusteringChildCreate"];
      };
    };
    responses: {
      /** @description Successful Response */
      201: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ClusteringChildResponse"];
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
  get_clustering_child_clustering_children__child_id__get: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        child_id: string;
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
          "application/json": components["schemas"]["ClusteringChildResponse"];
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
  update_clustering_child_clustering_children__child_id__put: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        child_id: string;
      };
      cookie?: {
        session?: string | null;
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["ClusteringChildUpdate"];
      };
    };
    responses: {
      /** @description Successful Response */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ClusteringChildResponse"];
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
  delete_clustering_child_clustering_children__child_id__delete: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        child_id: string;
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
}
