from flask_login import UserMixin
from sqlalchemy import ForeignKey, func, types
from sqlalchemy.orm import mapped_column, relationship
from sqlalchemy.orm.base import Mapped
from sqlalchemy.sql.sqltypes import String
from typing_extensions import Optional
from werkzeug.security import check_password_hash, generate_password_hash

from app import db

class Story(db.Model):
    __tablename__ = "stories"

    id: Mapped[int] = mapped_column("story_id", primary_key=True)
    tittle: Mapped[str] = mapped_column(String(128), unique=False, nullable=False)
    content: Mapped[str] = mapped_column(String(1024), unique=False, nullable=False)
    created_at: Mapped[types.DateTime] = mapped_column(types.DateTime(255), nullable=True,default=func.current_timestamp())
    updated_at: Mapped[types.DateTime] = mapped_column(types.DateTime(100), nullable=True,default=func.current_timestamp())
    user_id: Mapped[int] = mapped_column(types.Integer, ForeignKey("users.user_id"), nullable=False)

    pin: Mapped["Pin"] = relationship(back_populates="story")

    # Relationship
    user: Mapped["User"]  = relationship(back_populates="stories")

    def __init__(self, tittle: str, content: str):
        self.tittle = tittle
        self.content = content
        self.created_at = func.current_timestamp()
        self.updated_at = func.current_timestamp()

    def __repr__(self):
        return f"<Story: {self.tittle}>"
    



