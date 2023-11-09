from flask import Blueprint, render_template, request, send_file

# Blueprintの定義
cellular_automaton = Blueprint("_03_app", __name__, url_prefix="/_03")


# ここにセルオートマトンの計算ロジックを書きます
def calculate_cellular_automaton(rule_number, steps):
    # セルオートマトンの計算を行い、結果の時空図をリストや文字列で返す関数
    pass


@cellular_automaton.route("/", methods=["GET"])
def show_template():
    return render_template("_03/index.html")


@cellular_automaton.route("/generate", methods=["POST"])
def generate():
    rule_number = int(request.form["rule"])
    initial_condition_type = request.form.get("initialCondition")
    length = int(request.form["length"]) if "length" in request.form else None
    seed = int(request.form["seed"]) if "seed" in request.form else None
    steps = 10  # ここではステップ数を固定で10に設定
    # 初期条件に基づいて初期状態を生成するロジックを追加
    result = calculate_cellular_automaton(
        rule_number, steps, initial_condition_type, length, seed
    )
    # ここで計算結果を適切にHTMLに埋め込む処理が必要
    return result
