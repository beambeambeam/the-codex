"""Collection API routes."""

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session, joinedload

from ..auth.dependencies import get_current_user
from ..clustering.schemas import EnhancedClusteringResponse
from ..clustering.service import ClusteringService, get_clustering_service
from ..database import get_db
from ..document.dependencies import get_document_service
from ..document.schemas import DocumentResponseTruncated
from ..document.service import DocumentService
from ..models.collection import CollectionRelation
from ..models.user import User
from .dependencies import (
    get_collection_or_404,
    get_collection_relation_or_404,
    get_collection_relation_with_modify_permission,
    get_collection_service,
    get_collection_with_modify_permission,
)
from .permission import router as permission_router
from .schemas import (
    CollectionCreate,
    CollectionDetailResponse,
    CollectionEdgeCreate,
    CollectionEdgeResponse,
    CollectionNodeCreate,
    CollectionNodeResponse,
    CollectionRelationCreate,
    CollectionRelationResponse,
    CollectionRelationWithNodes,
    CollectionResponse,
    CollectionUpdate,
)
from .service import CollectionService

router = APIRouter(prefix="/collections", tags=["collections"])

# Include permission routes
router.include_router(permission_router)


@router.post(
    "/", response_model=CollectionResponse, status_code=status.HTTP_201_CREATED
)
def create_collection(
    collection_data: CollectionCreate,
    current_user: User = Depends(get_current_user),
    collection_service: CollectionService = Depends(get_collection_service),
):
    """Create a new collection."""
    return collection_service.create_collection(collection_data, current_user)


@router.get("/", response_model=list[CollectionResponse])
def list_user_collections(
    current_user: User = Depends(get_current_user),
    collection_service: CollectionService = Depends(get_collection_service),
):
    """List all collections for the current user."""
    return collection_service.get_user_collections(current_user.id)


@router.get(
    "/search", response_model=list[CollectionResponse], status_code=status.HTTP_200_OK
)
def search_collection_by_name(
    current_user: User = Depends(get_current_user),
    query: str = Query(
        "",
        description="Search query for collections by name/description. Leave empty to return all collections.",
    ),
    collection_service: CollectionService = Depends(get_collection_service),
) -> list[CollectionResponse]:
    """Search for collections by name or description."""
    return collection_service.search_collection_by_name(current_user, query)


@router.get("/{collection_id}", response_model=CollectionDetailResponse)
def get_collection(
    collection=Depends(get_collection_or_404),
    collection_service: CollectionService = Depends(get_collection_service),
):
    """Get a collection with all details."""
    return collection_service.get_collection_with_details(collection.id)


@router.put("/{collection_id}", response_model=CollectionResponse)
def update_collection(
    update_data: CollectionUpdate,
    collection=Depends(get_collection_with_modify_permission),
    current_user: User = Depends(get_current_user),
    collection_service: CollectionService = Depends(get_collection_service),
):
    """Update a collection."""
    return collection_service.update_collection(
        collection.id, update_data, current_user
    )


@router.delete("/{collection_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_collection(
    collection=Depends(get_collection_with_modify_permission),
    current_user: User = Depends(get_current_user),
    collection_service: CollectionService = Depends(get_collection_service),
):
    """Delete a collection."""
    collection_service.delete_collection(collection.id, current_user)


@router.get(
    "/{collection_id}/documents", response_model=list[DocumentResponseTruncated]
)
def list_collection_documents(
    collection=Depends(get_collection_or_404),
    document_service: DocumentService = Depends(get_document_service),
):
    """List all documents in a collection."""
    return document_service.get_collection_documents(collection.id)


@router.get(
    "/{collection_id}/clustering", response_model=list[EnhancedClusteringResponse]
)
def get_collection_clustering(
    collection=Depends(get_collection_or_404),
    current_user: User = Depends(get_current_user),
    clustering_service: ClusteringService = Depends(get_clustering_service),
):
    """Get all clusterings for a collection, including virtual clusterings by file type and date."""
    return clustering_service.get_clusterings_by_collection(collection.id, current_user)


# Collection Relation routes
@router.post(
    "/relations",
    response_model=CollectionRelationResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_collection_relation(
    relation_data: CollectionRelationCreate,
    current_user: User = Depends(get_current_user),
    collection_service: CollectionService = Depends(get_collection_service),
):
    """Create a new collection relation."""
    return collection_service.create_collection_relation(relation_data, current_user)


@router.get(
    "/{collection_id}/relations", response_model=list[CollectionRelationWithNodes]
)
def list_collection_relations(
    collection=Depends(get_collection_or_404),
    db: Session = Depends(get_db),
):
    """List all relations for a collection with nodes and edges."""
    relations = (
        db.query(CollectionRelation)
        .options(
            joinedload(CollectionRelation.nodes),
            joinedload(CollectionRelation.edges),
        )
        .filter(CollectionRelation.collection_id == collection.id)
        .all()
    )

    return [
        CollectionRelationWithNodes(
            **CollectionRelationResponse.model_validate(relation).model_dump(),
            nodes=[
                CollectionNodeResponse.model_validate(node) for node in relation.nodes
            ],
            edges=[
                CollectionEdgeResponse.model_validate(edge) for edge in relation.edges
            ],
        )
        for relation in relations
    ]


@router.get("/relations/{relation_id}", response_model=CollectionRelationWithNodes)
def get_collection_relation(
    relation=Depends(get_collection_relation_or_404),
):
    """Get a collection relation with nodes and edges."""
    return CollectionRelationWithNodes(
        **CollectionRelationResponse.model_validate(relation).model_dump(),
        nodes=[CollectionNodeResponse.model_validate(node) for node in relation.nodes],
        edges=[CollectionEdgeResponse.model_validate(edge) for edge in relation.edges],
    )


# Collection Node routes
@router.post(
    "/relations/{relation_id}/nodes",
    response_model=CollectionNodeResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_collection_node(
    node_data: CollectionNodeCreate,
    relation=Depends(get_collection_relation_with_modify_permission),
    current_user: User = Depends(get_current_user),
    collection_service: CollectionService = Depends(get_collection_service),
):
    """Create a new collection node."""
    # Ensure the relation_id in the data matches the URL parameter
    node_data.collection_relation_id = relation.id
    return collection_service.create_collection_node(node_data, current_user)


# Collection Edge routes
@router.post(
    "/relations/{relation_id}/edges",
    response_model=CollectionEdgeResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_collection_edge(
    edge_data: CollectionEdgeCreate,
    relation=Depends(get_collection_relation_with_modify_permission),
    current_user: User = Depends(get_current_user),
    collection_service: CollectionService = Depends(get_collection_service),
):
    """Create a new collection edge."""
    # Ensure the relation_id in the data matches the URL parameter
    edge_data.collection_relation_id = relation.id
    return collection_service.create_collection_edge(edge_data, current_user)
