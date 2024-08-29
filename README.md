# Google Chrome Extension + Telegram Bot for Media Uploads

This project combines a Google Chrome extension and a Telegram bot to automate the process of sending media directly from the browser to various Telegram channels. The extension allows users to select media files in the browser and send them to a chosen Telegram channel via the bot.

## Features

- **Google Chrome Extension:**
  - Written in JavaScript.
  - Allows users to select and upload media files directly from the browser.
  - Simple and user-friendly interface integrated into the Chrome browser.

- **Telegram Bot:**
  - Developed in Python.
  - Automatically sends media files received from the Chrome extension to a specified Telegram channel.
  - Supports multiple channels for flexible media distribution.

- **Libraries Used:**
  - **Pyrogram:** For interacting with the Telegram API.
  - **Flask:** Used to create a lightweight web server to handle requests from the Chrome extension.
  - **Requests:** For handling HTTP requests between the extension and the bot.

## Usage

1. **Uploading Media:**
   - Open the Chrome extension from the browser toolbar.
   - Select or drag and drop media files you wish to upload.
   - Choose the target Telegram channel.
   - Click "Upload" to send the media to the selected channel.

2. **Bot Operation:**
   - The bot listens for media upload requests from the Chrome extension.
   - Upon receiving a media file, the bot automatically forwards it to the specified Telegram channel.

## Technologies Used

- **Google Chrome Extension:**
  - JavaScript for frontend functionality.
  - HTML/CSS for user interface design.

- **Telegram Bot:**
  - **Python**: Core programming language for the bot.
  - **Pyrogram**: For interacting with the Telegram API.
  - **Flask**: To handle incoming requests from the Chrome extension.
  - **Requests**: For making HTTP requests between components.
