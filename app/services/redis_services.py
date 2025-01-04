from flask import current_app

from app import redis


def set_user_online(user_id, session_id):
    try:
        redis.set(f"user_online:{user_id}", session_id)
    except Exception as e:
        current_app.logger.error(f"Error setting user online status for user {user_id}: {e}")


def get_user_online(user_id):
    try:
        return redis.get(f"user_online:{user_id}")
    except Exception as e:
        current_app.logger.error(f"Error getting user online status for user {user_id}: {e}")
        return None


def delete_user_online(user_id):
    try:
        redis.delete(f"user_online:{user_id}")
    except Exception as e:
        current_app.logger.error(f"Error deleting user online status for user {user_id}: {e}")


def add_user_to_chat_room(chat_room_id, user_id):
    try:
        redis.sadd(f"chat_room:{chat_room_id}", user_id)
    except Exception as e:
        current_app.logger.error(f"Error adding user {user_id} to chat room {chat_room_id}: {e}")


def remove_user_from_chat_room(chat_room_id, user_id):
    try:
        redis.srem(f"chat_room:{chat_room_id}", user_id)
    except Exception as e:
        current_app.logger.error(f"Error removing user {user_id} from chat room {chat_room_id}: {e}")


def is_user_in_chat_room(chat_room_id, user_id):
    try:
        return redis.sismember(f"chat_room:{chat_room_id}", user_id)
    except Exception as e:
        current_app.logger.error(f"Error checking if user {user_id} is in chat room {chat_room_id}: {e}")
