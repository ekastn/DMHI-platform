from typing import Optional

from app.models.user import User


def authenticate_user(username: str, password: str) -> Optional[User]:
    user = User.query.filter_by(username=username).first()
    if user and user.check_password(password):
        return user
    return None