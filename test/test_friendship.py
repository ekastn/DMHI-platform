from app import db
from app.enums import FriendRequestStatusType
from app.models.friend import Friend, FriendRequest
from app.models.user import User


def test_send_friend_request(init_db):
    user1 = User.query.filter_by(username="defTestUser").first()
    user2 = User.query.filter_by(username="secTestUser").first()

    friend_request = FriendRequest(sender_id=user1.id, receiver_id=user2.id)
    db.session.add(friend_request)
    db.session.commit()

    stored_request = FriendRequest.query.filter_by(sender_id=user1.id, receiver_id=user2.id).first()
    assert stored_request is not None
    assert stored_request.status == FriendRequestStatusType.PENDING


def test_accept_friend_request(init_db):
    user1 = User.query.filter_by(username="defTestUser").first()
    user2 = User.query.filter_by(username="secTestUser").first()

    friend_request = FriendRequest(sender_id=user1.id, receiver_id=user2.id)
    db.session.add(friend_request)
    db.session.commit()

    friend_request.status = FriendRequestStatusType.ACCEPTED
    db.session.add(friend_request)

    friendship = Friend(usera_id=user1.id, userb_id=user2.id)
    db.session.add(friendship)
    db.session.commit()

    stored_friendship = Friend.query.filter_by(usera_id=user1.id, userb_id=user2.id).first()
    assert stored_friendship is not None


def test_reject_friend_request(init_db):
    user1 = User.query.filter_by(username="defTestUser").first()
    user2 = User.query.filter_by(username="secTestUser").first()

    friend_request = FriendRequest(sender_id=user1.id, receiver_id=user2.id)
    db.session.add(friend_request)
    db.session.commit()

    friend_request.status = FriendRequestStatusType.REJECTED
    db.session.add(friend_request)
    db.session.commit()

    stored_request = FriendRequest.query.filter_by(sender_id=user1.id, receiver_id=user2.id).first()
    assert stored_request is not None
    assert stored_request.status == FriendRequestStatusType.REJECTED
