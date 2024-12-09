# from flask import Blueprint, request
# from flask_login import current_user, login_required, login_user, logout_user

# from app import db
# from app.helper.http import create_response
# from app.models.user import User
# from app.services.auth import (
#     authenticate_user,
#     google_callback,
#     google_login,
#     user_payload,
# )

# story = Blueprint("story", __name__, url_prefix="/api/story")


# @story.route("/me")
# def user_info():
#     if current_user.is_authenticated:
#         return create_response(success=True, message="User authenticated", data={"user": user_payload(current_user)})
#     return create_response(success=False, message="User not authenticated")


# @story.route("/", methods=["GET"])
# def index():
#     data = request.get_json()
#     username = data.get("username")
#     password = data.get("password")
#     user = authenticate_user(username, password)

#     if user:
#         login_user(user)
#         return create_response(
#             success=True,
#             message="Welcome Back!",
#             data={"user": user_payload(user)},
#         )
#     else:
#         return create_response(success=False, message="Invalid username or password", status_code=404)


# @story.route("/", methods=["POST"])
# def create():
#     if not current_user.is_authenticated:
#         return create_response(success=False, message="User not authenticated", status_code=401)
    
#     data = request.get_json()
#     tittle = data.get("tittle")
#     content = data.get("content")
    
    

#     if User.query.filter(User.username == username).first():
#         return create_response(success=False, message="Username already taken", status_code=409)
#     else:
#         user = User(username=username)
#         user.set_password(password)
#         db.session.add(user)
#         db.session.commit()

#         login_user(user)
#         return create_response(
#             success=True,
#             message=f"Welcome {user.username}!",
#             data={"user": user_payload(user)},
#             status_code=201,
#         )

# def update():
#     pass

# def delete():
#     pass

# def show():
#     pass

