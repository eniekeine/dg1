/*
    파일이름 : index.js
    생성일 : 2023년 10월 16일 이경근이 만들었습니다.
    설명 : index.html 파일의 로직을 지정하는 파일입니다.
*/
import {ChatModel} from './chat-model.js'
import {} from './sidebar.js'
import {prevChat, currChat, selectChat, addChat, saveChats, loadChats} from './models.js'
import {textToSpeech, stopTextToSpeech} from './tts.js'
import {setSpeed, setVoice} from './config.js'

// index.html에 있는 내가 상호작용해야하는 요소를 미리 찾아둡니다.
// 사용자가 음성 입력을 하려고 할 때 누르는 마이크 버튼
const elemBtnMic = document.querySelector('.btn-mic');
// 사용자가 응답 생성을 취소하고 싶을 때 누르는 정지 버튼
const elemBtnStopGenerating = document.querySelector('.btn-stop-generating');
// 설정에서 목소리 속도 바꾸는 슬라이더
const elemSldConfigRate = document.querySelector('#sld-config-rate');
// 설정에서 목소리 속도 바꾸는 슬라이더 값 표시
const spanSldConfigRateValue = document.getElementById('sld-config-rate-value');
// 설정에서 목소리 볼륨 바꾸는 슬라이더
//const elemSldConfigVolume = document.querySelector('#sld-config-volume');
// 설정에서 목소리 볼륨 바꾸는 슬라이더 값 표시
//const spanSldConfigVolumeValue = document.getElementById('sld-config-volume-value');
// 설정에서 자동재생 토글 버튼
const elemChkConfigAutoplay = document.querySelector('#chk-config-autoplay');
// 남자 목소리 버튼
const elemBtnMalVoice = document.querySelector('#btn-mal-voice');
const elemBtnMalVoiceTag = document.querySelector('#btn-mal-voice div');
// 여자 목소리 버튼
const elemBtnFemVoice = document.querySelector('#btn-fem-voice');
const elemBtnFemVoiceTag = document.querySelector('#btn-fem-voice div');
// 제출 버튼 (비행기 아이콘)
const elemBtnSubmit = document.querySelector('#btn-submit');
// 텍스트 상자
const elemTxtInput = document.querySelector('#txt-input');
// 채팅 메세지가 표시되는 영역
const elemChatMessages = document.querySelector('.chat-messages');
// 새 채팅 추가 버튼
const elemBtnNewChat = document.querySelector('.btn-new-chat');
// 쿼리 오브젝트
let queryObject = {
    generating : false,
}
// 현재 음성 입력을 받는 도중이면 true인 변수
let recording = false;

// 현재 보이고 있는 채팅의 메세지를 지우고, 지정된 채팅(chatModel)을 표시
document.addEventListener("chatsUpdated", event => {
    elemChatMessages.textContent='';
    // 새로운 채팅으로 옮겨간 경우, 현재 실행중인 답변을 중지
    if( prevChat != currChat )
    {
        stopTextToSpeech();
    }
    // 새로운 채팅이 주어진 경우 채팅 메세지 목록을 새로운 채팅의 내용으로 채우기
    if (currChat)
    {
        // chatModel의 메세지 요소를 만들어서 페이지에 추가
        for(let i = 0; i < currChat.messages.length; ++i )
        {
            const li = currChat.messages[i].createListItem();
            elemChatMessages.appendChild(li);
        }
        // 바닥까지 스크롤하기
        elemChatMessages.scrollTop = elemChatMessages.scrollHeight;
    }
});

document.addEventListener('chatRemoved', e => {
    const removed = e.detail.removed;
    // console.log('removed', removed)
    stopTextToSpeech();
});

// 이전 세션에서의 채팅 목록을 불러오기
loadChats();

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'ko-KR'; // 'en-US' 영어
recognition.interimResults = false; 
// TODO : 파이어폭스에서는 안되는데 어떻게?
if (!SpeechRecognition) {
    alert('Your browser does not support the Web Speech API. Please try another browser.');
} else {
    // 목소리 녹화가 끝나면?
    recognition.onresult = function(event) {
        // 녹화된 텍스트 내용
        const text = event.results[0][0].transcript;

        // 그 내용을 텍스트 박스에다가 적어주세요
        elemTxtInput.value = text;

        // 백엔드 서버에 그 내용으로 쿼리를 보내주세요
        // submitQuery();
        submitStreamedQuery();
        elemBtnMic.classList.remove('active')
        recording = false;
    };
}


// --------------------------
// 이벤트 리스너
// click - mouseup : 마우스를 누를 떄 - 마우스를 땔 때 발생하는 이벤트
elemBtnMic.addEventListener('click', function (event) {
    // 기본 이벤트 헨들러가 작동하는 것을 막습니다.
    event.preventDefault(); 

    if( recording == false )
    {
        // console.log('start');
        recognition.start();
        elemBtnMic.classList.add('active')
        recording = true;
    }
    else
    {
        // console.log('stop');
        recognition.abort();
        elemBtnMic.classList.remove('active')
        recording = false;
    }
});
elemBtnStopGenerating.addEventListener('click', function(event) {
    // 답변 생성 중일 경우 답변 생성 중지
    queryObject.generating = false;
    // 오디오 재생 중일 경우 오디오 재생 중지
    stopTextToSpeech();
    elemBtnStopGenerating.classList.add('hidden')
});
elemSldConfigRate.addEventListener('change', function (event) {
    // console.log("속도 값 : ", this.value);
    if(this.value == 0) this.value = 0.25; // 0이 될 수는 없음.
    spanSldConfigRateValue.textContent = this.value == 1 ? '보통' : (this.value + "x"); // 값 업데이트
    const speed = parseFloat(this.value);
    setSpeed(speed); // setSpeed 함수 불러옴
});

