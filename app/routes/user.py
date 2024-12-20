from flask import Blueprint
from flask_login import current_user

from app.helper.http import create_response
from app.models.story import Story
from app.models.user import User

user = Blueprint("user", __name__, url_prefix="/api")


def story_payload(story: Story):
    return {
        "id": story.id,
        "title": story.title,
        "content": story.content,
        "created_at": story.created_at,
        "updated_at": story.updated_at,
        "user": story.user.username,
        "pin": {
            "latitude": story.pin.latitude,
            "longitude": story.pin.longitude,
        },
    }


def user_payload(user):
    return {
        "id": user.id,
        "username": user.username,
        "stories": [story_payload(story) for story in user.stories],
    }


@user.route("/user/<int:user_id>", methods=["GET"])
def get_profile(user_id):
    user = User.query.get(user_id)

    if not user:
        return create_response(success=False, message="User not found", status_code=404)

    return create_response(success=True, data={"user": user_payload(user)})


# ------------------------------------------
