from typing import Optional
from random import randint

from flask import redirect, url_for
from flask_login import login_user

from app import db, oauth
from app.models.user import User

google = oauth.register(
    name="google",
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={"scope": "openid email profile"},
)


def authenticate_user(username: str, password: str) -> Optional[User]:
    user = User.query.filter_by(username=username).first()
    if user and user.check_password(password):
        return user
    return None


def google_login():
    redirect_uri = url_for("auth.authorize_google", _external=True)
    return google.authorize_redirect(redirect_uri)  # type: ignore


def google_callback():
    token = google.authorize_access_token()  # type: ignore
    userinfo_endpoint = google.server_metadata["userinfo_endpoint"]  # type: ignore
    resp = google.get(userinfo_endpoint, token=token)  # type: ignore
    user_info = resp.json()
    email = user_info["email"]
    unique_id = user_info["sub"]

    user = User.query.filter_by(google_id=unique_id).first()
    if not user:
        # TODO: redirect to user info page to fill the details
        user = User(email=email, google_id=unique_id)
        user.username = "folks" + str(randint(400, 9000))
        db.session.add(user)
        db.session.commit()

    login_user(user)
    return redirect(url_for("main.index"))
