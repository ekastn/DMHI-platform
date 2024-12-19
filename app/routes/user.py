from flask import Blueprint
from flask_login import current_user
from app.models.user import User
from app.helper.http import create_response


user = Blueprint("story", __name__, url_prefix="/api")

def user_payload(user):
    return {
        "id": user.id,
        "username": user.username,
    }

@user.route("/user/<int:user_id>", methods=["GET"])
def get_profile(user_id):
    user = User.query.get(user_id)
    if not user:
        return create_response(success=False, message="User not found", status_code=404)
    return create_response(success=True, data={"user": user_payload(user)})

# ------------------------------------------
