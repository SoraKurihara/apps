import base64
import io

from PIL import Image
from werkzeug.utils import secure_filename

from flask import Blueprint, render_template, request, send_file

# Blueprintの定義
pixel_art = Blueprint('_01_app', __name__, url_prefix='/_01')

@pixel_art.route('/', methods=['GET'])
def show_template():
    return render_template('_01/index.html')

@pixel_art.route('/result', methods=['POST'])
def show_result():
    file = request.files['file']
    if file:
        filename = secure_filename(file.filename)
        image = Image.open(io.BytesIO(file.read()))

        # 画像を縮小（64x64ピクセル）
        small = image.resize((16, 16), resample=Image.BILINEAR)
        
        # 画像を元のサイズに拡大
        result = small.resize(image.size, Image.NEAREST)

        # 画像をバイトIOオブジェクトとして保存
        byte_io = io.BytesIO()
        result.save(byte_io, format='PNG')
        byte_io.seek(0)
        
        image_data = base64.b64encode(byte_io.read()).decode('utf-8')
        return render_template('_01/result.html', image_data=f"data:image/png;base64,{image_data}")

    return "ファイルがありません"
