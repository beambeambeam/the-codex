"""add_title_and_document_to_document_model

Revision ID: 901e926e1d8c
Revises: f3928c388893
Create Date: 2025-07-29 01:24:50.468262

"""

from collections.abc import Sequence
from typing import Union

import sqlalchemy as sa

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "901e926e1d8c"
down_revision: Union[str, Sequence[str], None] = "f3928c388893"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Add title and document fields to document table
    op.add_column("document", sa.Column("title", sa.Text(), nullable=True))
    op.add_column("document", sa.Column("document", sa.Text(), nullable=True))


def downgrade() -> None:
    """Downgrade schema."""
    # Remove title and document fields from document table
    op.drop_column("document", "document")
    op.drop_column("document", "title")
