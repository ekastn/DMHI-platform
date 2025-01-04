from typing import Any, Dict, Optional, Tuple

from flask import Response, jsonify

from app.models.notification import Notification
from app.models.pin import Pin
from app.models.story import Story
from app.models.user import User


def create_response(
    success: bool = False,
    message: str = "",
    data: Optional[Dict[str, Any]] = None,
    status_code: int = 200,
) -> Tuple[Response, int]:
    response: Dict[str, Any] = {
        "success": success,
        "message": message,
        "data": data,
    }
    return jsonify(response), status_code


def story_payload(story: Story) -> Dict[str, Any]:
    return {
        "id": story.id,
        "title": story.title,
        "content": story.content,
        "createdAt": story.created_at,
        "updatedAt": story.updated_at,
        "user": user_payload(story.user),
        "pin": pin_payload(story.pin),
    }


def pin_payload(pin: Pin) -> Dict[str, Any]:
    return {
        "latitude": pin.latitude,
        "longitude": pin.longitude,
        "storyId": pin.story_id,
    }


def user_payload(user: User) -> Dict[str, str | int | None]:
    return {
        "id": user.id,
        "username": user.username,
        "profileImage": user.profile_image,
    }


def notification_payload(notification: Notification) -> Dict[str, Any]:
    return {
        "id": notification.id,
        "type": notification.type.value,
        "content": notification.content,
        "isRead": notification.is_read,
        "createdAt": notification.created_at.isoformat(),
        "referenceId": notification.reference_id,
    }
