from datetime import datetime

from sqlalchemy import TIMESTAMP, ForeignKey, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.types import Enum

from app import db
from app.enums import NotificationType


class Notification(db.Model):
    __tablename__ = "notifications"

    id: Mapped[int] = mapped_column("notification_id", primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.user_id"))
    type: Mapped[NotificationType] = mapped_column(Enum(NotificationType, name="NotificationType"))
    content: Mapped[str] = mapped_column(String(128))
    is_read: Mapped[bool] = mapped_column(default=False)
    created_at: Mapped[datetime] = mapped_column(TIMESTAMP(timezone=True), default=func.now())
    reference_id: Mapped[int] = mapped_column()

    user: Mapped["User"] = relationship(back_populates="notifications")

    def __repr__(self):
        return f"<Notification: user={self.user_id}, content={self.content[:20]}...>"
