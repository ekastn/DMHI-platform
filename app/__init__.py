import os

from flask import Flask, render_template
from flask_login import LoginManager
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
migrate = Migrate()
login_manager = LoginManager()


def create_app():
    app = Flask(__name__)

    config_type = os.getenv("APP_SETTING", default="config.DevelopmentConfig")
    app.config.from_object(config_type)

    initialize_extensions(app)
    register_blueprint(app)

    return app


def initialize_extensions(app):
    db.init_app(app)
    login_manager.init_app(app)
    login_manager.login_view = "auth.login"    


    basedir = os.path.abspath(os.path.dirname(__file__))
    migrate.init_app(app, db, directory=basedir + "/migrations")


def register_blueprint(app):
    from app.helper.assets_blueprint import assets_blueprint
    from app.routes.main import main
    from app.routes.auth import auth

    app.register_blueprint(assets_blueprint)
    app.register_blueprint(main)
    app.register_blueprint(auth)
