from datetime import datetime
from sqlalchemy import ForeignKey, func, DateTime
from sqlalchemy.orm import mapped_column, relationship
from sqlalchemy.orm.base import Mapped
from sqlalchemy.sql.sqltypes import String

from app import db

class Story(db.Model):
    __tablename__ = "stories"
    id: Mapped[int] = mapped_column("story_id", primary_key=True)
    title: Mapped[str] = mapped_column(String(128))
    content: Mapped[str] = mapped_column(String(1024))
    created_at: Mapped[datetime] = mapped_column(DateTime(), default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(), default=func.now())
    user_id: Mapped[int] = mapped_column(ForeignKey("users.user_id"))

    pin: Mapped["Pin"] = relationship(back_populates="story")
    user: Mapped["User"]  = relationship(back_populates="stories")

    def __repr__(self):
        return f"<Story: {self.title}>"
