from unittest.mock import Mock, patch

from app.services.socket_events import handle_connect, handle_disconnect


@patch("app.services.socket_events.set_user_online")
@patch("app.services.socket_events.join_room")
def test_handle_connect(mock_join_room, mock_set_user_online, init_db):
    mock_request = Mock()
    mock_request.sid = "test_sid"

    mock_current_user = Mock()
    mock_current_user.id = 1
    mock_current_user.username = "testuser"

    with patch("app.services.socket_events.request", mock_request):
        with patch("app.services.socket_events.current_user", mock_current_user):
            handle_connect()

    mock_set_user_online.assert_called_with(1, "test_sid")
    mock_join_room.assert_called_with("test_sid")


@patch("app.services.socket_events.delete_user_online")
@patch("app.services.socket_events.leave_room")
def test_handle_disconnect(mock_leave_room, mock_delete_user_online, init_db):
    mock_request = Mock()
    mock_request.sid = "test_sid"

    mock_current_user = Mock()
    mock_current_user.id = 1
    mock_current_user.username = "testuser"

    with patch("app.services.socket_events.request", mock_request):
        with patch("app.services.socket_events.current_user", mock_current_user):
            handle_disconnect()

    mock_delete_user_online.assert_called_with(1)
    mock_leave_room.assert_called_with("test_sid")
