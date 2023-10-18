/*
    파일이름 : index.js
    생성일 : 2023년 10월 16일 이경근이 만들었습니다.
    설명 : index.html 파일의 로직을 지정하는 파일입니다.
*/
import {ChatModel} from './chat-model.js'
import {updateSidebar} from './sidebar.js'
import {currChat, selectChat, addChat, saveChats} from './models.js'

// index.html에 있는 내가 상호작용해야하는 요소를 미리 찾아둡니다.
// 사용자가 음성 입력을 하려고 할 때 누를는 마이크 버튼
const elemBtnMic = document.querySelector('.btn-mic');
// 설정에서 목소리 속도 바꾸는 슬라이더
const elemSldConfigRate = document.querySelector('#sld-config-rate');
// 설정에서 목소리 볼륨 바꾸는 슬라이더
const elemSldConfigVolume = document.querySelector('#sld-config-volume');
// 설정에서 자동재생 토글 버튼
const elemChkConfigAutoplay = document.querySelector('#chk-config-autoplay');
// 남자 목소리 버튼
const elemBtnMalVoice = document.querySelector('#btn-mal-voice');
// 여자 목소리 버튼
const elemBtnFemVoice = document.querySelector('#btn-fem-voice');
// 제출 버튼 (비행기 아이콘)
const elemBtnSubmit = document.querySelector('#btn-submit');
// 텍스트 상자
const elemTxtInput = document.querySelector('#txt-input');
// 채팅 메세지가 표시되는 영역
const elemChatMessages = document.querySelector('.chat-messages');
// 새 채팅 추가 버튼
const elemBtnNewChat = document.querySelector('.btn-new-chat')
// 채팅 히스토리 목록
const elemNavList = document.querySelector('.nav__list');

function loadChats()
{
    let ids = JSON.parse(localStorage.getItem("ids"));
    if (ids == null)
    {
        ids = []
    }
    for(let i = 0; i < ids.length; ++i )
    {
        const loadedChat = new ChatModel();
        loadedChat.loadFromLocalStorage(ids[i])
        addChat(loadedChat)
    }
}

// 현재 보이고 있는 채팅의 메세지를 지우고, 지정된 채팅(chatModel)을 표시
document.addEventListener("chatsUpdated", event => {
    elemChatMessages.textContent='';
    // chatModel의 메세지 요소를 만들어서 페이지에 추가
    for(let i = 0; i < currChat.messages.length; ++i )
    {
        const li = currChat.messages[i].createListItem();
        elemChatMessages.appendChild(li);
    }
    elemChatMessages.scrollTop = elemChatMessages.scrollHeight;
});

// 둘 중 하나만
loadChats(); // 1. 실제 사용시
updateSidebar();
// 일단 처음 시작때는 첫번째 채팅을 보는 상태로 시작
// selectChat(chats[0])

// --------------------------
// 이벤트 리스너
// mousedown - mouseup : 마우스를 누를 떄 - 마우스를 땔 때 발생하는 이벤트
elemBtnMic.addEventListener('mousedown', function (event) {
    // 기본 이벤트 헨들러가 작동하는 것을 막습니다.
    event.preventDefault(); 

    // TODO : 마이크 버튼을 클릭했을 때 음성 입력을 받아들이는 상태임을 사용자 눈에 보이게 표시합니다.
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    // TODO : 파이어폭스에서는 안되는데 어떻게?
    if (!SpeechRecognition) {
        alert('Your browser does not support the Web Speech API. Please try another browser.');
    } else {
        const recognition = new SpeechRecognition();
        recognition.lang = 'ko-KR'; // 'en-US' 영어
        recognition.interimResults = false; 

        // 작업이 끝나면 이 콜백 함수를 불러주세요
        // 목소리 녹화가 끝나면?
        recognition.onresult = function(event) {
            // 녹화된 텍스트 내용
            const text = event.results[0][0].transcript;

            // 그 내용을 텍스트 박스에다가 적어주세요
            elemTxtInput.value = text;

            // 백엔드 서버에 그 내용으로 쿼리를 보내주세요
            // submitQuery();
            submitStreamedQuery();
        };

        // 비동기적 작업 → 이 작업이 끝났을 때 내가 원하는 코드를 부르려면? 콜백함수(onresult)를 지정해야 됩니다.
        // 목소리 녹화 시작!
        recognition.start();
    }
});
elemSldConfigRate.addEventListener('change', function (event) {
    console.log("속도 값 : ", this.value);

    // TODO : 비서의 응답 속도가 속도 설정에 따라 빠르거나 느려지도록 합니다.
});

elemSldConfigVolume.addEventListener('change', function (event) {
    console.log("볼륨 값 : ", this.value);

    // TODO : 비서의 응답 소리가 볼륨 설정에 따라 크고 작아지도록 합니다.
});

elemChkConfigAutoplay.addEventListener('change', function (event) {
    console.log("자동재생 : ", this.checked);

    // TODO : 응답이 돌아왔을 때 자동으로 소리내어 읽도록 합니다.
});

elemBtnMalVoice.addEventListener('mousedown', event => {
    event.preventDefault(); // prevent default navigation behavior
    console.log("남성 목소리");
    setVoiceType('male'); // =============================================================== 아람
    // TODO : 비서의 응답 소리가 목소리 설정에 따라 달라지도록 합니다.
})

elemBtnFemVoice.addEventListener('mousedown', event => {
    event.preventDefault(); // prevent default navigation behavior
    console.log("여성 목소리");
    setVoiceType('female'); // =============================================================== 아람
    // TODO : 비서의 응답 소리가 목소리 설정에 따라 달라지도록 합니다.
})

