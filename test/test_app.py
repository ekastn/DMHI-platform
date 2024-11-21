def test_app_config(app):
    assert not app.config["DEBUG"]
    assert app.config["TESTING"]
    assert "test.db" in app.config["SQLALCHEMY_DATABASE_URI"]
