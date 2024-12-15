"""add reference_id to notification table

Revision ID: 8b57cc66204d
Revises: 6897d2beaec4
Create Date: 2024-12-15 13:27:35.688437

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '8b57cc66204d'
down_revision = '6897d2beaec4'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('notifications', schema=None) as batch_op:
        batch_op.add_column(sa.Column('reference_id', sa.Integer(), nullable=False))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('notifications', schema=None) as batch_op:
        batch_op.drop_column('reference_id')

    # ### end Alembic commands ###
