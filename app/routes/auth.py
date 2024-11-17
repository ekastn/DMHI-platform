from flask import Blueprint, flash, redirect, render_template, request, url_for
from flask_login import login_required, login_user, logout_user, current_user

from app import db
from app.models.user import User
from app.services.auth import authenticate_user, google_callback, google_login

auth = Blueprint("auth", __name__)


@auth.route("/login", methods=["GET", "POST"])
def login():
    if current_user.is_authenticated:
        flash("Already logged in")
        return redirect(url_for("main.index"))

    if request.method == "POST":
        username = request.form["username"]
        password = request.form["password"]
        user = authenticate_user(username, password)
        if user:
            login_user(user)
            flash("Welcome Back!")
            return redirect(url_for("main.index"))
        else:
            flash("Invalid username or password")

    return render_template("auth/login.html")

@auth.route("/login/google")
def login_google():
    return google_login()


@auth.route("/register", methods=["GET", "POST"])
def register():
    if current_user.is_authenticated:
        flash("Already logged in")
        return redirect(url_for("main.index"))

    if request.method == "POST":
        username = request.form["username"]
        email = request.form["email"]
        password = request.form["password"]
        if User.query.filter(
            (User.username == username) | (User.email == email)
        ).first():
            flash("Username or email already taken")
        else:
            user = User(username=username, email=email, password=password)
            db.session.add(user)
            db.session.commit()

            login_user(user)
            flash(f"Welcome {user.username}!")
            return redirect(url_for("main.index"))

    return render_template("auth/register.html")


@auth.route("/logout")
@login_required
def logout():
    logout_user()
    flash("Goodbye!")
    return redirect(url_for("main.index"))

@auth.route("/authorize/google")
def authorize_google():
    return google_callback()
