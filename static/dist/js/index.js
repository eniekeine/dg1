(function () {
    'use strict';

    // 각각의 메세지
    class Message {
        constructor(role, content, timestamp = new Date()) {
            // i.e. user / assistant / system?
            this.role = role;
            // i.e. 가나다라마바사
            this.content = content;
            // i.e. 메세지 객체가 만들어진 시간
            this.timestamp = timestamp;
        }

        // elemChatMessages에다가 추가할 <li> 요소를 메세지로부터 생성하는 함수
        createListItem() {
            // li 요소 만들기
            const li = document.createElement('li');
            // 역할role에 따라 클래스 이름 추가
            if (this.role == "assistant" ) li.classList.add("message-assistant");
            else if( this.role == "system" ) li.classList.add("message-system");
            else if( this.role == "user" ) li.classList.add("message-user");
            // div 요소 만들기
            const divContent = document.createElement('div');
            divContent.classList.add('content');
            divContent.textContent = this.content;
            // li 요소를 div 요소의 부모로 설정
            li.appendChild(divContent);
            // 메세지 메뉴
            if( this.role == "assistant" )
            {
                const templateMessageMenu = document.querySelector('#template-message-menu').content;
                const clone = document.importNode(templateMessageMenu, true); // This creates a deep clone of the template content.
                const elemBtnPlay = clone.querySelector(".btn-play");
                const elemBtnCopy = clone.querySelector(".btn-copy");
                elemBtnPlay.addEventListener('mousedown', (event) => {
                    console.log("btn-play");
                    console.log(this.content);
                });
                elemBtnCopy.addEventListener('mousedown', (event) => {
                    console.log("btn-copy");
                    navigator.clipboard.writeText(this.content);
                    alert("'" + this.content + "' 가 클립보드에 복사되었습니다.");
                });
                li.appendChild(clone);
                this.elemBtnPlay = elemBtnPlay;
                this.elemBtnCopy = elemBtnCopy;
            }
            this.li = li;
            this.divContent = divContent;
            return li;
        }

        updateView() {
            // console.log(this.li);
            // console.log(this.divContent);
            // console.log(this.elemBtnPlay);
            // console.log(this.elemBtnCopy);
            if( this.divContent )
            {
                this.divContent.textContent = this.content;
            }
        }
    }

    // 채팅 기록
    class ChatModel {
        constructor() {
            // 오고간 메세지 목록
            this.messages = [];
            // 제목 (기본값은 "새로운 채팅")
            this.title = "새로운 채팅";
            // 아이디 (랜덤 값으로 설정)
            this.id = crypto.randomUUID();
        }

        // 새로운 메세지를 추가하는 함수
        // i.e. 사용자가 "1+1은 뭐야?"
        // i.e. ChatGPT가 "2입니다"
        addMessage(role, content) {
            // 처음 추가된 메세지를 타이틀로 설정
            if(this.messages.length == 0 ) this.title = content;
            // 메세지 객체 생성 및 추가
            const message = new Message(role, content, new Date());
            this.messages.push(message);
            return message;
        }

        // 브라우저 저장소에 저장을 하기
        saveToLocalStorage() {
            const data = JSON.stringify(this);
            // 파이선의 딕셔너리와 유사. key - value 페어
            // setItem으로 데이터를 저장하고나면 브라우저를 껐다가 켜도 데이터가 유지됩니다.
            localStorage.setItem(this.id, data);
        }

        // 브라우저 저장소에서 불러오기
        loadFromLocalStorage(id) {
            const data = localStorage.getItem(id);
            const parsed = JSON.parse(data);
            if (data) {
                this.messages = parsed.messages.map(msg => {
                    // Convert the stored date string back to a Date object
                    return new Message(
                        msg.role, 
                        msg.content, 
                        msg.timestamp
                    );
                });
                this.id = id;
                this.title = parsed.title;
            }
        }

        getMessages() {
            return this.messages;
        }
    }

    // ChatModel의 배열. 히스토리에 표시되는 채팅 목록. i.e. `why is the sky blue?, 가나다라마바사`
    const chats = [];
    // current Chat. chats 안에 있는 것들 중에서 현재 사용자가 보고있는 ChatModel
    let currChat = null;
    const evtChatsUpdated = new CustomEvent('chatsUpdated', {
        chats : chats
    });
    function selectChat(chatModel)
    {
        // 현재 채팅을 주어진 chatModel로 설정
        currChat = chatModel;
        document.dispatchEvent(evtChatsUpdated);
    }

    function addChat(chatModel)
    {
        chats.push(chatModel);
        document.dispatchEvent(evtChatsUpdated);
    }

    function saveChats()
    {
        let ids = [];
        for(let i = 0; i < chats.length; ++i )
        {
            ids.push(chats[i].id);
        }
        localStorage.setItem("ids", JSON.stringify(ids));
        for(let i = 0; i < chats.length; ++i )
        {
            chats[i].saveToLocalStorage(ids[i]);
        }
    }

    function loadChats()
    {
        let ids = JSON.parse(localStorage.getItem("ids"));
        if (ids == null)
        {
            ids = [];
        }
        for(let i = 0; i < ids.length; ++i )
        {
            const loadedChat = new ChatModel();
            loadedChat.loadFromLocalStorage(ids[i]);
            addChat(loadedChat);
        }
    }

    function removeChat(chatModel)
    {
        let index = chats.indexOf(chatModel);
        chats.splice(index, 1);
        document.dispatchEvent(evtChatsUpdated);
        document.dispatchEvent(new CustomEvent('chatRemoved', {
            detail : {
                removed : chatModel
            }
        }));
    }

    /* EXPANDER MENU */
    let navState = 'close';
    const elemNavList = document.querySelector('.nav__list');
    const toggle = document.getElementById('nav-toggle');
    const navbar = document.getElementById('navbar');
    const bodypadding = document.getElementById("body-pd");
    const elemBtnNewChatText = document.querySelector(".btn-new-chat-text");

    // 채팅 목록에 변화가 있을 경우
    document.addEventListener('chatsUpdated', e => {
        // 사이드바의 내용을 그에 맞춰 업데이트 할 것
        updateSidebar();
    });

    toggle.addEventListener('click', ()=>{
        if( navState == 'close' ) navState = 'open';
        else navState = 'close';
        navbar.classList.toggle('expander');
        bodypadding.classList.toggle('body-pd');
        showButtons(navState == 'open');
    });

    function showButtons(show)
    {
        let removeButtons = document.getElementsByClassName('btn-remove-chat');
        for( let i = 0; i < removeButtons.length; ++i )
        {
            if( show ) removeButtons[i].classList.remove('hidden');
            else removeButtons[i].classList.add('hidden');
        }
        let editButtons = document.getElementsByClassName('btn-edit-title');
        for( let i = 0; i < editButtons.length; ++i )
        {
            if( show ) editButtons[i].classList.remove('hidden');
            else editButtons[i].classList.add('hidden');
        }
        if( show ) elemBtnNewChatText.classList.remove('hidden');
        else elemBtnNewChatText.classList.add('hidden');
    }

    // 사이드바에 채팅 목록 요소를 추가하는 함수
    function updateSidebar()
    {
        elemNavList.textContent = "";
        for(let i = 0; i < chats.length; ++i )
        {
            let nl = createNavLink(chats[i]);
            elemNavList.appendChild(nl);
            nl.chatModel = chats[i];
        }
        showButtons(navState == 'open');
    }

    // 히스토리에 표시되는 채팅 목록 요소를 만드는 함수
    function createNavLink(chatModel) {
        const templateNavLink = document.querySelector('#template-nav-link').content;
        const clone = document.importNode(templateNavLink, true); // This creates a deep clone of the template content.
        const anchor = clone.querySelector('.nav__link');
        const elemBtnRemoveChat = clone.querySelector('.btn-remove-chat');
        const elemBtnEditTitle = clone.querySelector('.btn-edit-title');
        const span = anchor.querySelector('span');
        const elemTxtEditTitle = clone.querySelector('.txt-edit-title');
        span.textContent = chatModel.title;
        anchor.addEventListener('mousedown', event => {
            selectChat(chatModel);
        });
        elemBtnRemoveChat.addEventListener('mousedown', event =>{
            if( currChat == chatModel ) selectChat(null);
            removeChat(chatModel);
        });
        elemBtnEditTitle.addEventListener('mousedown', event => {
            console.log("edit");
            elemTxtEditTitle.classList.remove('hidden');
        });
        elemTxtEditTitle.addEventListener('keyup', event => {
            if(event.key === "Escape") 
            {
                elemTxtEditTitle.classList.add('hidden');
            }
            else if (event.key === "Enter" )
            {
                const newTitle = elemTxtEditTitle.value.trim();
                if (newTitle === "" ) return;
                chatModel.title = elemTxtEditTitle.value;
                elemTxtEditTitle.classList.add('hidden');
                updateSidebar();
            }
        });
        if ( chatModel == currChat ) anchor.classList.add('active');
        return clone;
    }

    /*
        파일이름 : index.js
        생성일 : 2023년 10월 16일 이경근이 만들었습니다.
        설명 : index.html 파일의 로직을 지정하는 파일입니다.
    */

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
    const elemBtnNewChat = document.querySelector('.btn-new-chat');
    // 채팅 히스토리 목록
    document.querySelector('.nav__list');

    // 현재 보이고 있는 채팅의 메세지를 지우고, 지정된 채팅(chatModel)을 표시
    document.addEventListener("chatsUpdated", event => {
        elemChatMessages.textContent='';
        // 새로운 채팅으로 옮겨간 경우, 현재 실행중인 답변을 중지
        // if (prevChat != currChat ) audioOutput.pause(); // audioOutput 요소를 노출시켜 주셔야 할 수 있어요
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
        console.log('removed', removed);
    });

    // 이전 세션에서의 채팅 목록을 불러오기
    loadChats();
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
        
    });

    elemBtnFemVoice.addEventListener('mousedown', event => {
        event.preventDefault(); // prevent default navigation behavior
        console.log("여성 목소리");
        
    });

    // 목소리 유형을 설정하는 함수 ================================================================= 아람
    function setVoiceType(type) {
        // 남자 목소리를 선택한 경우
        if (type === 'male') {
            return 'ko-KR-Wavenet-C';
        }
        // 여자 목소리를 선택한 경우
        else if (type === 'female') {
            return 'ko-KR-Wavenet-B';
        }
        // 기본 목소리 값 남자
        return 'ko-KR-Wavenet-C';
    }

    // Google Text-to-Speech API를 사용하여 텍스트를 음성으로 변환하는 함수 ========================================= 아람
    function textToSpeech(text, type) {
        // API 키
        const apiKey = 'AIzaSyCT5ikIE-05ZiLhjAiDlRs4PgzQxsjXAgQ'; // 실제 API 키로 대체
        // 음성 출력을 위한 오디오 요소
        const audioOutput = new Audio();
        const apiUrl = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`;

        // fetch API를 사용하여 Text-to-Speech API에 요청을 보냅니다.
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                input: { text },
                voice: { languageCode: 'ko-KR', name: setVoiceType(type) },
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

    // 텍스트 입력 후 비행기 버튼을 클릭했을 때 할 일
    elemBtnSubmit.addEventListener('mousedown', event => {
        event.preventDefault(); // prevent def
        // submitQuery();
        submitStreamedQuery();
    });

    // 텍스트 박스 안의 내용이 바뀔 떄 할 일
    elemTxtInput.addEventListener('keyup', event => {
        if (event.key === 'Enter' || event.keyCode === 13) {
            submitStreamedQuery();
        }
    });

    // 채팅 데이터 저장하기
    window.addEventListener("beforeunload", event => {
        saveChats();
    });

    elemBtnNewChat.addEventListener('mousedown', event => {
        // 새로운 채팅 데이터
        const chatModel = new ChatModel();
        addChat(chatModel);
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
        selectChat(currChat);
        // 비서 메세지 추가
        const message = currChat.addMessage("assistant", "");
        selectChat(currChat);
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
            console.log("쿼리가 비어있으므로 실행을 취소합니다.");
            return false;
        }
        // 쿼리가 비어있지 않다면
        else
        {
            // 텍스트 상자의 내용을 비우기
            elemTxtInput.value = "";
            // 만약 현재 채팅이 없다면
            if( !currChat )
            {
                // 새로운 채팅을 추가
                let chatModel = new ChatModel();
                addChat(chatModel);
                selectChat(chatModel);
            }
            fetchStreamedQuery(queryText)
            .then(() => {
                saveChats();
            })
            .catch(error => {
                console.error(error);
            });
        }
    }

})();
