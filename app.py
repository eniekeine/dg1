# 파일이름 : app.py 
# 설명 : 플라스크 백엔드 서버의 라우팅을 정의하는 파일입니다.
from flask import Flask, render_template, send_from_directory, jsonify, request
import openai

app = Flask(__name__)
# http://127.0.0.1/
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

@app.route('/text-query', methods=['POST'])
def text_query():
    assert(request.is_json)
    if request.is_json:
        # i.e. data = { "queryText" : "1+1은 2다"};
        data = request.json
    # OpenAI API 서버에 요청을 보냅니다.
    # response : Dictionary 사전 객체
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
                # TODO : 앞에서 대화한 내용 추가
                # TODO : 프롬프트
                {"role": "system", "content": "You are a helpful assistant."},
                # 사용자의 요청
                {"role": "user", "content": data["queryText"]},
            ]
    )
    # OpenAI API 서버가 보내온 응답을 그냥 그대로 프론트엔드 서버에 전달해주겠습니다.
    return jsonify(response)

@app.route('/static/<path:path>')
def serve_static(path):
    return send_from_directory('static', path)
