import sys
import os
from flask import Flask, render_template, send_from_directory

app = Flask(__name__)
basedir = os.path.abspath(__file__)

@app.route('/')
def current_time():
    return render_template('index.html')

@app.route('/static/<path:path>')
def serve_static(path):
    return send_from_directory('static', path)
