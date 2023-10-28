# 이 파일은 shell 환경에서 플라스크 앱을 디버그 모드(development server)로 실행합니다.
# 구름IDE의 `debug` 명령은 이 스크립트를 실행합니다.

# 백업 OpenAI API 키를 먼저 불러옵니다.
source ~/.zshrc

# 앱의 이름이 app일 경우 이 줄은 사실 필요 없습니다.
# 추후 앱의 이름이 바뀔 경우 이 환경변수의 값 또한 바뀌어야 합니다.
export FLASK_APP=app
# 공용 컨테이너라면 이 코드를 바꿀 필요가 없습니다.
# 개인 컨테이너를 사용하시는 경우 다음 줄에서 본인의 API KEY를 설정해주세요
#export OPENAI_API_KEY=!!여기를 API KEY로 바꿔주세요!! # sk-....l6

#제대로 로딩되었는지 확인하여 출력합니다
echo $OPENAI_API_KEY

# gunicorn 'app:app' -w 4 --bind 0.0.0.0:8000
nohup gunicorn app:app -w 4 --bind 0.0.0.0:8000 &