import os

from dotenv import load_dotenv

if os.getenv("FLASK_ENV") != "production":
    load_dotenv()

BASEDIR = os.path.abspath(os.path.dirname(__file__))
TEST_DB = "sqlite:///test.db"


class Config(object):
    DEBUG = False
    TESTING = False
    CSRF_ENABLED = True

    SECRET_KEY = os.getenv("SECRET_KEY", "bad-key")
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", TEST_DB)
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
    GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")


class ProductionConfig(Config):
    DEBUG = False


class DevelopmentConfig(Config):
    DEVELOPMENT = True
    DEBUG = True
    SQLALCHEMY_ECHO = True


class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = os.getenv("TEST_DB_URL", TEST_DB)
