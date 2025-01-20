
from datetime import datetime

from app.enums import FriendRequestStatusType
from app.models.friend import Friend, FriendRequest


def test_create_friend():
    friend = Friend(usera_id=1, userb_id=2, created_at=datetime.now())
    assert friend.usera_id == 1
    assert friend.userb_id == 2
    assert friend.created_at is not None
    assert friend.__repr__() == f"<Friend: {friend.usera_id} - {friend.userb_id}>"

def test_create_friend_request():
    friend_request = FriendRequest(sender_id=1, receiver_id=2, status=FriendRequestStatusType.PENDING, sent_at=datetime.now())
    assert friend_request.sender_id == 1
    assert friend_request.receiver_id == 2
    assert friend_request.status == FriendRequestStatusType.PENDING
    assert friend_request.sent_at is not None
    assert friend_request.__repr__() == f"<FriendRequest: {friend_request.sender_id} - {friend_request.receiver_id}>"
