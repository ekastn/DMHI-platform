import os

from authlib.integrations.flask_client import OAuth
from flask import Flask
from flask.cli import AppGroup
from flask_login import LoginManager
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from redis import Redis

db = SQLAlchemy()
migrate = Migrate()
login_manager = LoginManager()
oauth = OAuth()
redis = Redis()


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
    register_cli_commands(app)

    from app.models.chat import ChatParticipant, ChatRoom
    from app.models.message import Message
    from app.models.notification import Notification
    from app.models.pin import Pin
    from app.models.story import Story
    from app.models.user import User

    return app


def initialize_extensions(app):
    db.init_app(app)

    from app.helper.trigger import create_triggers_and_functions
    with app.app_context():
        create_triggers_and_functions()

    oauth.init_app(app)

    login_manager.init_app(app)

    basedir = os.path.abspath(os.path.dirname(__file__))
    migrate.init_app(app, db, directory=basedir + "/migrations")

    from app.services.socket_events import socketio

    socketio.init_app(app)


def register_blueprint(app):
    from app.helper.assets_blueprint import assets_blueprint
    app.register_blueprint(assets_blueprint)

    from app.routes.auth import auth
    app.register_blueprint(auth)

    from app.routes.main import main
    app.register_blueprint(main)

    from app.routes.story import story
    app.register_blueprint(story)

    from app.routes.chat import chat
    app.register_blueprint(chat)


def register_cli_commands(app):
    from app.helper.seed import seed

    seed_cli = AppGroup("seed")

    @seed_cli.command("all")
    def cli_seed_users():
        seed()

    app.cli.add_command(seed_cli)
