import base64
from io import BytesIO

import matplotlib
import matplotlib.pyplot as plt
import numpy as np
from flask import Blueprint, jsonify, render_template, request, send_file

matplotlib.use("Agg")

# Blueprintの定義
cellular_automaton = Blueprint("_03_app", __name__, url_prefix="/_03")


def Calculation(Rule_list, Cells):
    # Cells is only numpy array
    New_Cells = Rule_list[
        7 - (np.roll(Cells, 1) * 2**2 + Cells * 2**1 + np.roll(Cells, -1) * 2**0)
    ]
    return New_Cells


@cellular_automaton.route("/", methods=["GET"])
def show_template():
    return render_template("_03/index.html")


@cellular_automaton.route("/generate", methods=["POST"])
def generate():
    rule = request.form.get("rule")
    init = request.form.get("init")
    step = request.form.get("step")

    print(rule)
    Rule = int(rule)
    Init = np.array([int(ini) for ini in init])
    Step = int(step)

    Rule_list = np.array([int(i) for i in list(bin(Rule)[2:].zfill(8))])

    Cells = np.empty((Step, len(Init)), dtype=np.int8)
    Cells[0] = Init
    for s in range(1, Step):
        Cells[s] = Calculation(Rule_list, Cells[s - 1])

    fig, ax = plt.subplots()
    ax.set_title(f"Rule{Rule}_Spatio")
    ax.imshow(Cells, cmap="binary", vmin=0, vmax=1, aspect="equal")
    # plt.axis("off")
    ax.tick_params(
        labelbottom=False,
        labelleft=False,
        labelright=False,
        labeltop=False,
        bottom=False,
        left=False,
        right=False,
        top=False,
    )
    ax.set_xlabel("Space")
    ax.set_ylabel("Time")

    # plotした後
    img = BytesIO()
    plt.savefig(img, format="png")
    plt.close(fig)
    img.seek(0)

    img_base64 = base64.b64encode(img.read()).decode("utf-8")
    return jsonify({"image_data": img_base64})
