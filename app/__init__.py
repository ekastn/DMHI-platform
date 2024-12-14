import os

from authlib.integrations.flask_client import OAuth
from flask import Flask
from flask_login import LoginManager
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
migrate = Migrate()
login_manager = LoginManager()
oauth = OAuth()


def create_app():
    basedir = os.path.dirname(os.path.abspath(__name__))

    app = Flask(
        __name__,
        static_folder=os.path.join(basedir, "public"),
    )

    config_type = os.getenv("APP_SETTING", default="config.DevelopmentConfig")
    app.config.from_object(config_type)

    initialize_extensions(app)
    register_blueprint(app)

    from app.models.user import User
    from app.models.story import Story
    from app.models.pin import Pin

    return app


def initialize_extensions(app):
    db.init_app(app)
    oauth.init_app(app)

    login_manager.init_app(app)

    basedir = os.path.abspath(os.path.dirname(__file__))
    migrate.init_app(app, db, directory=basedir + "/migrations")


def register_blueprint(app):
    from app.helper.assets_blueprint import assets_blueprint
    from app.routes.auth import auth
    from app.routes.main import main

    app.register_blueprint(assets_blueprint)
    app.register_blueprint(main)
    app.register_blueprint(auth)
