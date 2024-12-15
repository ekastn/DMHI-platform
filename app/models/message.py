from datetime import datetime

from sqlalchemy import TIMESTAMP, Boolean, ForeignKey, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app import db


class Message(db.Model):
    __tablename__ = "messages"

    id: Mapped[int] = mapped_column("message_id", primary_key=True)
    chat_room_id: Mapped[int] = mapped_column(ForeignKey("chat_rooms.chat_room_id"))
    user_id: Mapped[int] = mapped_column(ForeignKey("users.user_id"))
    content: Mapped[str] = mapped_column(String(1024))
    is_delivered: Mapped[bool] = mapped_column(Boolean, default=False)
    sent_at: Mapped[datetime] = mapped_column(TIMESTAMP(timezone=True), default=func.current_timestamp())

    chat_room: Mapped["ChatRoom"] = relationship(back_populates="messages")
    user: Mapped["User"] = relationship(back_populates="messages")

    def __repr__(self):
        return f"<Message: id={self.id}, user={self.user_id}, content={self.content[:20]}...)>"