// elemSldConfigVolume.addEventListener('change', function (event) {
//     console.log("볼륨 값 : ", this.value);
//     spanSldConfigVolumeValue.textContent = this.value + "db";
//     const volume = parseFloat(this.value);
//     setVolume(volume);
// });

elemChkConfigAutoplay.addEventListener('change', function (event) {
    console.log("자동재생 : ", this.checked);
});

elemBtnMalVoice.addEventListener('click', event => {
    const voice = 'ko-KR-Wavenet-C'; 
    setVoice(voice);
    elemBtnMalVoiceTag.classList.add("active")
    elemBtnFemVoiceTag.classList.remove("active")
})

elemBtnFemVoice.addEventListener('click', event => {
    const voice = 'ko-KR-Wavenet-B'; 
    setVoice(voice); 
    elemBtnFemVoiceTag.classList.add("active")
    elemBtnMalVoiceTag.classList.remove("active")
})

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
            
            // 자동 재생이 체크되어 있을 때만 음성 출력 기능 실행
            //if (elemChkConfigAutoplay.checked) {
            //        textToSpeech(content); 
            //    } // ========================================================================= 아람
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
elemBtnSubmit.addEventListener('click', event => {
    event.preventDefault(); // prevent def
    // submitQuery();
    submitStreamedQuery();
    
})

// 엔터를 누를 시 새 줄을 입력하지 않도록 함
elemTxtInput.addEventListener('keydown', function(event) {
    // 사용자가 엔터를 입력한 경우
    if (event.key === 'Enter') {
        // shift를 누른 채가 아니었다면 쿼리를 전송합니다.
        if( !event.shiftKey )
        {
            event.preventDefault();
            submitStreamedQuery();
        }
        // shift를 누른 채였다면 새줄을 입력합니다.
    }
});

// 채팅 데이터 저장하기
window.addEventListener("beforeunload", event => {
    saveChats();
});

elemBtnNewChat.addEventListener('click', event => {
    // 새로운 채팅 데이터
    const chatModel = new ChatModel();
    addChat(chatModel)
    selectChat(chatModel);
});

async function fetchStreamedQuery(queryText) {
    const history = currChat.messages.map(function (message) {
        return {
            role: message.role,
            content: message.content
        };
    });
    // 사용자 메세지 추가
    currChat.addMessage("user", queryText);
    selectChat(currChat)
    console.log("쿼리 제출. 응답 기다리는 중. (쿼리내용 : " + queryText + ")");
    const response = await fetch('/text-stream-query', { 
        method: 'POST' ,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            history : history,
            queryText: queryText,
        })
    });
    if (!response.ok) {
        throw new Error("fetchStreamedChat failed : Network response was not ok");
    }
    
    // 비서 메세지 추가
    const message = currChat.addMessage("assistant", "")
    selectChat(currChat)
    const reader = response.body.getReader();
    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (queryObject.generating == false) {
            message.role = "system"
            message.content = message.content + " !!사용자가 응답 생성을 중지하였습니다."
            message.updateView();
            selectChat(currChat);
            return;
        }
        let delta = new TextDecoder().decode(value);
        message.content = message.content + delta;
        message.updateView();
    }
    // 자동 재생이 체크되어 있을 때만 음성 출력 기능 실행
    if (elemChkConfigAutoplay.checked) {
        textToSpeech(message.content);
    } // ========================================================================= 아람 
}

function submitStreamedQuery()
{
    // 이전 답변에 대답하는 도중일 경우 새로운 질문을 받지 않습니다.
    if(queryObject.generating == true ) return;
    let queryText = elemTxtInput.value.trim();
    // 쿼리가 비어있다면 
    if( queryText === "" )
    {
        console.log("쿼리가 비어있으므로 실행을 취소합니다.")
    }
    // 쿼리가 비어있지 않다면
    else
    {
        // 텍스트 상자의 내용을 비우기
        elemTxtInput.value = ""
        // 만약 현재 채팅이 없다면
        if( !currChat )
        {
            // 새로운 채팅을 추가
            let chatModel = new ChatModel();
            addChat(chatModel)
            selectChat(chatModel)
        }
        // 답변 생성 시작임을 알림
        queryObject.generating = true;
        elemBtnStopGenerating.classList.remove('hidden')
        fetchStreamedQuery(queryText)
        .then(() => {
            saveChats();
            // 답변 생성이 종료되었음을 알림
            queryObject.generating = false;
        })
        .catch(error => {
            // 답변 생성이 종료되었음을 알림
            queryObject.generating = false;
            console.error(error);   
            currChat.addMessage("system", "현재는 서버를 이용할 수 없습니다. 나중에 다시 시도해 주세요.");
            selectChat(currChat);
        });
    }
}
