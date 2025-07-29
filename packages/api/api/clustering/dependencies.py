from .service import ClusteringService, get_clustering_service


def get_clustering_service_dep() -> ClusteringService:
    return get_clustering_service()
