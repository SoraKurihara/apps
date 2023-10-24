from flask import Flask, render_template

# ==================================================
# インスタンス生成
# ==================================================
app = Flask(__name__)

# ==================================================
# Blueprintの登録
# ==================================================
from application._01.views import pixel_art

app.register_blueprint(pixel_art)

from application._02.views import blur

app.register_blueprint(blur)

# ==================================================
# ルーティング
# ==================================================
@app.route('/')
def show_home():
    return render_template('home.html')

# ==================================================
# 実行
# ==================================================
if __name__ == '__main__':
    app.run(debug=True)
