from pyrogram import Client, filters
import p_data

app_user = Client("tg_saver", api_id=p_data.api_id, api_hash=p_data.api_hash, bot_token=p_data.bot_token)


@app_user.on_message(filters.text & filters.private)
def echo(client, message):
    if message.text == '/get_id':
        message.reply_text(f"Your chat ID is: {message.chat.id}")


@app_user.on_message(filters.channel & filters.text)
def echo_channel(client, message):
    if message.text == '/get_id':
        message.reply_text(f"Chat ID of this channel is:{message.chat.id}")
    if message.text == '/get_rec':
        message.reply_text(f"Prepared record:\n '{message.chat.title}': '{message.chat.id}',")
    if message.text == '/get_meta':
        message.reply_text(f"Chat ID:\n{message.chat.id}\nChat name:\n{message.chat.title}")



if __name__ == '__main__':
    app_user.run()
