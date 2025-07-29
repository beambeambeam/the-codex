from .schemas import (
    ClusteringChildCreate,
    ClusteringChildUpdate,
    ClusteringCreate,
    ClusteringTopicCreate,
    ClusteringTopicUpdate,
    ClusteringUpdate,
)


class ClusteringService:
    def create_clustering(self, clustering_data: ClusteringCreate, user):
        pass

    def list_clusterings(self, user):
        pass

    def get_clustering(self, clustering_id: str, user):
        pass

    def update_clustering(
        self, clustering_id: str, clustering_data: ClusteringUpdate, user
    ):
        pass

    def delete_clustering(self, clustering_id: str, user):
        pass

    # ClusteringTopic methods
    def create_clustering_topic(
        self, clustering_id: str, topic_data: ClusteringTopicCreate, user
    ):
        pass

    def list_clustering_topics(self, clustering_id: str, user):
        pass

    def get_clustering_topic(self, topic_id: str, user):
        pass

    def update_clustering_topic(
        self, topic_id: str, topic_data: ClusteringTopicUpdate, user
    ):
        pass

    def delete_clustering_topic(self, topic_id: str, user):
        pass

    # ClusteringChild methods
    def create_clustering_child(
        self, topic_id: str, child_data: ClusteringChildCreate, user
    ):
        pass

    def list_clustering_children(self, topic_id: str, user):
        pass

    def get_clustering_child(self, child_id: str, user):
        pass

    def update_clustering_child(
        self, child_id: str, child_data: ClusteringChildUpdate, user
    ):
        pass

    def delete_clustering_child(self, child_id: str, user):
        pass


def get_clustering_service():
    return ClusteringService()
