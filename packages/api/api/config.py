"""Application configuration."""

import os
from functools import lru_cache


class Settings:
    """Application settings."""

    # Database settings
    POSTGRES_USER: str = os.getenv("POSTGRES_USER", "root_admin")
    POSTGRES_PASSWORD: str = os.getenv("POSTGRES_PASSWORD", "root_admin")
    DATABASE_URL: str = f"postgresql+psycopg://{POSTGRES_USER}:{POSTGRES_PASSWORD}@localhost:3002/postgres"

    # MinIO settings
    MINIO_ENDPOINT: str = os.getenv("MINIO_ENDPOINT", "localhost:9000")
    MINIO_ACCESS_KEY: str = os.getenv("MINIO_ROOT_USER", "root_admin")
    MINIO_SECRET_KEY: str = os.getenv("MINIO_ROOT_PASSWORD", "root_admin")
    MINIO_SECURE: bool = os.getenv("MINIO_SECURE", "false").lower() == "true"
    MINIO_BUCKET_NAME: str = os.getenv("MINIO_BUCKET_NAME", "documents")

    # Security settings
    SECRET_KEY: str = os.getenv("SECRET_KEY", "SECRET_KEY_IN_PRODUCTION")


@lru_cache
def get_settings() -> Settings:
    """Get cached application settings."""
    return Settings()
