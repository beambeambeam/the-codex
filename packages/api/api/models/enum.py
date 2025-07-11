import enum


class Role(str, enum.Enum):
    user = "user"
    assistant = "assistant"
    system = "system"
