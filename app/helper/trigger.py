from sqlalchemy import text

from app import db

sync_last_message_function = """
CREATE OR REPLACE FUNCTION sync_last_message()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE chat_rooms
    SET last_message = NEW.content
    WHERE chat_room_id = NEW.chat_room_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
"""

sync_last_message_trigger = """
CREATE TRIGGER trigger_sync_last_message
AFTER INSERT OR UPDATE OF content ON messages
FOR EACH ROW
EXECUTE FUNCTION sync_last_message();
"""

sync_last_message_timestamp_function = """
CREATE OR REPLACE FUNCTION update_last_content_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE chat_rooms
    SET last_message_timestamp = NEW.sent_at
    WHERE chat_room_id = NEW.chat_room_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
"""

sync_last_message_timestamp_trigger = """
CREATE TRIGGER update_last_content_timestamp_trigger
AFTER INSERT ON messages
FOR EACH ROW
EXECUTE FUNCTION update_last_content_timestamp();
"""


def create_triggers_and_functions():
    """
    Create all database triggers and functions.
    """
    try:
        if not function_exists("sync_last_message"):
            db.session.execute(text(sync_last_message_function))

        if not trigger_exists("trigger_sync_last_message"):
            db.session.execute(text(sync_last_message_trigger))

        if not function_exists("update_last_content_timestamp"):
            db.session.execute(text(sync_last_message_timestamp_function))

        if not trigger_exists("update_last_content_timestamp_trigger"):
            db.session.execute(text(sync_last_message_timestamp_trigger))

        db.session.commit()
        print("Triggers and functions created successfully!")
    except Exception as e:
        db.session.rollback()
        print(f"Error creating triggers and functions: {e}")


def drop_triggers_and_functions():
    """
    Drop all database triggers and functions.
    """
    try:
        db.session.execute(text("DROP TRIGGER IF EXISTS trigger_sync_last_message ON messages"))
        db.session.execute(text("DROP FUNCTION IF EXISTS sync_last_message"))
        db.session.commit()
        print("Triggers and functions dropped successfully!")
    except Exception as e:
        db.session.rollback()
        print(f"Error dropping triggers and functions: {e}")


def function_exists(function_name):
    """
    Checks if a database function exists.
    """
    result = db.session.execute(
        text("""
    SELECT EXISTS (
        SELECT 1
        FROM pg_proc
        WHERE proname = :function_name
    )
    """),
        {"function_name": function_name},
    ).scalar()
    return result


def trigger_exists(trigger_name):
    """
    Checks if a database trigger exists.
    """
    result = db.session.execute(
        text("""
    SELECT EXISTS (
        SELECT 1
        FROM pg_trigger
        WHERE tgname = :trigger_name
    )
    """),
        {"trigger_name": trigger_name},
    ).scalar()
    return result
