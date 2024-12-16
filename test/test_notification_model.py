from datetime import datetime

from app.enums import NotificationType
from app.models.notification import Notification


def test_create_notification():
    notification = Notification(
        user_id=1,
        type=NotificationType.NEW_MESSAGE,
        content="You have a new message",
        is_read=False,
        created_at=datetime.now(),
        reference_id=123
    )
    assert notification.user_id == 1
    assert notification.type == NotificationType.NEW_MESSAGE
    assert notification.content == "You have a new message"
    assert notification.is_read is False
    assert notification.created_at is not None
    assert notification.reference_id == 123
    assert notification.__repr__() == f"<Notification: user={notification.user_id}, content={notification.content[:20]}...>"

def test_notification_relationships():
    notification = Notification(user_id=1, type=NotificationType.NEW_MESSAGE, content="You have a new message")
    assert notification.user_id == 1
    assert notification.type == NotificationType.NEW_MESSAGE
    assert notification.content == "You have a new message"
