from flask import Blueprint, current_app, request
from flask_login import current_user

from app import db, redis
from app.enums import NotificationType, SocketEventType
from app.helper.http import create_response
from app.models.friend import Friend, FriendRequest
from app.models.notification import Notification
from app.models.story import Story
from app.models.user import User
from app.services.socket_events import socketio

user = Blueprint("user", __name__, url_prefix="/api/user")


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
    }


@user.route("/<int:user_id>", methods=["GET"])
def get_user_info(user_id):
    user = User.query.get(user_id)

    if not user:
        return create_response(success=False, message="User not found", status_code=404)

    return create_response(success=True, data={"user": user_payload(user)})


@user.route("/<int:user_id>/stories", methods=["GET"])
def get_user_stories(user_id):
    user = User.query.get(user_id)

    if not user:
        return create_response(success=False, message="User not found", status_code=404)

    return create_response(success=True, data={"stories": [story_payload(story) for story in user.stories]})


@user.route("/<int:user_id>/friends", methods=["GET"])
def get_user_friends(user_id):
    friends = (
        User.query.filter(
            User.id.in_(
                Friend.query.with_entities(Friend.userb_id)
                .filter(Friend.usera_id == user_id)
                .union(Friend.query.with_entities(Friend.usera_id).filter(Friend.userb_id == user_id))
            )
        )
    ).all()

    user_data = [user_payload(friend) for friend in friends]
    print(user_data)

    return create_response(success=True, data={"friends": user_data})


@user.route("/<int:user_id>/friends/<int:friend_id>", methods=["GET"])
def is_friend(user_id, friend_id):
    friend = User.query.get(friend_id)
    if not friend:
        return create_response(success=False, message="User not found", status_code=404)

    is_friend = (
        Friend.query.filter(
            (Friend.usera_id == user_id and Friend.userb_id == friend_id)
            | (Friend.usera_id == friend_id and Friend.userb_id == user_id)
        )
    ).first()

    friend_request = FriendRequest.query.filter_by(sender_id=user_id, receiver_id=friend_id).first()
    if friend_request:
        return create_response(
            success=True, data={"isFriend": is_friend is not None, "friendRequest": friend_request.status.value}
        )

    return create_response(success=True, data={"isFriend": is_friend is not None, "friendRequest": None})


@user.route("/<int:user_id>/friends/request", methods=["GET"])
def get_friend_requests(user_id):
    friend_requests = FriendRequest.query.filter_by(receiver_id=user_id).all()
    friend_requests_data = [user_payload(friend_request.sender) for friend_request in friend_requests]
    return create_response(success=True, data={"friendRequests": friend_requests_data})


@user.route("/<int:user_id>/friends/request", methods=["POST"])
def send_friend_request(user_id):
    if not current_user.is_authenticated:
        return create_response(success=False, message="User not authenticated", status_code=401)

    if current_user.id == user_id:
        return create_response(success=False, message="Cannot send friend request to self", status_code=400)

    friend = User.query.get(user_id)
    if not friend:
        return create_response(success=False, message="User not found", status_code=404)

    is_friend = (
        Friend.query.filter(
            (Friend.usera_id == current_user.id and Friend.userb_id == user_id)
            or (Friend.usera_id == user_id and Friend.userb_id == current_user.id)
        )
    ).first()
    if is_friend:
        return create_response(success=False, message="Already friend", status_code=400)

    friend_request = FriendRequest.query.filter_by(sender_id=current_user.id, receiver_id=user_id).first()
    if friend_request:
        return create_response(success=False, message="Friend request already sent", status_code=400)

    friend_request = FriendRequest.query.filter_by(sender_id=user_id, receiver_id=current_user.id).first()
    if friend_request:
        usera_id, userb_id = sorted([friend_request.sender_id, friend_request.receiver_id])
        friend = Friend(usera_id=usera_id, userb_id=userb_id)
        try:
            db.session.add(friend)
            db.session.delete(friend_request)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            current_app.logger.error(e)
            return create_response(success=False, message="Failed to accept friend request", status_code=500)
        return create_response(success=True, message="Friend request accepted")

    friend_request = FriendRequest(sender_id=current_user.id, receiver_id=user_id)
    try:
        db.session.add(friend_request)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(e)
        return create_response(success=False, message="Failed to send friend request", status_code=500)

    notification = Notification(
        user_id=user_id,
        type=NotificationType.FRIEND_REQUEST,
        content=f"New friend request from {current_user.username}",
        reference_id=friend_request.id,
    )

    try:
        db.session.add(notification)
        db.session.commit()
    except Exception as e:
        current_app.logger.error(e)
        db.session.rollback()

    receiver_online = redis.get(f"user_online:{user_id}")
    if receiver_online:
        notification_data = {
            "id": notification.id,
            "type": notification.type.value,
            "content": notification.content,
            "isRead": notification.is_read,
            "createdAt": notification.created_at.isoformat(),
            "referenceId": notification.reference_id,
        }
        socketio.emit(
            SocketEventType.NEW_NOTIFICATION.value,
            notification_data,
            to=receiver_online.decode("utf-8"),
        )

    return create_response(success=True, message="Friend request sent")


@user.route("/<int:user_id>/friends/request", methods=["PUT"])
def update_friend_request(user_id):
    if not current_user.is_authenticated:
        return create_response(success=False, message="User not authenticated", status_code=401)

    friend_request = FriendRequest.query.filter_by(sender_id=user_id, receiver_id=current_user.id).first()
    if not friend_request:
        return create_response(success=False, message="Friend request not found", status_code=404)

    data = request.get_json()
    accepted = data.get("accept")

    if accepted:
        friend = Friend(usera_id=friend_request.sender_id, userb_id=friend_request.receiver_id)
        try:
            db.session.add(friend)
            db.session.delete(friend_request)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            current_app.logger.error(e)
            return create_response(success=False, message="Failed to accept friend request", status_code=500)
    else:
        db.session.delete(friend_request)
        db.session.commit()

    return create_response(success=True, message="Friend request updated")
