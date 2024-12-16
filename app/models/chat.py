from datetime import datetime
from typing import List, Optional

from sqlalchemy import TIMESTAMP, ForeignKey, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app import db


class ChatRoom(db.Model):
    __tablename__ = "chat_rooms"

    id: Mapped[int] = mapped_column("chat_room_id", primary_key=True)
    last_message: Mapped[Optional[str]] = mapped_column(String(1024))
    last_message_timestamp: Mapped[Optional[datetime]] = mapped_column(TIMESTAMP(timezone=True))
    created_at: Mapped[datetime] = mapped_column(default=func.now())

    users: Mapped[List["ChatParticipant"]] = relationship(back_populates="chat_room")
    messages: Mapped[List["Message"]] = relationship(back_populates="chat_room")

    def __repr__(self):
        return f"<ChatRoom: {self.id}>"


class ChatParticipant(db.Model):
    __tablename__ = "chat_participants"

    chat_room_id: Mapped[int] = mapped_column(ForeignKey("chat_rooms.chat_room_id"), primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.user_id"), primary_key=True)

    chat_room: Mapped["ChatRoom"] = relationship(back_populates="users")
    user: Mapped["User"] = relationship(back_populates="chat_rooms")

    def __repr__(self):
        return f"<ChatParticipant: ChatRoom={self.chat_room_id}, User={self.user}>"
