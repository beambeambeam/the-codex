"""drop_user_table

Revision ID: b0652186d15c
Revises: ead654bee945
Create Date: 2025-06-26 17:53:47.911097

"""

from collections.abc import Sequence
from typing import Union

import sqlalchemy as sa

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "b0652186d15c"
down_revision: Union[str, Sequence[str], None] = "ead654bee945"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Drop user table."""
    op.drop_table("user")


def downgrade() -> None:
    """Recreate user table."""
    op.create_table(
        "user",
        sa.Column("id", sa.Text(), primary_key=True),
        sa.Column("username", sa.Text(), unique=True, nullable=False),
        sa.Column("email", sa.Text(), unique=True, nullable=False),
        sa.Column("created_at", sa.TIMESTAMP(), nullable=False),
        sa.Column("updated_at", sa.TIMESTAMP(), nullable=False),
    )
