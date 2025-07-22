import enum


class Role(str, enum.Enum):
    user = "user"
    assistant = "assistant"
    system = "system"


class CollectionChatReferenceType(str, enum.Enum):
    chunk = "chunk"
    graph = "graph"
