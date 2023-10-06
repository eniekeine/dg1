:: dg1이란 이름의 콘다 환경을 만들겠습니다.
call conda create -n "dg1" python=3.7

:: 환경 목록을 출력하여 dg1이 잘 만들어 졌는지 확인하겠습니다.
call conda env list

:: dg1 환경을 활성화 하겠습니다.
call conda activate dg1

:: requirements.txt에 명시된 모듈을 일괄 설치하겠습니다.
call pip install -r requirements.txt
