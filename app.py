import os
import json
import time
from flask import Flask, render_template, send_from_directory, request, send_file
# https://platform.openai.com/docs/api-reference/audio/createTranslation
# https://github.com/openai/openai-python/blob/284c1799070c723c6a553337134148a7ab088dd8/openai/api_resources/audio.py#L18
import openai
from gtts import gTTS

app = Flask(__name__)
basedir = os.path.abspath(__file__)
OPENAI_API_KEY = "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"
openai.api_key = OPENAI_API_KEY

CONVERSATION = [
    {
        "role": "system",
        "content": "You are a helpful assistant."
    },
    {
        "role": "user",
        "content": "I'm going to provide you a speech. Your task is to \
        translate it into an English sentence, and return both in JSON format."
    },
    {
        "role": "assistant",
        "content": "Sure, I can help you with that. Please provide the Korean \
        speech you'd like me to translate into English, and I'll return it in \
        JSON format with both the original Korean and the English translation."
    },
    {
        "role": "user",
        "content": "사과 하나 주세요"
    },
    {
        "role": "assistant",
        "content": json.dumps({
            "old": "사과 하나 주세요",
            "new": "Give me an apple, please"
        })
    },
    {
        "role": "user",
        "content": "아침에 일어나면 세수를 해요"
    },
    {
        "role": "assistant",
        "content": json.dumps({
            "old": "아침에 일어나면 세수를 해요",
            "new": "When you wake up in the morning, you have to wash your \
            face."
        })
    },
    {
        "role": "user",
        "content": "그렇군요"
    },
    {
        "role": "assistant",
        "content": json.dumps({
            "old": "그렇군요",
            "new": "I see."
        })
    },
    {
        "role": "user",
        "content": "사과"
    },
    {
        "role": "assistant",
        "content": json.dumps({
            "old": "사과",
            "new": "Apple."
        })
    },
    {
        "role": "user",
        "content": "a dog"
    },
    {
        "role": "assistant",
        "content": json.dumps({
            "old": "a dog",
            "new": "a dog"
        })
    },
    {
        "role": "user",
        "content": "I had breakfast"
    },
    {
        "role": "assistant",
        "content": json.dumps({
            "old": "I had breakfast",
            "new": "I had breakfast"
        })
    }
]


@app.route('/')
def current_time():
    return render_template('index.html')


def guess_extension_form_content_type(content_type):
    dict = {
        'audio/mpeg': '.mp3',
        'audio/wav': '.wav',
        'audio/aac': '.aac',
        'audio/ogg': '.ogg',
        'audio/webm': '.webm',
        'audio/mp4': '.mp4',
    }
    for k, v, in dict.items():
        if content_type.startswith(k):
            return v
    return None


@app.route('/upload', methods=['POST'])
def upload():
    file_blob = request.files['file']
    print(" * content type:", file_blob.content_type)
    ext = guess_extension_form_content_type(file_blob.content_type)
    print(" * ext:", ext)
    timestamp_ms = str(round(int(time.time() * 1000)))
    filepath = os.path.join("data", "input", "audio-" + timestamp_ms + ext)
    print(" * filename:", filepath)
    file_blob.save(filepath)

    audio_file = open(filepath, "rb")
    res = openai.Audio.transcribe(
        "whisper-1",
        audio_file,
        language=""
    )
    res2 = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            # 이런 대화를 이제껏 나눴다고 가정했을 때,
            *CONVERSATION,
            # 이번 입력에 대한 답은?
            {"role": "user", "content": res.text}
        ])

    print(res.text)
    for k, v in res2.items():
        print("!", k, v)
    sj = res2["choices"][0]["message"]["content"]
    oldnew = eval(sj)
    print(oldnew["new"])

    outfilepath = os.path.join(
        "data",
        "output",
        "output-" + timestamp_ms + ".mp3"
    )
    tts = gTTS(text=oldnew["new"], lang='en')
    tts.save(outfilepath)

    return send_file(outfilepath, mimetype='audio/mpeg')


@app.route('/static/<path:path>')
def serve_static(path):
    return send_from_directory('static', path)
