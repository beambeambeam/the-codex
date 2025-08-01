import enum


class CollectionStatus(str, enum.Enum):
    idle = "idle"
    processing = "processing"


class ClusteringStatus(str, enum.Enum):
    idle = "idle"
    processing = "processing"


class Role(str, enum.Enum):
    user = "user"
    assistant = "assistant"
    system = "system"


class IngestionStatus(enum.Enum):
    pending = "pending"
    processing = "processing"
    ready = "ready"
    failed = "failed"


class CollectionChatReferenceType(str, enum.Enum):
    chunk = "chunk"
    graph = "graph"


class ChatStatus(enum.Enum):
    new_session = "NEW_SESSION"
    awaiting_user_input = "AWAITING_USER_INPUT"
    processing_input = "PROCESSING_INPUT"
    responding = "RESPONDING"
    response_complete = "RESPONSE_COMPLETE"
    error_state = "ERROR_STATE"
    session_ended = "SESSION_ENDED"
