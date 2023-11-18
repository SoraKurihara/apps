import numpy as np
from flask import Blueprint, jsonify, render_template, request, send_file

# Blueprintの定義
tetris = Blueprint("_04_app", __name__, url_prefix="/_04")


@tetris.route("/", methods=["GET"])
def show_template():
    return render_template("_04/index.html")
