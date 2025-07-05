from typing import Literal, Union

import numpy as np
from loguru import logger
from model2vec import StaticModel
from sentence_transformers import SentenceTransformer

MODEL_BACKEND_MAP = {
    "bge-m3-distilled": "sentence_transformer",
    "FlukeTJ/bge-m3-m2v-distilled-256": "model2vec",
    "jaeyong2/bge-m3-Thai": "sentence_transformer",
}


class TextEmbedder:
    """Class for generating text embeddings using specified models and backends."""

    def __init__(
        self,
        model_name: str = "FlukeTJ/bge-m3-m2v-distilled-256",
        backend: Literal["model2vec", "sentence_transformer"] = "model2vec",
        cache_folder: str = "cache_models",
    ):
        """
        params: model_name: str - Name of the embedding model to use.
        params: backend: Literal - Type of backend to use for embeddings.
        params: cache_folder: str - Folder to cache models. model2vec is exceptional.
        """

        self.model_name = model_name
        self.backend = backend
        self.cache_folder = cache_folder
        self.model: Union[SentenceTransformer, StaticModel] = self._load_model()

    def _load_model(self):
        """Loads the embedding model based on backend type."""
        logger.info(
            f"Loading embedding model: {self.model_name} using backend: {self.backend}"
        )

        if self.backend == "model2vec":
            model = StaticModel.from_pretrained(self.model_name)

        elif self.backend == "sentence_transformer":
            model = SentenceTransformer(self.model_name, cache_folder=self.cache_folder)

        else:
            raise ValueError(f"Unsupported backend type: {self.backend}")

        logger.info("Embedding model loaded successfully.")
        return model

    def get_embedding(
        self, text: Union[str, list[str]], normalize: bool = True
    ) -> np.ndarray:
        """Encodes the given text(s) into embedding vector(s)."""
        if self.model is None:
            logger.error("Embedding model is not available.")
            return None

        try:
            embeddings = self.model.encode(text, normalize_embeddings=normalize)
            return embeddings

        except Exception as e:
            logger.error(f"Error generating embeddings: {e}")
            return None
