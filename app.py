# 파일이름 : app.py 
from flask import Flask, render_template, send_from_directory, jsonify

app = Flask(__name__)

@app.route('/')
def current_time():
    return render_template('index.html')

# `aaa.bbb.ccc/about` → "페이지 내용"
@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/sayhi')
def sayhi():
    return jsonify({"text":"hi"})

@app.route('/static/<path:path>')
def serve_static(path):
    return send_from_directory('static', path)
