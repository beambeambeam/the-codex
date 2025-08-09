from sklearn.neighbors import NearestNeighbors

from ..embedding.embedding import TextEmbedder
from .schemas import DocumentEdgeBase, DocumentNodeBase, ExtractedGraph


class KnowledgeGraphMerger:
    def __init__(self, encoder: TextEmbedder):
        """
        Initialize the merger with an encoder and similarity threshold.
        :param encoder: An object with a method `encode` that takes a list of strings
                        and returns their embeddings as a numpy array.
        """
        self.encoder = encoder

    def _preprocess_label(self, label: str) -> str:
        """Normalize label for comparison."""
        return label.strip().lower()

    def _build_canonical_map(
        self, label_to_id: dict[str, str], threshold: float
    ) -> dict[str, str]:
        """Group similar labels and pick canonical names."""
        labels = list(label_to_id.keys())
        embeddings = self.encoder.get_embedding(
            [self._preprocess_label(label) for label in labels]
        )

        n_neighbors = min(len(labels), 50)
        nn = NearestNeighbors(metric="cosine", n_neighbors=n_neighbors)
        nn.fit(embeddings)

        label_groups = {label: set([label]) for label in labels}
        for i, label in enumerate(labels):
            distances, indices = nn.kneighbors([embeddings[i]])
            for dist, j in zip(distances[0], indices[0]):
                score = 1 - dist  # cosine similarity
                if score >= threshold:
                    label_groups[label].add(labels[j])
                    label_groups[labels[j]].add(label)

        visited = set()
        canonical_map = {}
        for label in labels:
            if label in visited:
                continue
            stack, cluster = [label], set()
            while stack:
                label = stack.pop()
                if label not in visited:
                    visited.add(label)
                    cluster.add(label)
                    stack.extend(label_groups[label])
            canonical = sorted(cluster, key=lambda x: (-x.count(" "), -len(x)))[0]
            for label in cluster:
                canonical_map[label] = canonical
        return canonical_map

    def _extract_label_maps(
        self,
        kgs: list[ExtractedGraph],
    ) -> tuple[dict[str, str], dict[str, dict]]:
        """Map labels → IDs and IDs → node data."""
        label_to_id, id_to_data = {}, {}
        for kg in kgs:
            for node in kg.nodes:
                label_to_id[node.label] = node.id
                id_to_data[node.id] = node.model_dump()
        return label_to_id, id_to_data

    def _merge_kgs(
        self,
        kgs: list[ExtractedGraph],
        canonical_map: dict[str, str],
        label_to_id: dict[str, str],
        id_to_data: dict[str, dict],
    ) -> ExtractedGraph:
        """Merge knowledge graphs based on canonical labels."""
        merged_nodes, merged_edges = {}, []
        label_to_new_id = {}

        # Merge nodes
        for label, canonical in canonical_map.items():
            if label not in label_to_id:
                continue
            original_id = label_to_id[label]
            if canonical not in label_to_new_id:
                new_id = f"Canonical_{canonical.replace(' ', '_')}"
                label_to_new_id[canonical] = new_id
                aliases = sorted(
                    label for label, c in canonical_map.items() if c == canonical
                )
                data = id_to_data[original_id]
                merged_nodes[new_id] = DocumentNodeBase(
                    id=new_id,
                    label=canonical,
                    type=data.get("type", "Unknown"),
                    title=data.get("title", canonical),
                    description=data.get("description", ""),
                    aliases=aliases,
                )

        # Merge edges
        seen_edges = set()
        for kg in kgs:
            for edge in kg.edges:
                src_label = id_to_data[edge.source]["label"]
                tgt_label = id_to_data[edge.target]["label"]
                new_src = label_to_new_id.get(canonical_map.get(src_label))
                new_tgt = label_to_new_id.get(canonical_map.get(tgt_label))
                if new_src and new_tgt:
                    edge_key = (new_src, new_tgt, edge.label)
                    if edge_key not in seen_edges:
                        seen_edges.add(edge_key)
                        merged_edges.append(
                            DocumentEdgeBase(
                                label=edge.label, source=new_src, target=new_tgt
                            )
                        )

        return ExtractedGraph(nodes=list(merged_nodes.values()), edges=merged_edges)

    def merge_kgs(
        self,
        kgs: list[ExtractedGraph],
        threshold: float = 0.65,
    ) -> ExtractedGraph:
        """
        Merge multiple knowledge graphs into a single graph.
        :param kgs: List of ExtractedGraph objects to merge.
        :param threshold: Similarity threshold for grouping labels.
        :return: Merged ExtractedGraph object.
        """
        label_to_id, id_to_data = self._extract_label_maps(kgs)
        canonical_map = self._build_canonical_map(label_to_id, threshold)
        return self._merge_kgs(kgs, canonical_map, label_to_id, id_to_data)


# === Usage Example ===
# encoder = YourEncoder()  # must have .encode(list_of_strings) -> np.ndarray
# kgs = [kg1, kg2]  # both ExtractedGraph
# label_to_id, id_to_data = extract_label_maps(kgs)
# canonical_map = build_canonical_map(label_to_id, encoder, threshold=0.65)
# final_graph = merge_kgs(kgs, canonical_map, label_to_id, id_to_data)
