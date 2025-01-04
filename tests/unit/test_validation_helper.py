from app.helper.validation import validate_password, validate_username


def test_validate_username():
    result = validate_username("validuser")
    assert result["is_valid"] is True

    result = validate_username("usr")
    assert result["is_valid"] is False
    assert "at least 4 characters" in result["message"]

    result = validate_username("user@name")
    assert result["is_valid"] is False
    assert "only letters, numbers, and underscores" in result["message"]


def test_validate_password():
    result = validate_password("ValidPass1")
    assert result["is_valid"] is True

    result = validate_password("Short1")
    assert result["is_valid"] is False
    assert "at least 8 characters" in result["message"]

    result = validate_password("lowercase1")
    assert result["is_valid"] is False
    assert "uppercase letter" in result["message"]

    result = validate_password("UPPERCASE1")
    assert result["is_valid"] is False
    assert "lowercase letter" in result["message"]

    result = validate_password("NoNumbers")
    assert result["is_valid"] is False
    assert "digit" in result["message"]
