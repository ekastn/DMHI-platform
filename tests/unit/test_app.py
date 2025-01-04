def test_app_config(app):
    assert not app.config["DEBUG"]
    assert app.config["TESTING"]
    assert "test" in app.config["SQLALCHEMY_DATABASE_URI"]
