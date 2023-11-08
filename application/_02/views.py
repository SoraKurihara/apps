import base64
from io import BytesIO

from flask import Blueprint, render_template, request
from PIL import Image

blur = Blueprint("_02_app", __name__, url_prefix="/_02")


@blur.route("/", methods=["GET"])
def show_template():
    return render_template("_02/index.html")


@blur.route("/result", methods=["POST"])
def show_result():
    # 画像と座標をフォームから取得
    file = request.files["file"]
    coordinates = request.form.get("coordinates")

    # 座標の文字列を浮動小数点数のタプルに変換し、適切に整数に丸める
    coords = tuple(map(int, map(float, coordinates.split(","))))

    # モザイク処理を行う関数
    def apply_mosaic(img, coords, mosaic_size):
        startX, startY, endX, endY = coords
        cropped_img = img.crop((startX, startY, endX, endY))
        small = cropped_img.resize((mosaic_size, mosaic_size), resample=Image.NEAREST)
        result = small.resize(cropped_img.size, Image.NEAREST)
        img.paste(result, (startX, startY))
        return img

    # 画像を開く
    img = Image.open(file.stream)

    # モザイクのサイズ（例：10ピクセル）
    mosaic_size = 10

    # モザイク処理を適用
    img = apply_mosaic(img, coords, mosaic_size)

    # 結果をBase64エンコードしてブラウザに返す
    img_io = BytesIO()
    img.save(img_io, "PNG", quality=70)
    img_io.seek(0)
    image_data = base64.b64encode(img_io.getvalue()).decode("utf-8")

    # 結果ページにレンダリング
    return render_template(
        "_02/result.html", image_data="data:image/png;base64," + image_data
    )
