from pydantic import BaseModel, Field

from api.collection.schemas import CollectionResponse
from api.document.schemas import DocumentResponse


class RenderTreeRequest(BaseModel):
    """
    Request model for rendering a document tree.
    """

    username: str = Field(..., description="Username of the person viewing the tree")
    documents: list[DocumentResponse] = Field(
        ..., description="List of document IDs to include in the tree"
    )
    collection: CollectionResponse = Field(
        ..., description="Collection ID to which the documents belong"
    )
