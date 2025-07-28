import enum


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
