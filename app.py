import sys
import os
from flask import Flask, render_template

PORT = os.environ["DG1_PORT_NUMBER"]
app = Flask(__name__)
basedir = os.path.abspath(__file__)
print(PORT)


@app.route('/')
def current_time():
    return render_template('index.html')


if __name__ == '__main__':
    app.run(port=PORT)
