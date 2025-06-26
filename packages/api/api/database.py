"""Database configuration and dependencies."""

import os
from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Database URL from environment
DATABASE_URL = (
    f"postgresql+psycopg://{os.getenv('POSTGRES_USER', 'root_admin')}:"
    f"{os.getenv('POSTGRES_PASSWORD', 'root_admin')}@localhost:3002/postgres"
)

# Create engine
engine = create_engine(DATABASE_URL)

# Create SessionLocal class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db() -> Generator:
    """Get database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