// 목소리 유형 변수 (기본값: 남자) ============================================================= 아람
let selectedVoice = 'ko-KR-Wavenet-C';

// 목소리 유형을 설정하는 함수 ================================================================= 아람
function setVoiceType(type) {
    // 남자 목소리를 선택한 경우
    if (type === 'male') {
        selectedVoice = 'ko-KR-Wavenet-C';
    }
    // 여자 목소리를 선택한 경우
    else if (type === 'female') {
        selectedVoice = 'ko-KR-Wavenet-B';
    }
}

// API 키 =============================================================================== 아람
const apiKey = 'AIzaSyCT5ikIE-05ZiLhjAiDlRs4PgzQxsjXAgQ'; // 실제 API 키로 대체
// 음성 출력을 위한 오디오 요소
const audioOutput = new Audio();

// Google Text-to-Speech API를 사용하여 텍스트를 음성으로 변환하는 함수
function textToSpeech(text) {
    const apiUrl = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`;

    // fetch API를 사용하여 Text-to-Speech API에 요청을 보냅니다.
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            input: { text },
            voice: { languageCode: 'ko-KR', name: selectedVoice, ssmlGender: 'NEUTRAL' },
            audioConfig: { audioEncoding: 'LINEAR16' }
        }),
    })
    .then(response => response.json())
    .then(data => {
        // 오디오 URL을 생성하여 재생
        const audioUrl = `data:audio/wav;base64,${data.audioContent}`;
        audioOutput.src = audioUrl;
        audioOutput.play();
    })
    .catch(error => console.error('Error:', error));
} // ================================================================================================== 아람

// 백엔드 서버에 테스트 쿼리를 보내는 함수
function submitQuery()
{
    // i.e. "       1+1은 뭐야?    " ─(trim)→ "1+1은 뭐야?"
    // i.e. "   " ─(trim)→ ""
    let queryText = elemTxtInput.value.trim();
    // 쿼리가 비어있다면 
    if( queryText === "" )
    {
        console.log("쿼리가 비어있으므로 실행을 취소합니다.")
        return false;
    }
    // 쿼리가 비어있지 않다면
    else
    {
        // 내가 쓴 메세지 챗 모델에 추가
        currChat.addMessage("user", queryText);
        // 추가된 메세지까지 포함해서 다시 표시 : 뷰 업데이트
        selectChat(currChat);
        // `data` POST HTTP 리퀘스트에 포함시켜 보낼 json 데이터
        const data = {
            queryText: queryText,
        };
        const option = {
            method: 'POST',
            headers: {
                // 내가 보내는 데이터는 json이야.
                'Content-Type': 'application/json'
            },
            // body를 통해서 데이터를 지정
            body: JSON.stringify(data)
        };
        // POST HTTP 리퀘스트 전송
        fetch('/text-query', option)
        .then(response => response.json())
        .then(x => {
            // 메세지 내용
            let content = x.choices[0].message.content;
            // 현재 채팅 모델에 비서의 메세지 추가
            currChat.addMessage("assistant", content)
            // 추가된 메세지까지 포함해서 다시 표시 : 뷰 업데이트
            selectChat(currChat)
            textToSpeech(content); // ========================================================================= 아람
            saveChats();
        })
        .catch((error) => {
            console.error('Error:', error);
        });
        console.log("쿼리 제출. 응답 기다리는 중. (쿼리내용 : " + queryText + ")");
        return true;
    }
}

// 텍스트 입력 후 비행기 버튼을 클릭했을 때 할 일
elemBtnSubmit.addEventListener('mousedown', event => {
    event.preventDefault(); // prevent def
    // submitQuery();
    submitStreamedQuery();
})

// 텍스트 박스 안의 내용이 바뀔 떄 할 일
elemTxtInput.addEventListener('input', event => {
    console.log(event.target.value);
});

// 채팅 데이터 저장하기
window.addEventListener("beforeunload", event => {
    saveChats();
});

elemBtnNewChat.addEventListener('mousedown', event => {
    // 새로운 채팅 데이터
    const chatModel = new ChatModel();
    // 아이디는 UUID 적용
    const uuid = crypto.randomUUID();
    chatModel.id = uuid;
    // 채팅 타이틀
    chatModel.title = "새로운 채팅";
    addChat(chatModel)
    selectChat(chatModel);
});

async function fetchStreamedQuery(queryText) {
    const response = await fetch('/text-stream-query', { 
        method: 'POST' ,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            queryText: queryText,
        })
    });
    if (!response.ok) {
        throw new Error("fetchStreamedChat failed : Network response was not ok");
    }
    console.log("쿼리 제출. 응답 기다리는 중. (쿼리내용 : " + queryText + ")");
    // 사용자 메세지 추가
    currChat.addMessage("user", queryText);
    selectChat(currChat)
    // 비서 메세지 추가
    const message = currChat.addMessage("assistant", "")
    selectChat(currChat)
    const reader = response.body.getReader();
    while (true) {
        const { done, value } = await reader.read();
        if (done) {
            break;
        }
        let delta = new TextDecoder().decode(value);
        message.content = message.content + delta;
        // console.log(message.content)
        // console.log(delta);
        message.updateView();
    }
    // 비서 메세지가 완성되고 나면 음성실행
    textToSpeech(message.content);
}

function submitStreamedQuery()
{
    let queryText = elemTxtInput.value.trim();
    // 쿼리가 비어있다면 
    if( queryText === "" )
    {
        console.log("쿼리가 비어있으므로 실행을 취소합니다.")
        return false;
    }
    // 쿼리가 비어있지 않다면
    else
    {
        fetchStreamedQuery(queryText)
        .then(() => {
            console.log("뭐임")
            saveChats();
        })
        .catch(error => {
            console.error(error)
        });
    }
}
