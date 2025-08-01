"""add_owner_permission_level

Revision ID: 7814de9a2166
Revises: 5be24fd20357
Create Date: 2025-07-31 21:57:09.983261

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import pgvector


# revision identifiers, used by Alembic.
revision: str = "7814de9a2166"
down_revision: Union[str, Sequence[str], None] = "5be24fd20357"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Add 'owner' to the collectionpermissionlevel enum
    op.execute("ALTER TYPE collectionpermissionlevel ADD VALUE 'owner'")


def downgrade() -> None:
    """Downgrade schema."""
    # Note: PostgreSQL doesn't support removing enum values directly
    # This would require recreating the enum without 'owner' value
    # For now, we'll leave it as is since removing enum values is complex
    pass
