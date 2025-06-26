"""Create User Table

Revision ID: ead654bee945
Revises:
Create Date: 2025-06-26 17:19:31.916661

"""

from collections.abc import Sequence
from typing import Union

import sqlalchemy as sa

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "ead654bee945"
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table(
        "user",
        sa.Column("id", sa.Text(), primary_key=True),
        sa.Column("username", sa.Text(), unique=True, nullable=False),
        sa.Column("email", sa.Text(), unique=True, nullable=False),
        sa.Column("created_at", sa.TIMESTAMP(), nullable=False),
        sa.Column("updated_at", sa.TIMESTAMP(), nullable=False),
    )
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
