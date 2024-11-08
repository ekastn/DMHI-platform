from flask import Flask, render_template

from app.assetsBlueprint import assets_blueprint


def create_app():
    app = Flask(
        __name__,
        static_url_path="/",
        static_folder="public",
        template_folder="templates",
    )

    app.register_blueprint(assets_blueprint)

    @app.get("/")
    def index():
        return render_template("index.html")

    return app
