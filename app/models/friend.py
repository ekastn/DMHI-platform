from datetime import datetime

from sqlalchemy import TIMESTAMP, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.types import Enum

from app import db
from app.enums import FriendRequestStatusType


class Friend(db.Model):
    __tablename__ = "friends"

    usera_id: Mapped[int] = mapped_column(ForeignKey("users.user_id"), primary_key=True)
    userb_id: Mapped[int] = mapped_column(ForeignKey("users.user_id"), primary_key=True)
    created_at: Mapped[datetime] = mapped_column(TIMESTAMP(timezone=True), default=func.current_timestamp())

    def __repr__(self):
        return f"<Friend: {self.usera_id} - {self.userb_id}>"


class FriendRequest(db.Model):
    __tablename__ = "friend_requests"

    id: Mapped[int] = mapped_column("friend_request_id", primary_key=True)
    sender_id: Mapped[int] = mapped_column(ForeignKey("users.user_id"))
    receiver_id: Mapped[int] = mapped_column(ForeignKey("users.user_id"))
    status: Mapped[FriendRequestStatusType] = mapped_column(
        Enum(FriendRequestStatusType, name="FriendRequestStatusType"), default=FriendRequestStatusType.PENDING
    )
    sent_at: Mapped[datetime] = mapped_column(TIMESTAMP(timezone=True), default=func.current_timestamp())

    def __repr__(self):
        return f"<FriendRequest: {self.sender_id} - {self.receiver_id}>"
