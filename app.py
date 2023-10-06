import sys
import os
from flask import Flask, render_template

app = Flask(__name__)
basedir = os.path.abspath(__file__)

@app.route('/')
def current_time():
    return render_template('index.html')

