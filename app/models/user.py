from datetime import datetime

from flask_login import UserMixin
from sqlalchemy import DateTime, func
from sqlalchemy.orm import mapped_column, relationship
from sqlalchemy.orm.base import Mapped
from sqlalchemy.sql.sqltypes import String
from typing_extensions import List, Optional
from werkzeug.security import check_password_hash, generate_password_hash

from app import db, login_manager


@login_manager.user_loader
def load_user(id):
    return User.query.get(int(id))


class User(db.Model, UserMixin):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column("user_id", primary_key=True)
    username: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    email: Mapped[Optional[str]] = mapped_column(String(120), unique=True, nullable=True)
    password_hash: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    google_id: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    profile_image: Mapped[Optional[str]] = mapped_column(String(), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(), default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(), default=func.now())

    stories: Mapped[List["Story"]] = relationship(back_populates="user")
    chat_rooms: Mapped[List["ChatParticipant"]] = relationship(back_populates="user")
    messages: Mapped[List["Message"]] = relationship(back_populates="user")
    notifications: Mapped[List["Notification"]] = relationship(back_populates="user")

    def set_password(self, password: str) -> None:
        self.password_hash = generate_password_hash(password)

    def check_password(self, password: str) -> bool:
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f"<User: {self.username}>"
