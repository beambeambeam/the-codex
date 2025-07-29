from fastapi import APIRouter, Depends, status

from ..auth.dependencies import get_current_user
from .schemas import (
    ClusteringChildCreate,
    ClusteringChildResponse,
    ClusteringChildUpdate,
    ClusteringCreate,
    ClusteringResponse,
    ClusteringTopicCreate,
    ClusteringTopicResponse,
    ClusteringTopicUpdate,
    ClusteringUpdate,
)
from .service import (
    ClusteringService,
    get_clustering_service,
)

router = APIRouter(prefix="/clustering", tags=["clustering"])


@router.post(
    "/", response_model=ClusteringResponse, status_code=status.HTTP_201_CREATED
)
def create_clustering(
    clustering_data: ClusteringCreate,
    current_user=Depends(get_current_user),
    service: ClusteringService = Depends(get_clustering_service),
):
    return service.create_clustering(clustering_data, current_user)


@router.get("/", response_model=list[ClusteringResponse])
def list_clusterings(
    current_user=Depends(get_current_user),
    service: ClusteringService = Depends(get_clustering_service),
):
    return service.list_clusterings(current_user)


@router.get("/{clustering_id}", response_model=ClusteringResponse)
def get_clustering(
    clustering_id: str,
    current_user=Depends(get_current_user),
    service: ClusteringService = Depends(get_clustering_service),
):
    return service.get_clustering(clustering_id, current_user)


@router.put("/{clustering_id}", response_model=ClusteringResponse)
def update_clustering(
    clustering_id: str,
    clustering_data: ClusteringUpdate,
    current_user=Depends(get_current_user),
    service: ClusteringService = Depends(get_clustering_service),
):
    return service.update_clustering(clustering_id, clustering_data, current_user)


@router.delete("/{clustering_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_clustering(
    clustering_id: str,
    current_user=Depends(get_current_user),
    service: ClusteringService = Depends(get_clustering_service),
):
    service.delete_clustering(clustering_id, current_user)
    return None


# ClusteringTopic endpoints
@router.post(
    "/{clustering_id}/topics",
    response_model=ClusteringTopicResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_clustering_topic(
    clustering_id: str,
    topic_data: ClusteringTopicCreate,
    current_user=Depends(get_current_user),
    service: ClusteringService = Depends(get_clustering_service),
):
    return service.create_clustering_topic(clustering_id, topic_data, current_user)


@router.get("/{clustering_id}/topics", response_model=list[ClusteringTopicResponse])
def list_clustering_topics(
    clustering_id: str,
    current_user=Depends(get_current_user),
    service: ClusteringService = Depends(get_clustering_service),
):
    return service.list_clustering_topics(clustering_id, current_user)


@router.get("/topics/{topic_id}", response_model=ClusteringTopicResponse)
def get_clustering_topic(
    topic_id: str,
    current_user=Depends(get_current_user),
    service: ClusteringService = Depends(get_clustering_service),
):
    return service.get_clustering_topic(topic_id, current_user)


@router.put("/topics/{topic_id}", response_model=ClusteringTopicResponse)
def update_clustering_topic(
    topic_id: str,
    topic_data: ClusteringTopicUpdate,
    current_user=Depends(get_current_user),
    service: ClusteringService = Depends(get_clustering_service),
):
    return service.update_clustering_topic(topic_id, topic_data, current_user)


@router.delete("/topics/{topic_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_clustering_topic(
    topic_id: str,
    current_user=Depends(get_current_user),
    service: ClusteringService = Depends(get_clustering_service),
):
    service.delete_clustering_topic(topic_id, current_user)
    return None


# ClusteringChild endpoints
@router.post(
    "/topics/{topic_id}/children",
    response_model=ClusteringChildResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_clustering_child(
    topic_id: str,
    child_data: ClusteringChildCreate,
    current_user=Depends(get_current_user),
    service: ClusteringService = Depends(get_clustering_service),
):
    return service.create_clustering_child(topic_id, child_data, current_user)


@router.get("/topics/{topic_id}/children", response_model=list[ClusteringChildResponse])
def list_clustering_children(
    topic_id: str,
    current_user=Depends(get_current_user),
    service: ClusteringService = Depends(get_clustering_service),
):
    return service.list_clustering_children(topic_id, current_user)


@router.get("/children/{child_id}", response_model=ClusteringChildResponse)
def get_clustering_child(
    child_id: str,
    current_user=Depends(get_current_user),
    service: ClusteringService = Depends(get_clustering_service),
):
    return service.get_clustering_child(child_id, current_user)


@router.put("/children/{child_id}", response_model=ClusteringChildResponse)
def update_clustering_child(
    child_id: str,
    child_data: ClusteringChildUpdate,
    current_user=Depends(get_current_user),
    service: ClusteringService = Depends(get_clustering_service),
):
    return service.update_clustering_child(child_id, child_data, current_user)


@router.delete("/children/{child_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_clustering_child(
    child_id: str,
    current_user=Depends(get_current_user),
    service: ClusteringService = Depends(get_clustering_service),
):
    service.delete_clustering_child(child_id, current_user)
    return None
