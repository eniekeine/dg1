# 파일이름 : app.py 
# 설명 : 플라스크 백엔드 서버의 라우팅을 정의하는 파일입니다.
from datetime import datetime
import os
from flask import Flask, render_template, send_from_directory, jsonify, request, Response, stream_with_context, make_response
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

def is_openapi_server_okay():
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                    # TODO : 앞에서 대화한 내용 추가
                    # TODO : 프롬프트
                    {"role": "system", "content": "You are a helpful assistant."},
                    # 사용자의 요청
                    {"role": "user", "content": "1이라고 말해봐"},
                ]
        )
        return (True, response)
    except openai.error.APIError as e:
        return (False, e)
    except openai.error.APIConnectionError as e:
        return (False, e)
    except openai.error.RateLimitError as e:
        return (False, e)

@app.route('/text-stream-query', methods=['POST'])
def text_stream_query():
    print(" ==================== text_stream_query ====================")
    data = request.json
    print(data)
    status, content = is_openapi_server_okay()
    if status == False:
        print("OpenAI API 통신 에러 : ", content.error)
        return make_response("OpenAI 서버가 다운되었습니다.", 500)
    def generate():
        # i.e. data = { "queryText" : "1+1은 2다"};
        # OpenAI API 서버에 요청을 보냅니다.
        # response : Dictionary 사전 객체
        try:
            query_text = data["queryText"]
            history = data["history"]
            now = datetime.now() 
            Y= now.year
            M= now.month
            D= now.day
            h= now.hour
            m= now.minute
            s= now.second
            weekdays = ['월', '화', '수', '목', '금', '토', '일']
            tellTime = f"오늘 시간은 {Y}년 {M}월 {D}일 {h}시 {m}분 {s}초 {weekdays[now.weekday()]}요일 입니다. 앞으로 현재 시간에 대해 물어보면 이 정보를 이용해주세요."
            conversation = [
                # TODO : 앞에서 대화한 내용 추가
                # TODO : 프롬프트
                {"role": "system", "content": "You are an helpful assistant."}, # 유능한 비서로서 답할 것
                {"role": "system", "content": "You mainly speak Korean."}, # 한국어로 답할 것
                {"role": "user", "content": "From now on, answer my messages with no more than three sentences."}, # 세 문장 이상으로 답하지 말것
                {"role": "assistant", "content": "알겠습니다. 잊지 않을게요."},
                {"role": "user", "content": tellTime}, # 대답할 때 현재 시간에 대한 정보를 숙지하고 있을 것
                {"role": "assistant", "content": "알겠습니다. 잊지 않을게요."},
                {"role": "user", "content": "너는 누구야?"}, 
                {"role": "assistant", "content": "저는 음성 챗봇 지피지기입니다."},
                {"role": "user", "content": "왜 네 이름이 지피지기야?"},
                {"role": "assistant", "content": "제 이름 지피지기는 챗 GPT와 친구를 뜻하는 말 지기를 합친 것입니다."},
                *history,
                {"role": "user", "content": query_text}
            ]
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=conversation,
                stream=True
            )
            # create variables to collect the stream of chunks
            collected_chunks = []
            # iterate through the stream of events
            for chunk in response:
                collected_chunks.append(chunk)  # save the event response
                chunk_message = chunk['choices'][0]['delta']  # extract the message
                content = chunk_message.content
                if len(content) == 0:
                    time.sleep(1)
                    continue
                yield content  # Sending each chat as a separate chunk
                # print(f"sent {content}")
        except openai.error.APIError as e:
            print(f"OpenAI API returned an API Error: {e}")
            yield "!! 답변을 생성하던 중 에러가 발생했습니다."
        except openai.error.APIConnectionError as e:
            print(f"Failed to connect to OpenAI API: {e}")
            yield "!! 답변을 생성하던 중 에러가 발생했습니다."
        except openai.error.RateLimitError as e:
            print(f"OpenAI API request exceeded rate limit: {e}")
            yield "!! 답변을 생성하던 중 에러가 발생했습니다."

    return Response(stream_with_context(generate()))

@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'), 'favicon.ico', mimetype='image/vnd.microsoft.icon')
