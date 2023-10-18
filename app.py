# 파일이름 : app.py 
# 설명 : 플라스크 백엔드 서버의 라우팅을 정의하는 파일입니다.
from flask import Flask, render_template, send_from_directory, jsonify, request, Response, stream_with_context
import openai
import time

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


# This function simulates the streaming behavior of OpenAI's API
def simulated_openai_streamed_chat():
    chats = [
        "Hello, how can I help you?",
        "I can provide information on various topics.",
        "Do you have any questions?"
    ]
    for chat in chats:
        time.sleep(2)  # Simulating a delay for each chat chunk
        yield chat

@app.route('/streamed-chat', methods=['POST'])
def streamed_chat():
    def generate():
        for chat in simulated_openai_streamed_chat():
            yield chat + '\n'  # Sending each chat as a separate chunk

    return Response(stream_with_context(generate()), content_type='text/plain')

@app.route('/text-stream-query', methods=['POST'])
def text_stream_query():
    def generate():
        # i.e. data = { "queryText" : "1+1은 2다"};
        data = request.json
        print(data)
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
                ],
            stream=True
        )
        # create variables to collect the stream of chunks
        collected_chunks = []
        # iterate through the stream of events
        for chunk in response:
            print(collected_chunks)
            collected_chunks.append(chunk)  # save the event response
            print(chunk)
            chunk_message = chunk['choices'][0]['delta']  # extract the message
            content = chunk_message.content
            if len(content) == 0:
                continue
            yield content  # Sending each chat as a separate chunk
            # print(f"sent {content}")  # print the delay and text
    
    return Response(stream_with_context(generate()), content_type='text')
