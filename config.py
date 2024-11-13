import os

from dotenv import load_dotenv


load_dotenv()

BASEDIR = os.path.abspath(os.path.dirname(__file__))
TEST_DB = f"sqlite:///{os.path.join(BASEDIR, 'instance', 'test.db')}"


class Config(object):
    DEBUG = False
    TESTING = False
    CSRF_ENABLED = True
    SECRET_KEY = os.getenv("SECRET_KEY", "bad-key")
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", TEST_DB)
    SQLALCHEMY_TRACK_MODIFICATIONS = False


class ProductionConfig(Config):
    DEBUG = False


class DevelopmentConfig(Config):
    DEVELOPMENT = True
    DEBUG = True


class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = TEST_DB
