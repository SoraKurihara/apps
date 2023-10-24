import io

from PIL import Image, ImageFilter

from flask import Blueprint, render_template, request, send_file

blur = Blueprint('_02_app', __name__, url_prefix='/_02')

@blur.route('/', methods=['GET', 'POST'])
def show_template():
    if request.method == 'POST':
        file = request.files['file']
        coordinates = request.form['coordinates']
        startX, startY, endX, endY = map(int, coordinates.split(','))
        
        img = Image.open(file)
        
        # Crop the selected area and apply mosaic
        cropped_img = img.crop((startX, startY, endX, endY))
        small = cropped_img.resize((20, 20), resample=Image.BILINEAR)
        result = small.resize(cropped_img.size, Image.NEAREST)
        
        # Paste the mosaic part back
        img.paste(result, (startX, startY, endX, endY))
        
        img_io = io.BytesIO()
        img.save(img_io, 'JPEG')
        img_io.seek(0)
        
        return send_file(img_io, mimetype='image/jpeg')
        
    return render_template('_02/index.html')
