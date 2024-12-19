import re

def validate_username(username):
    if len(username) < 4:
        return {"is_valid": False, "message": "Username must be at least 4 characters long."}
    if not re.match(r'^[a-zA-Z0-9_]+$', username):
        return {"is_valid": False, "message": "Username must contain only letters, numbers, and underscores."}
    return {"is_valid": True, "message": "Username is valid."}

def validate_password(password):
    if len(password) < 8:
        return {"is_valid": False, "message": "Password must be at least 8 characters long."}
    if not re.search(r'[A-Z]', password):
        return {"is_valid": False, "message": "Password must contain at least one uppercase letter."}
    if not re.search(r'[a-z]', password):
        return {"is_valid": False, "message": "Password must contain at least one lowercase letter."}
    if not re.search(r'[0-9]', password):
        return {"is_valid": False, "message": "Password must contain at least one digit."}
    return {"is_valid": True, "message": "Password is valid."}
