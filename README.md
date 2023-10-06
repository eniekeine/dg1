# dg1

## 협업자 가이드라인(Contributing Guidelines)

### 로컬 환경에서 작업하는 경우

처음 로컬 머신에서 개발 환경을 조성할 때 저장소를 다운받습니다.

```cmd
:: 저장소 다운로드
:: git clone [저장소 URL] [폴더 이름]
git clone "https://github.com/eniekeine/dg1" dg1
```

그 후 `scripts/prepare_dev_env.bat`을 실행하여 가상환경을 준비합니다.

```cmd
:: 저장소 경로로 이동합니다.
cd dg1

:: 가상 환경을 준비합니다.
:: ※ Anaconda가 미리 설치되어 있어야 합니다.
scripts\prepare_dev_env.bat
```

서버를 실행할 때는 `scripts/run_debug.bat`을 실행합니다.

```cmd
:: 저장소 경로로 이동합니다.
cd dg1

:: run_debug.bat 실행.
scripts\run_debug.bat

:: 실행 후 브라우저에서 localhost:80 접속
```

## TODO

- 프로젝트 이름
- 설명(Description)
- 목차(Table of Contents)
- 설치(Installation)
- 용례(Usage)
- 설정(Configuration)
- 라이센스(License)
- 참조(Credits/Acknowledgments)
