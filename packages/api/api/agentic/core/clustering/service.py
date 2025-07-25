from collections import Counter, defaultdict

import numpy as np
import pandas as pd
import umap
from bertopic import BERTopic
from hdbscan import HDBSCAN
from loguru import logger
from tqdm.auto import tqdm

from ....document.schemas import ChunkResponse, DocumentResponse
from ....document.service import DocumentService
from ...core import call_llm
from ..prompts import render_keyword_to_topic_extraction
from .schemas import ClusteringResult, DocumentDistribution, TopicCluster


class DocumentClusteringService:
    """Service for clustering document chunks based on their embeddings."""

    def __init__(
        self,
        document_service: DocumentService,
    ):
        self._DOCUMENT_SERVICE = document_service
        self._UMAP_MODEL = umap.UMAP(
            n_neighbors=15, metric="cosine", random_state=42, n_components=2
        )
        self._HDBSCAN_MODEL = HDBSCAN(
            min_cluster_size=3,
            max_cluster_size=10,
            cluster_selection_epsilon=0.4,
            prediction_data=True,
        )
        self.TOPIC_MODEL = BERTopic(
            umap_model=self._UMAP_MODEL,
            hdbscan_model=self._HDBSCAN_MODEL,
            calculate_probabilities=True,
            top_n_words=50,
        )

    def get_collection_chunk_dict(
        self,
        collection_id: str,
    ) -> tuple[dict[str, list[ChunkResponse]], dict[str, DocumentResponse]]:
        """Fetches chunk embeddings for a given collection and maps doc_id to document."""
        documents = self._DOCUMENT_SERVICE.get_collection_documents(
            collection_id=collection_id
        )
        documents = [DocumentResponse.model_validate(doc) for doc in documents]

        chunk_embeddings = defaultdict(list)
        doc_id_to_doc = {}

        for doc in documents:
            doc_id_to_doc[doc.id] = doc
            chunks = self._DOCUMENT_SERVICE.get_document_chunks(
                document_id=doc.id, embedding=True
            )
            chunks = [ChunkResponse.model_validate(chunk) for chunk in chunks]

            for chunk in chunks:
                if chunk.embedding is not None:
                    chunk_embeddings[doc.id].append(chunk)

        return chunk_embeddings, doc_id_to_doc

    def llm_generate_cluster_title(self, keywords: list[str]) -> str:
        """
        Generates a descriptive title for a cluster of topics using an LLM.

        Parameters:
        - keywords: List of keywords representing the cluster.

        Returns:
        - A string title generated by the LLM.
        """
        keywords = ", ".join(keywords)
        prompt = render_keyword_to_topic_extraction(keywords=keywords)
        print(f"/nGenerating cluster title with keywords: {keywords[:50]}")
        return call_llm(prompt)

    def _get_topic_keyword_map(
        self, topic_info_df, top_words: int
    ) -> dict[int, list[str]]:
        """
        (Helper) Creates a map from topic ID to its top keywords.
        This is more efficient than rebuilding the map on each call.
        """
        return {
            row.Topic: row.Representation[:top_words]
            for _, row in topic_info_df.iterrows()
        }

    def _get_keywords_for_topics(
        self, topic_keyword_map: dict[int, list[str]], topic_ids: list[int]
    ) -> list[str]:
        """(Helper) Fetch keywords for a list of topic IDs from the pre-built map."""
        keywords = []
        for topic_id in topic_ids:
            keywords.extend(topic_keyword_map.get(topic_id, []))
        return keywords

    def _structure_clustering_result(
        self,
        doc_distributions: dict[str, Counter],
        doc_primary_topic: dict[str, int],
        doc_id_to_doc: dict[str, DocumentResponse],
        topic_id_to_name: dict[int, str],
        cluster_titles: dict[int, str],
    ) -> ClusteringResult:
        """
        Assembles the final ClusteringResult object from processed data.
        """
        final_documents: list[DocumentDistribution] = []
        # Intermediate dict to group documents by their primary topic ID
        topic_clusters_by_id = defaultdict(list)

        # Create DocumentDistribution for each document
        for doc_id, topic_counter in doc_distributions.items():
            primary_topic_id = doc_primary_topic[doc_id]

            # Use generated title, fall back to BERTopic name, then to generic name
            top_topic_title = cluster_titles.get(
                primary_topic_id,
                topic_id_to_name.get(primary_topic_id, f"Topic {primary_topic_id}"),
            )

            label_distribution = {
                topic_id_to_name.get(topic_id, f"Topic {topic_id}"): count
                for topic_id, count in topic_counter.items()
            }

            final_documents.append(
                DocumentDistribution(
                    document_id=doc_id,
                    top_topic=top_topic_title,
                    distribution=label_distribution,
                )
            )
            # Group the full document object by its primary topic for cluster creation
            topic_clusters_by_id[primary_topic_id].append(doc_id_to_doc[doc_id])

        # Create the list of TopicCluster objects
        final_topics: list[TopicCluster] = []
        for topic_id, docs in topic_clusters_by_id.items():
            title = cluster_titles.get(
                topic_id, topic_id_to_name.get(topic_id, f"Topic {topic_id}")
            )
            final_topics.append(TopicCluster(id=topic_id, title=title, documents=docs))

        logger.info(f"Clustering complete. Found {len(final_topics)} clusters.")

        return ClusteringResult(topics=final_topics, documents=final_documents)

    def cluster_documents(
        self,
        collection_id: str,
        cluster_title_top_n_topics: int = 5,
        cluster_title_top_n_words: int = 10,
    ) -> ClusteringResult:
        """
        Clusters document chunks in a collection and generates descriptive topic titles.
        """
        chunk_embeddings, doc_id_to_doc = self.get_collection_chunk_dict(collection_id)
        if not chunk_embeddings:
            # Return the new empty schema
            return ClusteringResult(topics=[], documents=[])

        logger.info(
            f"Starting clustering for {collection_id} with {len(chunk_embeddings)} documents."
        )

        chunk_texts, embeddings, doc_ids = [], [], []
        for doc_id, chunks in chunk_embeddings.items():
            for chunk in chunks:
                chunk_texts.append(chunk.chunk_text)
                embeddings.append(chunk.embedding)
                doc_ids.append(doc_id)

        # create dataframe for topic modeling
        chunk_df = pd.DataFrame(
            {
                "chunk_text": chunk_texts,
                "embedding": embeddings,
                "doc_id": doc_ids,
            }
        )
        # remove duplicate chunks
        chunk_df = chunk_df.drop_duplicates(subset=["embedding"])
        chunk_texts = chunk_df["chunk_text"].tolist()
        embeddings = chunk_df["embedding"].tolist()
        doc_ids = chunk_df["doc_id"].tolist()

        logger.info(f"remove duplications, now {len(set(doc_ids))} documents.")

        # 1. Perform Topic Modeling
        topics, _ = self.TOPIC_MODEL.fit_transform(
            chunk_texts, embeddings=np.array(embeddings)
        )
        topic_info = self.TOPIC_MODEL.get_topic_info()
        logger.info(f"Found {len(topic_info)} topics for collection {collection_id}.")

        # 2. Pre-build maps for efficiency
        topic_id_to_name = {row.Topic: row.Name for _, row in topic_info.iterrows()}
        topic_keyword_map = self._get_topic_keyword_map(
            topic_info, top_words=cluster_title_top_n_words
        )

        # 3. Calculate per-document topic distributions
        doc_chunk_topics = defaultdict(list)
        for doc_id, topic in zip(doc_ids, topics):
            doc_chunk_topics[doc_id].append(topic)

        doc_distributions = {
            doc_id: Counter(topics) for doc_id, topics in doc_chunk_topics.items()
        }
        doc_primary_topic = {
            doc_id: ctr.most_common(1)[0][0]
            for doc_id, ctr in doc_distributions.items()
        }

        # 4. Aggregate topic counts for title generation
        cluster_topic_counters = defaultdict(Counter)
        for doc_id, counter in doc_distributions.items():
            primary_topic_id = doc_primary_topic[doc_id]
            cluster_topic_counters[primary_topic_id].update(counter)

        # 5. Generate descriptive titles for each cluster using an LLM
        cluster_titles = {}
        for topic_id, counter in tqdm(
            list(cluster_topic_counters.items()), desc="Generating cluster titles"
        ):
            top_contributing_topics = [
                tid for tid, _ in counter.most_common(cluster_title_top_n_topics)
            ]
            keywords = self._get_keywords_for_topics(
                topic_keyword_map, top_contributing_topics
            )
            if keywords:
                cluster_titles[topic_id] = self.llm_generate_cluster_title(keywords)

        # 6. Structure the final output using a helper method
        return self._structure_clustering_result(
            doc_distributions=doc_distributions,
            doc_primary_topic=doc_primary_topic,
            doc_id_to_doc=doc_id_to_doc,
            topic_id_to_name=topic_id_to_name,
            cluster_titles=cluster_titles,
        )
