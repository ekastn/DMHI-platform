from flask import Blueprint, render_template

main = Blueprint("main", __name__)


# Redirect untuk client-side routing
@main.route("/", defaults={"path": ""})
@main.route("/<path:path>")
def index(path):
    return render_template("index.html")
