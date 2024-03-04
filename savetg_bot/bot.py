from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import requests
from pyrogram import Client, filters
import p_data

# from PIL import Image
# import io
# import os
# import webp

app = Flask(__name__)
CORS(app)

TELEGRAM_TOKEN = p_data.bot_token

app_user = Client("tg_saver", api_id=p_data.api_id, api_hash=p_data.api_hash)


# @app.route('/send_to_telegram', methods=['POST'])
# @cross_origin(origins=["https://127.0.0.1:5000"])
# def send_to_telegram():
#     image = request.files.get('image')  # Safely get the image from form data
#
#     if not image:
#         return jsonify({"error": "No image file provided."}), 400
#
#     # Determine the MIME type and choose the method accordingly
#     mime_type = image.mimetype.lower()
#     if mime_type == 'image/gif':
#         method = 'sendAnimation'
#         files = {'animation': (image.filename, image, mime_type)}
#     elif mime_type.startswith('image/'):
#         method = 'sendPhoto'
#         files = {'photo': (image.filename, image, mime_type)}
#     else:
#         # If the file is not an image or GIF, return an error
#         return jsonify({"error": "Unsupported file type."}), 400
#
#     data = {'chat_id': CHAT_ID}
#     response = requests.post(f'https://api.telegram.org/bot{TELEGRAM_TOKEN}/{method}', files=files, data=data)
#
#     if response.status_code == 200:
#         return jsonify({"message": f"Media sent successfully using {method}."}), 200
#     else:
#         return jsonify({"error": "Failed to send media.", "telegram_response": response.text}), response.status_code

# save as files
# @app.route('/fetch_and_send_to_telegram', methods=['POST'])
# @cross_origin()  # Allow CORS for this route
# def fetch_and_send_to_telegram():
#     image_url = request.json.get('image_url')
#     chat_id = request.json.get('chat_id')
#     if not image_url:
#         return jsonify({"error": "No image URL provided."}), 400
#
#     # Fetch the image server-side
#     image_response = requests.get(image_url, stream=True)
#     if not image_response.ok:
#         return jsonify({"error": "Failed to fetch image."}), 400
#     content_type = image_response.headers.get('content-type')
#     if content_type in ('image/webp', 'image/gif', 'image/gifv'):
#         files = {'animation': ('image.gif', image_response.content, 'image/gif')}
#         method = 'sendAnimation'
#     else:
#         # For non-WEBP images, send as is
#         files = {'photo': ('image.jpg', image_response.content, content_type)}
#         method = 'sendPhoto'
#
#     # Send the image to Telegram
#     data = {'chat_id': chat_id}
#     response = requests.post(f'https://api.telegram.org/bot{TELEGRAM_TOKEN}/{method}', files=files, data=data)
#
#     if response.status_code == 200:
#         return jsonify({"message": "Image sent successfully to Telegram."}), 200
#     else:
#         return jsonify(
#             {"error": "Failed to send image to Telegram.", "telegram_response": response.text}), response.status_code


@app.route('/fetch_and_send_to_telegram', methods=['POST'])
@cross_origin()  # Allow CORS for this route
def fetch_and_send_to_telegram():
    image_url = request.json.get('image_url')
    chat_id = request.json.get('chat_id')
    if not image_url:
        return jsonify({"error": "No image URL provided."}), 400

    # Fetch the image server-side
    image_format = image_url.split('?')[0].split('.')[-1].lower()

    # save as link
    if image_format in ('webp', 'gif', 'gifv', 'mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv',):
        data = {"chat_id": chat_id, "text": image_url}
        method = 'sendMessage'
        response = requests.post(f'https://api.telegram.org/bot{TELEGRAM_TOKEN}/{method}', data=data)
    else:
        image_response = requests.get(image_url, stream=True)
        if not image_response.ok:
            return jsonify({"error": "Failed to fetch image."}), 400
        content_type = image_response.headers.get('content-type')
        # For non-WEBP images, send as is
        files = {'photo': ('image.jpg', image_response.content, content_type)}
        method = 'sendPhoto'
        data = {'chat_id': chat_id}
        response = requests.post(f'https://api.telegram.org/bot{TELEGRAM_TOKEN}/{method}', files=files, data=data)

    if response.status_code == 200:
        return jsonify({"message": "Image sent successfully to Telegram."}), 200
    else:
        return jsonify(
            {"error": "Failed to send image to Telegram.", "telegram_response": response.text}), response.status_code


if __name__ == '__main__':
    app.run(debug=True, ssl_context=('127.0.0.1+1.pem', '127.0.0.1+1-key.pem'))
